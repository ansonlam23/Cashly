import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SpendingData {
  category: string;
  amount: number;
}

interface SpendingChartProps {
  data: SpendingData[];
}

const COLORS = ['#00ff88', '#0088ff', '#ff0080', '#ffaa00', '#aa00ff', '#00ffff'];

export function SpendingChart({ data }: SpendingChartProps) {
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
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#f5f5f5'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="space-y-2">
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
            </div>
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
