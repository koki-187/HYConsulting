/**
 * Price Trend Chart Component
 * Displays 12-month price trends with interactive Recharts
 */

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface PriceTrendData {
  month: string;
  averagePrice: number;
  medianPrice: number;
  transactionCount: number;
}

interface PriceTrendChartProps {
  data: PriceTrendData[];
  title?: string;
  description?: string;
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
 * Custom tooltip for price trend chart
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
        <p className="font-semibold text-gray-900">{data.month}</p>
        <p className="text-blue-600">
          平均: {formatPrice(data.averagePrice)}
        </p>
        <p className="text-green-600">
          中央値: {formatPrice(data.medianPrice)}
        </p>
        <p className="text-gray-500 text-sm">
          取引件数: {data.transactionCount}件
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Price Trend Chart Component
 */
export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  data,
  title = "価格トレンド（12ヶ月）",
  description = "過去12ヶ月の平均価格と中央値の推移",
}) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-gray-500">
            データがありません
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: "12px" }}
                tickFormatter={formatPrice}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="averagePrice"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
                name="平均価格"
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="medianPrice"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
                name="中央値"
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceTrendChart;
