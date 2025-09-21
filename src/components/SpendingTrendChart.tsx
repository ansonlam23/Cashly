import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { formatCurrency } from "@/lib/format";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface TrendData {
  period: string;
  amount: number;
  label: string;
}

interface SpendingTrendChartProps {
  data: TrendData[];
  title: string;
  description: string;
  type?: "line" | "area";
}

export function SpendingTrendChart({ data, title, description, type = "line" }: SpendingTrendChartProps) {
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const averageAmount = data.length > 0 ? totalAmount / data.length : 0;
  const maxAmount = Math.max(...data.map(item => item.amount));
  const minAmount = Math.min(...data.map(item => item.amount));
  
  const trend = data.length >= 2 
    ? data[data.length - 1].amount - data[0].amount 
    : 0;
  const trendPercentage = data.length >= 2 && data[0].amount > 0
    ? (trend / data[0].amount) * 100
    : 0;

  const formatTooltip = (value: number, name: string) => [formatCurrency(value), "Amount"];

  return (
    <Card className="bg-[#111111] border-[#333]">
      <CardHeader>
        <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-[#888]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-[#1a1a1a] rounded-lg">
                <div className="text-sm text-[#888]">Total</div>
                <div className="text-lg font-bold text-[#f5f5f5]">{formatCurrency(totalAmount)}</div>
              </div>
              <div className="text-center p-3 bg-[#1a1a1a] rounded-lg">
                <div className="text-sm text-[#888]">Average</div>
                <div className="text-lg font-bold text-[#f5f5f5]">{formatCurrency(averageAmount)}</div>
              </div>
              <div className="text-center p-3 bg-[#1a1a1a] rounded-lg">
                <div className="text-sm text-[#888]">Highest</div>
                <div className="text-lg font-bold text-[#f5f5f5]">{formatCurrency(maxAmount)}</div>
              </div>
              <div className="text-center p-3 bg-[#1a1a1a] rounded-lg">
                <div className="text-sm text-[#888]">Lowest</div>
                <div className="text-lg font-bold text-[#f5f5f5]">{formatCurrency(minAmount)}</div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {type === "area" ? (
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="period" 
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
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#00ff88"
                      fill="url(#colorGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00ff88" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                ) : (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="period" 
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
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#00ff88"
                      strokeWidth={3}
                      dot={{ fill: '#00ff88', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#00ff88', strokeWidth: 2 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Trend Indicator */}
            {data.length >= 2 && (
              <div className="flex items-center justify-center p-3 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-2">
                  {trend >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-400" />
                  )}
                  <span className="text-sm text-[#888]">
                    {trend >= 0 ? "Spending increased" : "Spending decreased"} by{" "}
                    <span className={`font-semibold ${trend >= 0 ? "text-red-400" : "text-green-400"}`}>
                      {Math.abs(trendPercentage).toFixed(1)}%
                    </span>
                    {" "}over this period
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-[#888]">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trend data available</p>
              <p className="text-sm mt-1">Add some transactions to see spending trends</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
