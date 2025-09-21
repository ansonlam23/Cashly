import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryTrendData {
  category: string;
  data: Array<{
    period: string;
    amount: number;
    label: string;
  }>;
  growthRate: number;
  totalSpent: number;
}

interface CategoryTrendChartProps {
  data: CategoryTrendData[];
  title: string;
  description: string;
}

const COLORS = ['#00ff88', '#0088ff', '#ff0080', '#ffaa00', '#aa00ff', '#00ffff', '#ff8800', '#88ff00'];

export function CategoryTrendChart({ data, title, description }: CategoryTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-[#888]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-[#888]">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No category trend data available</p>
              <p className="text-sm mt-1">Add some transactions to see category trends</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for the chart
  const chartData = data[0]?.data.map((item, index) => {
    const chartItem: any = {
      period: item.period,
      label: item.label
    };
    
    data.forEach((category, categoryIndex) => {
      chartItem[category.category] = category.data[index]?.amount || 0;
    });
    
    return chartItem;
  }) || [];

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatTooltip = (value: number, name: string) => [formatCurrency(value), name];

  return (
    <Card className="bg-[#111111] border-[#333]">
      <CardHeader>
        <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-[#888]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Category Growth Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.slice(0, 6).map((category, index) => (
              <div key={category.category} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#f5f5f5] text-sm">{category.category}</span>
                  <div className="flex items-center gap-1">
                    {category.growthRate > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-400" />
                    )}
                    <span className={`text-sm font-semibold ${
                      category.growthRate > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {category.growthRate > 0 ? '+' : ''}{category.growthRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-lg font-bold text-[#f5f5f5]">
                  ${category.totalSpent.toLocaleString()}
                </div>
                <div className="text-xs text-[#888]">Total spent</div>
              </div>
            ))}
          </div>

          {/* Multi-line Chart */}
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="label" 
                  stroke="#888"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#888"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#f5f5f5'
                  }}
                />
                <Legend />
                {data.slice(0, 8).map((category, index) => (
                  <Line
                    key={category.category}
                    type="monotone"
                    dataKey={category.category}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: COLORS[index % COLORS.length], strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Growth Insights */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-[#f5f5f5]">Growth Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.slice(0, 4).map((category) => {
                const isGrowing = category.growthRate > 0;
                const isShrinking = category.growthRate < -10;
                
                return (
                  <div key={category.category} className={`p-4 rounded-lg border ${
                    isGrowing ? 'border-red-500/30 bg-red-500/5' : 
                    isShrinking ? 'border-green-500/30 bg-green-500/5' : 
                    'border-[#333] bg-[#1a1a1a]'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#f5f5f5]">{category.category}</span>
                      <Badge className={
                        isGrowing ? 'bg-red-500' : 
                        isShrinking ? 'bg-green-500' : 
                        'bg-gray-500'
                      }>
                        {category.growthRate > 0 ? 'Growing' : 
                         category.growthRate < -10 ? 'Shrinking' : 'Stable'}
                      </Badge>
                    </div>
                    <div className="text-sm text-[#888]">
                      {isGrowing ? 
                        `Spending increased by ${category.growthRate.toFixed(1)}% over the period` :
                        isShrinking ?
                        `Great job! Spending decreased by ${Math.abs(category.growthRate).toFixed(1)}%` :
                        'Spending has remained stable'
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
