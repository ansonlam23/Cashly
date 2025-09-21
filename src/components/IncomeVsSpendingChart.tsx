import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatNumber } from "@/lib/format";

interface IncomeVsSpendingData {
  totalIncome: number;
  totalSpending: number;
}

interface IncomeVsSpendingChartProps {
  data: IncomeVsSpendingData;
}

const INCOME_COLOR = '#00ff88'; // Green for income
const SPENDING_COLOR = '#ff0080'; // Red for spending

export function IncomeVsSpendingChart({ data }: IncomeVsSpendingChartProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const { totalIncome, totalSpending } = data;
  const netAmount = totalIncome - totalSpending;
  
  const chartData = [
    {
      name: 'Income',
      value: totalIncome,
      color: INCOME_COLOR,
      percentage: totalIncome > 0 ? ((totalIncome / (totalIncome + totalSpending)) * 100).toFixed(1) : '0.0'
    },
    {
      name: 'Spending',
      value: totalSpending,
      color: SPENDING_COLOR,
      percentage: totalSpending > 0 ? ((totalSpending / (totalIncome + totalSpending)) * 100).toFixed(1) : '0.0'
    }
  ];

  return (
    <Card className="bg-[#111111] border-[#333]">
      <CardHeader>
        <CardTitle className="text-[#f5f5f5]">Income vs Spending</CardTitle>
        <CardDescription className="text-[#888]">
          Your financial flow overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalIncome > 0 || totalSpending > 0 ? (
          <div className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name, props) => [
                      `$${formatNumber(value)}`, 
                      props.payload.name || 'Amount'
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
                  {/* Legend removed - using custom collapsible legend below */}
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Collapsible Legend */}
            <Collapsible open={isLegendOpen} onOpenChange={setIsLegendOpen}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-2 text-sm text-[#f5f5f5] hover:bg-[#333] rounded-md transition-colors">
                  <span>Legend (2 items)</span>
                  {isLegendOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#f5f5f5]">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#f5f5f5] font-medium">${formatNumber(item.value)}</div>
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
              <p>No financial data available</p>
              <p className="text-sm mt-1">Add transactions to see your income vs spending</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
