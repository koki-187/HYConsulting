/**
 * Market Analysis Charts Component
 * Displays price distribution, property type comparison, and other market analysis
 */

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface PriceDistributionData {
  range: string;
  count: number;
  percentage: number;
}

export interface PropertyTypeComparison {
  type: string;
  averagePrice: number;
  medianPrice: number;
  count: number;
}

export interface StationDistanceAnalysis {
  distance: string;
  averagePrice: number;
  count: number;
}

export interface BuildingAgeAnalysis {
  ageRange: string;
  averagePrice: number;
  count: number;
}

interface MarketAnalysisChartsProps {
  priceDistribution?: PriceDistributionData[];
  propertyTypeComparison?: PropertyTypeComparison[];
  stationDistanceAnalysis?: StationDistanceAnalysis[];
  buildingAgeAnalysis?: BuildingAgeAnalysis[];
}

/**
 * Format price for display
 */
const formatPrice = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(1)}億`;
  }
  return `¥${(value / 10000).toFixed(0)}万`;
};

/**
 * Price Distribution Chart
 */
export const PriceDistributionChart: React.FC<{ data?: PriceDistributionData[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>価格分布</CardTitle>
        <CardDescription>類似物件の価格帯別件数分布</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="range"
                stroke="#666"
                style={{ fontSize: "12px" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#666" style={{ fontSize: "12px" }} />
              <Tooltip
                formatter={(value: any) => `${value}件`}
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                name="件数"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Property Type Comparison Chart
 */
export const PropertyTypeComparisonChart: React.FC<{ data?: PropertyTypeComparison[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>物件種別別比較</CardTitle>
        <CardDescription>物件種別ごとの平均価格と中央値</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="type"
                stroke="#666"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: "12px" }}
                tickFormatter={formatPrice}
              />
              <Tooltip
                formatter={(value: any) => formatPrice(value)}
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="averagePrice"
                fill="#3b82f6"
                name="平均価格"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="medianPrice"
                fill="#10b981"
                name="中央値"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Station Distance Analysis Chart
 */
export const StationDistanceChart: React.FC<{ data?: StationDistanceAnalysis[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>駅距離別価格分析</CardTitle>
        <CardDescription>駅からの距離と平均価格の関係</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="distance"
                stroke="#666"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: "12px" }}
                tickFormatter={formatPrice}
              />
              <Tooltip
                formatter={(value: any) => formatPrice(value)}
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
              />
              <Bar
                dataKey="averagePrice"
                fill="#f59e0b"
                name="平均価格"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Building Age Analysis Chart
 */
export const BuildingAgeChart: React.FC<{ data?: BuildingAgeAnalysis[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>築年数別価格分析</CardTitle>
        <CardDescription>築年数による価格変動</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="ageRange"
                stroke="#666"
                style={{ fontSize: "12px" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: "12px" }}
                tickFormatter={formatPrice}
              />
              <Tooltip
                formatter={(value: any) => formatPrice(value)}
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
              />
              <Bar
                dataKey="averagePrice"
                fill="#8b5cf6"
                name="平均価格"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Market Analysis Charts Container
 */
export const MarketAnalysisCharts: React.FC<MarketAnalysisChartsProps> = ({
  priceDistribution,
  propertyTypeComparison,
  stationDistanceAnalysis,
  buildingAgeAnalysis,
}) => {
  return (
    <div className="space-y-6">
      {priceDistribution && <PriceDistributionChart data={priceDistribution} />}
      {propertyTypeComparison && <PropertyTypeComparisonChart data={propertyTypeComparison} />}
      {stationDistanceAnalysis && <StationDistanceChart data={stationDistanceAnalysis} />}
      {buildingAgeAnalysis && <BuildingAgeChart data={buildingAgeAnalysis} />}
    </div>
  );
};

export default MarketAnalysisCharts;
