import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Coffee, ShoppingCart, Car, Utensils } from "lucide-react";

interface SpendingInsightsProps {
  spendingByCategory: Array<{
    category: string;
    amount: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
}

const CATEGORY_ICONS: Record<string, any> = {
  "Food and Drink": Utensils,
  "Coffee Shops": Coffee,
  "Transportation": Car,
  "Shopping": ShoppingCart,
  "Entertainment": TrendingUp,
  "Groceries": ShoppingCart,
  "Restaurants": Utensils,
  "Gas": Car,
  "Online Shopping": ShoppingCart,
  "Other": AlertTriangle,
};

export function SpendingInsights({ spendingByCategory, monthlyTrend }: SpendingInsightsProps) {
  const totalSpending = spendingByCategory.reduce((sum, item) => sum + item.amount, 0);
  const currentMonth = monthlyTrend[monthlyTrend.length - 1];
  const previousMonth = monthlyTrend[monthlyTrend.length - 2];
  
  const monthOverMonthChange = previousMonth 
    ? ((currentMonth?.amount - previousMonth.amount) / previousMonth.amount) * 100 
    : 0;

  // Find unusual spending patterns
  const unusualSpending = spendingByCategory.filter(item => {
    const percentage = (item.amount / totalSpending) * 100;
    return percentage > 25; // More than 25% of total spending
  });

  // Get top category
  const topCategory = spendingByCategory.reduce((max, item) => 
    item.amount > max.amount ? item : max, 
    { category: "Other", amount: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Month over Month Comparison */}
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Month Over Month
          </CardTitle>
          <CardDescription className="text-[#888]">
            Compare this month vs last month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-[#888]">This Month</div>
              <div className="text-2xl font-bold text-[#f5f5f5]">
                ${currentMonth?.amount.toFixed(2) || "0.00"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-[#888]">Last Month</div>
              <div className="text-2xl font-bold text-[#f5f5f5]">
                ${previousMonth?.amount.toFixed(2) || "0.00"}
              </div>
            </div>
          </div>
          
          {previousMonth && (
            <div className="mt-4 p-3 bg-[#1a1a1a] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#888]">Change</span>
                <Badge 
                  variant={monthOverMonthChange >= 0 ? "destructive" : "default"}
                  className={monthOverMonthChange >= 0 ? "bg-red-500" : "bg-green-500"}
                >
                  {monthOverMonthChange >= 0 ? "+" : ""}{monthOverMonthChange.toFixed(1)}%
                </Badge>
              </div>
              <div className="text-xs text-[#888] mt-1">
                {monthOverMonthChange >= 0 
                  ? "You're spending more this month" 
                  : "Great job! You're spending less this month"
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spending Alerts */}
      {unusualSpending.length > 0 && (
        <Card className="bg-[#111111] border-[#ff8800]">
          <CardHeader>
            <CardTitle className="text-[#ff8800] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Spending Alerts
            </CardTitle>
            <CardDescription className="text-[#888]">
              Unusual spending patterns detected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unusualSpending.map((item) => {
                const percentage = ((item.amount / totalSpending) * 100).toFixed(1);
                const IconComponent = CATEGORY_ICONS[item.category] || AlertTriangle;
                
                return (
                  <div key={item.category} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-[#ff8800]" />
                      <div>
                        <div className="font-medium text-[#f5f5f5]">{item.category}</div>
                        <div className="text-sm text-[#888]">{percentage}% of total spending</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#ff8800]">${item.amount.toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Category Insight */}
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Top Spending Category
          </CardTitle>
          <CardDescription className="text-[#888]">
            Where you spend the most money
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
            <div className="flex items-center gap-3">
              {(() => {
                const IconComponent = CATEGORY_ICONS[topCategory.category] || ShoppingCart;
                return <IconComponent className="h-6 w-6 text-[#00ff88]" />;
              })()}
              <div>
                <div className="font-bold text-[#f5f5f5]">{topCategory.category}</div>
                <div className="text-sm text-[#888]">
                  {((topCategory.amount / totalSpending) * 100).toFixed(1)}% of total spending
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#00ff88]">
                ${topCategory.amount.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
