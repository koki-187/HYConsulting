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
        // アパート専用フィールド
        buildingStructure: z.string().optional(), // 建築構造（木造、軽量鉄骨、鉄骨造、RC、SRC）
        floors: z.number().optional(), // 階建（1～5階）
      }))
      .mutation(async ({ input }) => {
        console.log('[Assessment API] Received request:', input);
        try {
          console.log('[Assessment API] Calling calculateAssessment...');
          // Calculate estimated price using aggregated data
          const assessmentResult = await calculateAssessment({
            prefecture: input.prefecture,
            city: input.city,
            propertyType: input.propertyType as "land" | "house" | "condo" | "apartment",
            landAreaM2: input.landArea,
            buildingAreaM2: input.floorArea,
            buildingYear: input.buildingAge ? new Date().getFullYear() - input.buildingAge : undefined,
            stationDistanceMin: input.walkingMinutes,
            // アパート専用フィールド
            buildingStructure: input.buildingStructure,
            floors: input.floors,
          });
          console.log('[Assessment API] Assessment result:', assessmentResult);
          
          const estimatedPrice = Math.round(assessmentResult.estimatedMidYen / 10000); // Convert to 万円
          console.log('[Assessment API] Estimated price:', estimatedPrice, '万円');

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

          // Send data to Google Sheets via webhook (non-blocking)
          const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
          if (webhookUrl) {
            // Capture variables for background task
            const webhookInput = { ...input };
            const webhookAssessmentResult = { ...assessmentResult };
            const webhookEstimatedPrice = estimatedPrice;
            
            // Run webhook in background without blocking response
            (async () => {
              try {
                // Calculate price range in 万円 (10,000 yen units)
                const estimatedLowManYen = Math.round(webhookAssessmentResult.estimatedLowYen / 10000);
                const estimatedHighManYen = Math.round(webhookAssessmentResult.estimatedHighYen / 10000);
                const priceRangeText = webhookEstimatedPrice 
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
                const propertyTypeJa = propertyTypeMap[webhookInput.propertyType] || webhookInput.propertyType;

                // Format location (prefecture + city)
                const locationText = `${webhookInput.prefecture}${webhookInput.city}`;

                // Format station info
                const stationText = webhookInput.nearestStation || "未入力";
                const walkingText = webhookInput.walkingMinutes ? `${webhookInput.walkingMinutes}分` : "未入力";

                // Format timestamp as Japan time "YYYY-MM-DD HH:mm"
                const now = new Date();
                const jstOffset = 9 * 60; // JST is UTC+9
                const jstTime = new Date(now.getTime() + jstOffset * 60 * 1000);
                const formattedTimestamp = jstTime.toISOString()
                  .replace('T', ' ')
                  .substring(0, 16); // "YYYY-MM-DD HH:mm"

                // Format phone number as string with leading zero
                const formattedPhone = webhookInput.phone ? String(webhookInput.phone).padStart(11, '0') : "";

                // アパート専用フィールドのフォーマット
                const buildingStructureText = webhookInput.propertyType === "apartment" && webhookInput.buildingStructure 
                  ? webhookInput.buildingStructure 
                  : "";
                const floorsText = webhookInput.propertyType === "apartment" && webhookInput.floors 
                  ? `${webhookInput.floors}階建` 
                  : "";

                const webhookData = {
                  timestamp: formattedTimestamp,
                  ownerName: webhookInput.ownerName || "匿名",
                  email: webhookInput.email || "",
                  phone: formattedPhone,
                  propertyType: propertyTypeJa,
                  prefecture: webhookInput.prefecture,
                  city: webhookInput.city,
                  address: locationText,
                  floorArea: webhookInput.floorArea || "",
                  buildingAge: webhookInput.buildingAge || "",
                  estimatedPrice: priceRangeText,
                  nearestStation: stationText,
                  walkingMinutes: walkingText,
                  // アパート専用フィールド（アパート査定時のみ値が入る）
                  buildingStructure: buildingStructureText,
                  floors: floorsText,
                };
                
                const webhookController = new AbortController();
                const webhookTimeout = setTimeout(() => webhookController.abort(), 5000); // 5秒タイムアウト
                
                const webhookResponse = await fetch(webhookUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(webhookData),
                  signal: webhookController.signal,
                });
                
                clearTimeout(webhookTimeout);
                
                if (webhookResponse.ok) {
                  console.log("Data sent to Google Sheets successfully");
                } else {
                  console.warn("Failed to send data to Google Sheets:", await webhookResponse.text());
                }
              } catch (e) {
                if (e instanceof Error && e.name === 'AbortError') {
                  console.warn("Google Sheets webhook timeout (5s)");
                } else {
                  console.warn("Failed to send data to Google Sheets:", e);
                }
              }
            })().catch(err => console.error("Background webhook error:", err));
          }

          // Send email if user provided email address and it's not the default (non-blocking)
          if (input.email && input.email !== "" && input.email !== "noreply@hy-consulting.jp") {
            // Capture variables for background task
            const emailInput = { ...input };
            const emailAssessmentResult = { ...assessmentResult };
            const emailEstimatedPrice = estimatedPrice;
            
            // Run email sending in background without blocking response
            (async () => {
              try {
                const emailData = {
                  propertyType: emailInput.propertyType,
                  prefecture: emailInput.prefecture,
                  city: emailInput.city,
                  location: emailInput.location,
                  estimatedLowYen: emailAssessmentResult.estimatedLowYen,
                  estimatedHighYen: emailAssessmentResult.estimatedHighYen,
                  estimatedPrice: emailEstimatedPrice || 0,
                  message: emailEstimatedPrice 
                    ? `ご依頼いただいた物件の査定が完了いたしました。推定価格は${emailEstimatedPrice}万円です。詳細はメール本文をご確認ください。` 
                    : "査定リクエストを受け付けました。後ほど詳細をご連絡いたします。",
                  confidence: 75,
                  pricePerM2: emailInput.floorArea && emailEstimatedPrice ? (emailEstimatedPrice * 10000) / emailInput.floorArea : undefined,
                  floorArea: emailInput.floorArea,
                  buildingAge: emailInput.buildingAge,
                  marketTrend: "stable",
                };
                
                const emailPromise = emailService.sendAssessmentEmail(emailInput.email!, emailData);
                const emailTimeout = new Promise<{ success: boolean; error: string }>((resolve) => {
                  setTimeout(() => resolve({ success: false, error: "Email timeout (10s)" }), 10000);
                });
                const emailResult = await Promise.race([emailPromise, emailTimeout]);
                if (emailResult.success) {
                  console.log(`Email sent successfully to ${emailInput.email}`);
                } else {
                  console.warn(`Failed to send email to ${emailInput.email}:`, emailResult.error);
                }
              } catch (e) {
                console.warn("Failed to send assessment email:", e);
              }
            })().catch(err => console.error("Background email error:", err));
          }

          // 信頼度計算ロジック
          // 各要素を25%ずつの重みで計算（合計100%）
          const transactionCount = assessmentResult.marketAnalysis.transactionCount;
          const compsUsedCount = assessmentResult.compsUsedCount;
          
          // 1. データ件数スコア (25%): 取引件数に基づく
          // 50件以上で満点、10件以下で最低点
          let dataVolumeScore: number;
          let dataVolumeDetails: string;
          if (transactionCount >= 50) {
            dataVolumeScore = 25;
            dataVolumeDetails = `${transactionCount}件の取引データを参照（十分なデータ量）`;
          } else if (transactionCount >= 30) {
            dataVolumeScore = 22;
            dataVolumeDetails = `${transactionCount}件の取引データを参照（良好なデータ量）`;
          } else if (transactionCount >= 20) {
            dataVolumeScore = 18;
            dataVolumeDetails = `${transactionCount}件の取引データを参照（標準的なデータ量）`;
          } else if (transactionCount >= 10) {
            dataVolumeScore = 14;
            dataVolumeDetails = `${transactionCount}件の取引データを参照（やや少ないデータ量）`;
          } else if (transactionCount >= 5) {
            dataVolumeScore = 10;
            dataVolumeDetails = `${transactionCount}件の取引データを参照（限定的なデータ量）`;
          } else {
            dataVolumeScore = 5;
            dataVolumeDetails = `${transactionCount}件の取引データを参照（データ量が少ない）`;
          }
          
          // 2. 地域一致度スコア (25%): 同一市区町村のデータ割合
          // compsUsedCountが同一市区町村のデータ件数を表す
          let locationMatchScore: number;
          let locationMatchDetails: string;
          const locationMatchRatio = compsUsedCount / Math.max(transactionCount, 1);
          if (locationMatchRatio >= 0.8) {
            locationMatchScore = 25;
            locationMatchDetails = `同一市区町村の類似物件${compsUsedCount}件を参照（高い地域一致度）`;
          } else if (locationMatchRatio >= 0.6) {
            locationMatchScore = 20;
            locationMatchDetails = `同一市区町村の類似物件${compsUsedCount}件を参照（良好な地域一致度）`;
          } else if (locationMatchRatio >= 0.4) {
            locationMatchScore = 15;
            locationMatchDetails = `同一市区町村の類似物件${compsUsedCount}件を参照（標準的な地域一致度）`;
          } else if (locationMatchRatio >= 0.2) {
            locationMatchScore = 10;
            locationMatchDetails = `同一市区町村の類似物件${compsUsedCount}件を参照（やや低い地域一致度）`;
          } else {
            locationMatchScore = 5;
            locationMatchDetails = `同一市区町村の類似物件${compsUsedCount}件を参照（地域一致度が低い）`;
          }
          
          // 3. 築年数類似性スコア (25%): 築年数調整係数に基づく
          let buildingAgeSimilarityScore: number;
          let buildingAgeSimilarityDetails: string;
          const buildingYearAdj = assessmentResult.adjustmentFactors.buildingYearAdjustment;
          const buildingYearDiff = Math.abs(buildingYearAdj - 1.0);
          if (input.propertyType === "land") {
            // 土地の場合は築年数関係なし
            buildingAgeSimilarityScore = 25;
            buildingAgeSimilarityDetails = "土地のため築年数は査定に影響しません";
          } else if (buildingYearDiff <= 0.05) {
            buildingAgeSimilarityScore = 25;
            buildingAgeSimilarityDetails = "類似築年数の物件が多く、高い精度で算出";
          } else if (buildingYearDiff <= 0.10) {
            buildingAgeSimilarityScore = 20;
            buildingAgeSimilarityDetails = "築年数が近い物件を参照して算出";
          } else if (buildingYearDiff <= 0.15) {
            buildingAgeSimilarityScore = 15;
            buildingAgeSimilarityDetails = "築年数にやや差がある物件を参照して算出";
          } else if (buildingYearDiff <= 0.20) {
            buildingAgeSimilarityScore = 10;
            buildingAgeSimilarityDetails = "築年数に差がある物件を参照して算出";
          } else {
            buildingAgeSimilarityScore = 5;
            buildingAgeSimilarityDetails = "築年数が大きく異なる物件を参照して算出";
          }
          
          // 4. 物件種別一致度スコア (25%): 同一物件種別のデータ割合
          // 物件種別は完全一致のみを使用しているため、基本的に高スコア
          let propertyTypeMatchScore: number;
          let propertyTypeMatchDetails: string;
          if (compsUsedCount >= 20) {
            propertyTypeMatchScore = 25;
            propertyTypeMatchDetails = `同一物件種別（${input.propertyType === 'house' ? '戸建て' : input.propertyType === 'condo' ? 'マンション' : input.propertyType === 'land' ? '土地' : 'アパート'}）のデータを十分に参照`;
          } else if (compsUsedCount >= 10) {
            propertyTypeMatchScore = 20;
            propertyTypeMatchDetails = `同一物件種別のデータを参照`;
          } else if (compsUsedCount >= 5) {
            propertyTypeMatchScore = 15;
            propertyTypeMatchDetails = `同一物件種別のデータを限定的に参照`;
          } else {
            propertyTypeMatchScore = 10;
            propertyTypeMatchDetails = `同一物件種別のデータが少ない`;
          }
          
          // 総合スコア計算
          const totalScore = dataVolumeScore + locationMatchScore + buildingAgeSimilarityScore + propertyTypeMatchScore;
          
          const confidenceBreakdown = {
            totalScore,
            dataVolumeScore,
            locationMatchScore,
            buildingAgeSimilarityScore,
            propertyTypeMatchScore,
            dataVolumeDetails,
            locationMatchDetails,
            buildingAgeSimilarityDetails,
            propertyTypeMatchDetails,
          };

          return {
            success: true,
            estimatedPrice: estimatedPrice,
            estimatedLowYen: assessmentResult.estimatedLowYen,
            estimatedHighYen: assessmentResult.estimatedHighYen,
            estimatedMidYen: assessmentResult.estimatedMidYen,
            message: `概算査定価格: ${estimatedPrice}万円`,
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
            confidenceBreakdown: confidenceBreakdown,
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
          console.error("[Assessment API] Assessment submission error:", error);
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
