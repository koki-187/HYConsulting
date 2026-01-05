import z from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createAssessmentRequest, calculateAssessmentPrice, seedPropertyDatabase } from "./db";
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
          // Seed database if needed
          await seedPropertyDatabase();
          
          // Calculate estimated price
          const estimatedPrice = await calculateAssessmentPrice(
            input.propertyType,
            input.location,
            input.buildingAge || 0,
            input.floorArea || 0,
            input.condition || "fair"
          );

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
              const estimatedLowManYen = estimatedPrice ? Math.round(estimatedPrice * 0.85) : 0;
              const estimatedHighManYen = estimatedPrice ? Math.round(estimatedPrice * 1.15) : 0;
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
                estimatedLowYen: estimatedPrice ? estimatedPrice * 0.85 * 10000 : 0,
                estimatedHighYen: estimatedPrice ? estimatedPrice * 1.15 * 10000 : 0,
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
            estimatedLowYen: estimatedPrice ? estimatedPrice * 0.85 * 10000 : 0,
            estimatedHighYen: estimatedPrice ? estimatedPrice * 1.15 * 10000 : 0,
            message: estimatedPrice 
              ? `査定価格: ${estimatedPrice}万円` 
              : "査定リクエストを受け付けました。後ほど詳細をご連絡いたします。",
            marketAnalysis: marketAnalysis,
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
          return {
            success: false,
            message: "査定リクエストの送信に失敗しました。",
          };
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
