import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#f5f5f5'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
