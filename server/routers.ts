import z from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createAssessmentRequest, calculateAssessmentPrice, seedPropertyDatabase } from "./db";
import { generateMarketAnalysis } from "./market-analysis";

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
