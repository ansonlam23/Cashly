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
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage}%)`}
                  outerRadius={80}
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
