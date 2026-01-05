"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MapPin, DollarSign, Home, Calendar, Users, BarChart3, ArrowUpRight, ArrowDownRight, CheckCircle2, Share2, Download } from "lucide-react";
import { useState } from "react";
import { PriceTrendChart } from "@/components/charts/PriceTrendChart";
import { MarketAnalysisCharts } from "@/components/charts/MarketAnalysisCharts";
import { generateAssessmentPDF } from "@/lib/pdf-generator";
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePDFDownload = async () => {
    try {
      setIsGeneratingPDF(true);
      const midPrice = (result.estimatedLowYen + result.estimatedHighYen) / 2;
      await generateAssessmentPDF({
        propertyData,
        result: {
          ...result,
          estimatedLowYen: result.estimatedLowYen,
          estimatedHighYen: result.estimatedHighYen,
        },
        generatedDate: new Date(),
      }, `assessment-${propertyData.prefecture}-${propertyData.city}.pdf`);
    } catch (error) {
      console.error('PDF download error:', error);
      alert('PDF生成に失敗しました');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
              <p className="text-slate-600 text-sm">適正価格を算出しました</p>
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
                  <p className="text-xs text-slate-500 font-medium mb-1">最低価格</p>
                  <p className="text-lg font-bold text-slate-700">{formatPrice(result.estimatedLowYen)}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatPriceDetailed(result.estimatedLowYen)}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 font-medium mb-2">推定価格</p>
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">最高価格</p>
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
              <p className="text-2xl font-bold text-primary mb-1">{result.compsUsedCount}</p>
              <p className="text-sm text-slate-600">件の類似取引事例を参照</p>
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
              <p className="text-slate-700 text-sm leading-relaxed">{result.explanation}</p>
            </div>
          )}

          {/* Confidence Level */}
          {result.confidence && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-700">査定の信頼度</p>
                <p className="text-sm font-bold text-primary">{result.confidence}%</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-accent to-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              {showDetails ? "詳細を隠す" : "詳細分析を表示"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 font-bold py-3 rounded-lg"
            >
              <Share2 className="w-5 h-5 mr-2" />
              共有
            </Button>
            <Button
              onClick={handlePDFDownload}
              disabled={isGeneratingPDF}
              variant="outline"
              className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-lg disabled:opacity-50"
            >
              <Download className="w-5 h-5 mr-2" />
              {isGeneratingPDF ? "生成中..." : "レポート"}
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
          {result.pricePerM2 && (
            <Card className="p-6 border-2 border-slate-200">
              <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-accent" />
                単価分析
              </h4>
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
            </Card>
          )}

          {/* Market Analysis */}
          <Card className="p-6 border-2 border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              市場分析
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">取引件数（直近1年）</span>
                <span className="font-bold text-slate-700">{result.comparableCount || 0} 件</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">査定に使用した取引</span>
                <span className="font-bold text-slate-700">{result.compsUsedCount} 件</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">市場トレンド</span>
                <span className="font-bold text-slate-700">{result.marketTrend || "安定"}</span>
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
              无料査定の結果をもとに、プロが現地で詳細な調査を実施します。
            </p>
            <button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
              訪問査定をご依頁
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
