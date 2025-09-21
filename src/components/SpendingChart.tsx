import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SpendingData {
  category: string;
  amount: number;
}

interface SpendingChartProps {
  data: SpendingData[];
}

const COLORS = ['#00ff88', '#0088ff', '#ff0080', '#ffaa00', '#aa00ff', '#00ffff'];

export function SpendingChart({ data }: SpendingChartProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  
  const chartData = data.map((item, index) => ({
    ...item,
    percentage: ((item.amount / total) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="bg-[#111111] border-[#333]">
      <CardHeader>
        <CardTitle className="text-[#f5f5f5]">Spending by Category</CardTitle>
        <CardDescription className="text-[#888]">
          Where your money is going this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {/* Chart */}
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name, props) => [
                      `$${value.toFixed(2)}`, 
                      props.payload.category || 'Amount'
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#1f2937',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Collapsible Legend */}
            <Collapsible open={isLegendOpen} onOpenChange={setIsLegendOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-2 text-sm text-[#f5f5f5] hover:bg-[#333] rounded-md transition-colors">
                  <span>Legend ({chartData.length} categories)</span>
                  {isLegendOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {chartData.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#f5f5f5]">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#f5f5f5] font-medium">${item.amount.toFixed(2)}</div>
                      <div className="text-[#888] text-xs">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-[#888]">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No spending data available</p>
              <p className="text-sm mt-1">Upload a bank statement to see your spending breakdown</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
