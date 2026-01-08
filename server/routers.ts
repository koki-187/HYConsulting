import z from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createAssessmentRequest, calculateAssessmentPrice, seedPropertyDatabase } from "./db";
import { calculateAssessment } from "./assessment";
import { generateMarketAnalysis } from "./market-analysis";
import emailService from "./email-service";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  assessment: router({
    /**
     * Submit property assessment request
     */
    submit: publicProcedure
      .input(z.object({
        propertyType: z.string(),
        prefecture: z.string(),
        city: z.string(),
        location: z.string(),
        buildingAge: z.number().optional(),
        floorArea: z.number().optional(),
        landArea: z.number().optional(),
        condition: z.string().optional(),
        ownerName: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional(),
        nearestStation: z.string().optional(),
        walkingMinutes: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Calculate estimated price using aggregated data
          const assessmentResult = await calculateAssessment({
            prefecture: input.prefecture,
            city: input.city,
            propertyType: input.propertyType as "land" | "house" | "condo" | "apartment",
            landAreaM2: input.landArea,
            buildingAreaM2: input.floorArea,
            buildingYear: input.buildingAge ? new Date().getFullYear() - input.buildingAge : undefined,
            stationDistanceMin: input.walkingMinutes,
          });
          
          const estimatedPrice = Math.round(assessmentResult.estimatedMidYen / 10000); // Convert to 万円

          // Create assessment request
          const result = await createAssessmentRequest({
            propertyType: input.propertyType,
            prefecture: input.prefecture,
            city: input.city,
            location: input.location,
            buildingAge: input.buildingAge,
            floorArea: input.floorArea,
            landArea: input.landArea,
            condition: input.condition,
            ownerName: input.ownerName || "Anonymous",
            email: input.email || "noreply@hy-consulting.jp",
            phone: input.phone,
            estimatedPrice: estimatedPrice || undefined,
            assessmentStatus: estimatedPrice ? "completed" : "pending",
          });

          // Generate market analysis data
          let marketAnalysis = null;
          try {
            marketAnalysis = await generateMarketAnalysis(input.prefecture, input.propertyType);
          } catch (e) {
            console.warn("Failed to generate market analysis:", e);
          }

          // Send data to Google Sheets via webhook
          if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
            try {
              // Calculate price range in 万円 (10,000 yen units)
              const estimatedLowManYen = Math.round(assessmentResult.estimatedLowYen / 10000);
              const estimatedHighManYen = Math.round(assessmentResult.estimatedHighYen / 10000);
              const priceRangeText = estimatedPrice 
                ? `${estimatedLowManYen.toLocaleString('ja-JP')}万円～${estimatedHighManYen.toLocaleString('ja-JP')}万円`
                : "査定中";

              // Format property type in Japanese
              const propertyTypeMap: Record<string, string> = {
                house: "戸建て",
                mansion: "マンション",
                land: "土地",
                apartment: "アパート",
                condo: "マンション",
              };
              const propertyTypeJa = propertyTypeMap[input.propertyType] || input.propertyType;

              // Format location (prefecture + city)
              const locationText = `${input.prefecture}${input.city}`;

              // Format station info
              const stationText = input.nearestStation || "未入力";
              const walkingText = input.walkingMinutes ? `${input.walkingMinutes}分` : "未入力";

              const webhookData = {
                timestamp: new Date().toISOString(),
                ownerName: input.ownerName || "匿名",
                email: input.email || "",
                phone: input.phone || "",
                propertyType: propertyTypeJa,
                prefecture: input.prefecture,
                city: input.city,
                address: locationText,
                floorArea: input.floorArea || "",
                buildingAge: input.buildingAge || "",
                estimatedPrice: priceRangeText,
                nearestStation: stationText,
                walkingMinutes: walkingText,
              };
              
              const webhookResponse = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(webhookData),
              });
              
              if (webhookResponse.ok) {
                console.log("Data sent to Google Sheets successfully");
              } else {
                console.warn("Failed to send data to Google Sheets:", await webhookResponse.text());
              }
            } catch (e) {
              console.warn("Failed to send data to Google Sheets:", e);
            }
          }

          // Send email if user provided email address and it's not the default
          if (input.email && input.email !== "" && input.email !== "noreply@hy-consulting.jp") {
            try {
              const emailData = {
                propertyType: input.propertyType,
                prefecture: input.prefecture,
                city: input.city,
                location: input.location,
                estimatedLowYen: assessmentResult.estimatedLowYen,
                estimatedHighYen: assessmentResult.estimatedHighYen,
                estimatedPrice: estimatedPrice || 0,
                message: estimatedPrice 
                  ? `ご依頼いただいた物件の査定が完了いたしました。推定価格は${estimatedPrice}万円です。詳細はメール本文をご確認ください。` 
                  : "査定リクエストを受け付けました。後ほど詳細をご連絡いたします。",
                confidence: 75,
                pricePerM2: input.floorArea && estimatedPrice ? (estimatedPrice * 10000) / input.floorArea : undefined,
                floorArea: input.floorArea,
                buildingAge: input.buildingAge,
                marketTrend: "stable",
              };
              
              const emailResult = await emailService.sendAssessmentEmail(input.email, emailData);
              if (emailResult.success) {
                console.log(`Email sent successfully to ${input.email}`);
              } else {
                console.warn(`Failed to send email to ${input.email}:`, emailResult.error);
              }
            } catch (e) {
              console.warn("Failed to send assessment email:", e);
            }
          }

          return {
            success: true,
            estimatedPrice: estimatedPrice,
            estimatedLowYen: assessmentResult.estimatedLowYen,
            estimatedHighYen: assessmentResult.estimatedHighYen,
            estimatedMidYen: assessmentResult.estimatedMidYen,
            message: `査定価格: ${estimatedPrice}万円`,
            explanation: assessmentResult.explanation,
            compsUsedCount: assessmentResult.compsUsedCount,
            method: assessmentResult.method,
            methodVersion: assessmentResult.methodVersion,
            marketAnalysis: {
              surroundingPrice: assessmentResult.marketAnalysis.surroundingPrice,
              transactionCount: assessmentResult.marketAnalysis.transactionCount,
              avgPricePerM2: assessmentResult.marketAnalysis.avgPricePerM2,
              marketTrend: assessmentResult.marketAnalysis.marketTrend,
            },
            adjustmentFactors: assessmentResult.adjustmentFactors,
            forecastAnalysis: assessmentResult.forecastAnalysis,
            propertyData: {
              propertyType: input.propertyType,
              prefecture: input.prefecture,
              city: input.city,
              location: input.location,
              floorArea: input.floorArea,
              buildingAge: input.buildingAge,
            },
          };
        } catch (error) {
          console.error("Assessment submission error:", error);
          throw new Error(error instanceof Error ? error.message : "査定リクエストの送信に失敗しました。");
        }
      }),

    /**
     * Get assessment history (for admin/dashboard)
     */
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        try {
          const { getAssessmentRequests } = await import("./db");
          const requests = await getAssessmentRequests(input.limit, input.offset);
          return {
            success: true,
            requests: requests,
          };
        } catch (error) {
          console.error("Assessment list error:", error);
          return {
            success: false,
            message: "査定履歴の取得に失敗しました。",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
