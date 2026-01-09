"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MapPin, DollarSign, Home, Calendar, Users, BarChart3, ArrowUpRight, ArrowDownRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { MarketAnalysisCharts } from "@/components/charts/MarketAnalysisCharts";

import type { PriceTrendData } from "@/components/charts/PriceTrendChart";
import type { PriceDistributionData, PropertyTypeComparison, StationDistanceAnalysis, BuildingAgeAnalysis } from "@/components/charts/MarketAnalysisCharts";

interface AssessmentResultProps {
  result: {
    estimatedLowYen: number;
    estimatedHighYen: number;
    explanation: string;
    compsUsedCount: number;
    marketTrend?: string;
    pricePerM2?: number;
    comparableCount?: number;
    confidence?: number;
    marketAnalysis?: {
      transactionCount: number;
      surroundingPrice: number;
      avgPricePerM2: number;
      marketTrend: string;
    };
    confidenceBreakdown?: {
      totalScore: number;
      dataVolumeScore: number;
      locationMatchScore: number;
      buildingAgeSimilarityScore: number;
      propertyTypeMatchScore: number;
      dataVolumeDetails: string;
      locationMatchDetails: string;
      buildingAgeSimilarityDetails: string;
      propertyTypeMatchDetails: string;
    };
  };
  propertyData: {
    propertyType: string;
    prefecture: string;
    city: string;
    location: string;
    floorArea?: number;
    buildingAge?: number;
    nearestStation?: string;
    walkingMinutes?: number;
  };
  marketAnalysis?: {
    priceTrends?: PriceTrendData[];
    priceDistribution?: PriceDistributionData[];
    propertyTypeComparison?: PropertyTypeComparison[];
    stationDistanceAnalysis?: StationDistanceAnalysis[];
    buildingAgeAnalysis?: BuildingAgeAnalysis[];
  };
  onReset: () => void;
}

export default function AssessmentResult({ result, propertyData, marketAnalysis, onReset }: AssessmentResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatPrice = (price: number) => {
    // Format in 万円 (10,000 yen units)
    const manYen = Math.round(price / 10000);
    return `${manYen.toLocaleString('ja-JP')}万円`;
  };

  const formatPriceDetailed = (price: number) => {
    return `¥${price.toLocaleString('ja-JP')}`;
  };

  const midPrice = (result.estimatedLowYen + result.estimatedHighYen) / 2;
  const priceRange = result.estimatedHighYen - result.estimatedLowYen;
  const rangePercent = ((priceRange / midPrice) * 100).toFixed(1);

  const getTrendIcon = (trend?: string) => {
    if (trend === "上昇傾向") return <ArrowUpRight className="w-5 h-5 text-green-600" />;
    if (trend === "下降傾向") return <ArrowDownRight className="w-5 h-5 text-red-600" />;
    return <TrendingUp className="w-5 h-5 text-slate-400" />;
  };

  const getTrendColor = (trend?: string) => {
    if (trend === "上昇傾向") return "bg-green-50 border-green-200";
    if (trend === "下降傾向") return "bg-red-50 border-red-200";
    return "bg-slate-50 border-slate-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
      <Card className="bg-gradient-to-br from-primary/5 via-white to-accent/5 border-2 border-primary/20 overflow-hidden">
        <div className="p-8 lg:p-10">
          {/* Success Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">査定完了</h3>
              <p className="text-slate-600 text-sm">概算価格を算出しました</p>
            </div>
          </div>

          {/* Main Price Display */}
          <div className="mb-8">
            <p className="text-slate-600 text-sm font-medium mb-2">推定価格</p>
            <div className="flex items-baseline gap-4 mb-4">
              <div className="text-5xl lg:text-6xl font-bold text-primary">
                {formatPrice(result.estimatedLowYen)}～{formatPrice(result.estimatedHighYen)}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">概算最低価格</p>
                  <p className="text-lg font-bold text-slate-700">{formatPrice(result.estimatedLowYen)}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatPriceDetailed(result.estimatedLowYen)}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-medium mb-2">概算価格</p>
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">概算最高価格</p>
                  <p className="text-lg font-bold text-slate-700">{formatPrice(result.estimatedHighYen)}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatPriceDetailed(result.estimatedHighYen)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-2">物件種別</p>
              <p className="font-bold text-slate-700">
                {propertyData.propertyType === "house" && "戸建て"}
                {propertyData.propertyType === "mansion" && "マンション"}
                {propertyData.propertyType === "condo" && "マンション"}
                {propertyData.propertyType === "land" && "土地"}
                {propertyData.propertyType === "apartment" && "アパート"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-2">所在地</p>
              <p className="font-bold text-slate-700 text-sm">{propertyData.prefecture}</p>
              <p className="text-xs text-slate-600">{propertyData.city}</p>
            </div>
            {propertyData.floorArea && (
              <div className="bg-white rounded-lg p-4 border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-2">面積</p>
                <p className="font-bold text-slate-700">{propertyData.floorArea} m²</p>
              </div>
            )}
            {propertyData.buildingAge && (
              <div className="bg-white rounded-lg p-4 border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-2">築年数</p>
                <p className="font-bold text-slate-700">{propertyData.buildingAge} 年</p>
              </div>
            )}
          </div>

          {/* Analysis Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Comparable Transactions */}
            <div className={`rounded-lg p-4 border ${getTrendColor(result.marketTrend)}`}>
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-slate-700">類似取引</h4>
              </div>
              <p className="text-2xl font-bold text-primary mb-1">{result.marketAnalysis?.transactionCount || result.compsUsedCount}</p>
              <p className="text-sm text-slate-600">件の取引データを参照</p>
            </div>

            {/* Market Trend */}
            <div className={`rounded-lg p-4 border ${getTrendColor(result.marketTrend)}`}>
              <div className="flex items-center gap-3 mb-3">
                {getTrendIcon(result.marketTrend)}
                <h4 className="font-bold text-slate-700">市場トレンド</h4>
              </div>
              <p className="text-lg font-bold text-primary mb-1">{result.marketTrend || "安定"}</p>
              <p className="text-sm text-slate-600">この地域の価格動向</p>
            </div>
          </div>

          {/* Explanation */}
          {result.explanation && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-8">
              <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full" />
                査定根拠
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                概算査定価格: {formatPrice((result.estimatedLowYen + result.estimatedHighYen) / 2)}
              </p>
              <p className="text-slate-600 text-xs leading-relaxed mt-2">{result.explanation}</p>
            </div>
          )}

          {/* Confidence Level with Breakdown */}
          {(result.confidence || result.confidenceBreakdown) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">査定の信頼度</span>
                <span className="text-2xl font-bold text-primary">
                  {result.confidenceBreakdown?.totalScore || result.confidence}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${result.confidenceBreakdown?.totalScore || result.confidence}%` }}
                />
              </div>
              
              {/* Confidence Breakdown Details */}
              {result.confidenceBreakdown && (
                <div className="bg-white rounded-lg border border-slate-200 p-4 mt-4">
                  <h4 className="font-bold text-slate-700 mb-4 text-sm">信頼度の詳細内訳</h4>
                  <div className="space-y-4">
                    {/* Data Volume Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600">参照データ件数</span>
                        <span className="text-sm font-bold text-primary">{result.confidenceBreakdown.dataVolumeScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(result.confidenceBreakdown.dataVolumeScore / 25) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{result.confidenceBreakdown.dataVolumeDetails}</p>
                    </div>

                    {/* Location Match Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600">地域一致度</span>
                        <span className="text-sm font-bold text-primary">{result.confidenceBreakdown.locationMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(result.confidenceBreakdown.locationMatchScore / 25) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{result.confidenceBreakdown.locationMatchDetails}</p>
                    </div>

                    {/* Building Age Similarity Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600">築年数類似性</span>
                        <span className="text-sm font-bold text-primary">{result.confidenceBreakdown.buildingAgeSimilarityScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(result.confidenceBreakdown.buildingAgeSimilarityScore / 25) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{result.confidenceBreakdown.buildingAgeSimilarityDetails}</p>
                    </div>

                    {/* Property Type Match Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600">物件種別一致度</span>
                        <span className="text-sm font-bold text-primary">{result.confidenceBreakdown.propertyTypeMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(result.confidenceBreakdown.propertyTypeMatchScore / 25) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">{result.confidenceBreakdown.propertyTypeMatchDetails}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {!result.confidenceBreakdown && (
                <p className="text-xs text-slate-600 mt-2">
                  信頼度は、参照した取引データの件数、地域の一致度、築年数の類似性に基づいて算出されています。
                </p>
              )}

              {/* Confidence Improvement Advice */}
              {result.confidenceBreakdown && (
                <div className="mt-4">
                  {result.confidenceBreakdown.totalScore < 60 && (
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-amber-900 mb-2 text-sm">より正確な査定をご希望の場合</h5>
                          <p className="text-sm text-amber-800 leading-relaxed mb-3">
                            現在の信頼度は{result.confidenceBreakdown.totalScore}%です。訪問査定では、物件の状態、周辺環境、設備などを直接確認し、より正確な価格を算出できます。
                          </p>
                          <a
                            href="https://hyconsulting.jp/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                          >
                            <Home className="w-4 h-4" />
                            訪問査定を依頼する（無料）
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.confidenceBreakdown.totalScore >= 60 && result.confidenceBreakdown.totalScore < 80 && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-blue-900 mb-2 text-sm">信頼度を高めるには</h5>
                          <p className="text-sm text-blue-800 leading-relaxed mb-3">
                            現在の信頼度は{result.confidenceBreakdown.totalScore}%です。訪問査定では、物件の個別要因（日当たり、眺望、リフォーム状況など）を考慮し、より精度の高い査定が可能です。
                          </p>
                          <a
                            href="https://hyconsulting.jp/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                          >
                            <Home className="w-4 h-4" />
                            訪問査定を依頼する（無料）
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.confidenceBreakdown.totalScore >= 80 && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-green-900 mb-2 text-sm">高い信頼度の査定結果です</h5>
                          <p className="text-sm text-green-800 leading-relaxed mb-3">
                            信頼度{result.confidenceBreakdown.totalScore}%の査定結果です。十分なデータに基づいた信頼性の高い査定ですが、訪問査定では物件の個別要因を加味し、さらに精度を高めることができます。
                          </p>
                          <a
                            href="https://hyconsulting.jp/contact"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                          >
                            <Home className="w-4 h-4" />
                            訪問査定を依頼する（無料）
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Button - Left Aligned Below Confidence Section */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-4">
              信頼度は、参照した取引データの件数、地域の一致度、築年数の類似性に基づいて算出されています。
            </p>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              {showDetails ? "詳細を隠す" : "詳細分析を表示"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Detailed Analysis (Expandable) */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Price per M2 */}
          {result.pricePerM2 ? (
            <Card className="p-6 border-2 border-slate-200">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-accent" />
                単価分析
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 font-medium mb-2">㎡当たり価格</p>
                    <p className="text-2xl font-bold text-primary">¥{(result.pricePerM2 / 10000).toFixed(1)}万</p>
                    <p className="text-xs text-slate-600 mt-1">/ ㎡</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 font-medium mb-2">坪当たり価格</p>
                    <p className="text-2xl font-bold text-primary">¥{(result.pricePerM2 * 3.3 / 10000).toFixed(1)}万</p>
                    <p className="text-xs text-slate-600 mt-1">/ 坪</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>算出方法:</strong> 周辺の取引事例{result.marketAnalysis?.transactionCount || result.compsUsedCount}件の平均単価を、取引件数で加重平均して算出しています。
                  </p>
                </div>
              </div>
            </Card>
          ) : null}

          {/* Calculation Basis */}
          <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              この査定はどのように算出されたか
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border border-primary/10">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {result.explanation}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">参照データソース</p>
                  <p className="text-sm font-bold text-slate-800">国土交通省 不動産取引価格情報</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">査定手法</p>
                  <p className="text-sm font-bold text-slate-800">取引事例比較法（加重平均）</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Market Analysis */}
          <Card className="p-6 border-2 border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              市場分析
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">参照した集約データ</span>
                <span className="font-bold text-slate-700">{result.compsUsedCount || 0} 件</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">実際の取引件数（合計）</span>
                <span className="font-bold text-slate-700">{result.marketAnalysis?.transactionCount || 0} 件</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">市場トレンド</span>
                <span className="font-bold text-slate-700">{result.marketTrend || "安定"}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-blue-700">
                  <strong>説明:</strong> 「参照した集約データ」は地域・物件種別・築年数で集約されたデータ件数、「実際の取引件数」はその集約データに含まれる実取引の合計件数です。
                </p>
              </div>
            </div>
          </Card>

          {/* Interactive Charts */}
          {marketAnalysis && (
            <div className="space-y-6">
              {marketAnalysis.priceTrends && (
                <PriceTrendChart data={marketAnalysis.priceTrends} />
              )}
              <MarketAnalysisCharts
                priceDistribution={marketAnalysis.priceDistribution}
                propertyTypeComparison={marketAnalysis.propertyTypeComparison}
                stationDistanceAnalysis={marketAnalysis.stationDistanceAnalysis}
                buildingAgeAnalysis={marketAnalysis.buildingAgeAnalysis}
              />
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-700">
              <strong>注意：</strong> この査定は、国土交通省の不動産取引価格情報データベースと類似物件の取引事例に基づいた参考値です。実際の売却価格は、市場の需給、物件の状態、交渉などにより異なる場合があります。
            </p>
          </div>
        </motion.div>
      )}

      {/* Assessment Flow & CTA */}
      <div className="mt-12 pt-8 border-t-2 border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 font-sans">
              次のアクションは？
            </h3>
            <p className="text-slate-600 text-lg font-sans">
              正確な価格を知りたい場合は、訪問査定をご依頼ください
            </p>
          </div>

          {/* Flow Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                number: 1,
                title: "無料相談",
                description: "まずはお気軽にご相談下さい",
              },
              {
                number: 2,
                title: "訪問査定",
                description: "プロが現地で詳細な調査を実施",
              },
              {
                number: 3,
                title: "最適なプランのご提案",
                description: "あなたに最適な選択肢を提案",
              },
            ].map((step, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border-2 border-slate-200 hover:border-primary/50 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 font-sans">{step.title}</h4>
                <p className="text-slate-600 text-sm font-sans">{step.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8 border-2 border-primary/20 text-center">
            <h4 className="text-2xl font-bold text-slate-900 mb-3">
              正確な価格を知りたい方へ
            </h4>
            <p className="text-slate-700 mb-6">
              無料査定の結果をもとに、プロが現地で詳細な調査を実施します。
            </p>
            <button 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              onClick={() => {
                const element = document.querySelector("#contact");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              訪問査定をご依頼
            </button>
          </div>
        </motion.div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold px-8 py-3 rounded-lg"
        >
          別の物件を査定
        </Button>
      </div>
    </motion.div>
  );
}
