import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { Zap, Calendar, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

interface RecurringExpense {
  merchant: string;
  frequency: number;
  totalAmount: number;
  averageAmount: number;
  lastTransaction: string;
  category: string;
  isSubscription: boolean;
}

interface RecurringExpensesProps {
  expenses: RecurringExpense[];
  title: string;
  description: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Food and Drink": "bg-orange-500",
  "Coffee Shops": "bg-amber-500",
  "Transportation": "bg-blue-500",
  "Shopping": "bg-purple-500",
  "Entertainment": "bg-pink-500",
  "Groceries": "bg-green-500",
  "Restaurants": "bg-red-500",
  "Gas": "bg-yellow-500",
  "Online Shopping": "bg-indigo-500",
  "Other": "bg-gray-500",
};

export function RecurringExpenses({ expenses, title, description }: RecurringExpensesProps) {
  if (!expenses || expenses.length === 0) {
    return (
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-[#888]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-[#888]">
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recurring expenses detected</p>
              <p className="text-sm mt-1">Add more transactions to identify patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subscriptions = expenses.filter(expense => expense.isSubscription);
  const regularMerchants = expenses.filter(expense => !expense.isSubscription);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getFrequencyText = (frequency: number) => {
    if (frequency >= 12) return `${Math.round(frequency / 12)}x/year`;
    if (frequency >= 4) return `${Math.round(frequency / 4)}x/month`;
    if (frequency >= 2) return `${Math.round(frequency / 2)}x/week`;
    return `${frequency}x total`;
  };

  return (
    <div className="space-y-6">
      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <Card className="bg-[#111111] border-[#ff0080]">
          <CardHeader>
            <CardTitle className="text-[#ff0080] flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Subscriptions & Memberships
            </CardTitle>
            <CardDescription className="text-[#888]">
              Recurring payments that happen automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscriptions.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#ff0080]/20 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-[#ff0080]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#f5f5f5]">{expense.merchant}</div>
                      <div className="text-sm text-[#888]">
                        Last transaction: {formatDate(expense.lastTransaction)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#f5f5f5]">{formatCurrency(expense.averageAmount)}</div>
                    <div className="text-sm text-[#888]">per transaction</div>
                    <Badge className={`${CATEGORY_COLORS[expense.category] || 'bg-gray-500'} text-white mt-1`}>
                      {expense.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Regular Merchants */}
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Frequent Merchants
          </CardTitle>
          <CardDescription className="text-[#888]">
            Places you shop at regularly (3+ times)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regularMerchants.map((expense, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#00ff88]/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#00ff88]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#f5f5f5]">{expense.merchant}</div>
                    <div className="text-sm text-[#888]">
                      {getFrequencyText(expense.frequency)} • Last: {formatDate(expense.lastTransaction)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#f5f5f5]">{formatCurrency(expense.totalAmount)}</div>
                  <div className="text-sm text-[#888]">total spent</div>
                  <Badge className={`${CATEGORY_COLORS[expense.category] || 'bg-gray-500'} text-white mt-1`}>
                    {expense.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Spending Insights
          </CardTitle>
          <CardDescription className="text-[#888]">
            Key insights about your recurring spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <div className="text-2xl font-bold text-[#f5f5f5]">
                ${expenses.reduce((sum, expense) => sum + expense.totalAmount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-[#888]">Total recurring spending</div>
            </div>
            
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <div className="text-2xl font-bold text-[#f5f5f5]">
                {formatCurrency(expenses.reduce((sum, expense) => sum + expense.averageAmount, 0))}
              </div>
              <div className="text-sm text-[#888]">Average per transaction</div>
            </div>
            
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <div className="text-2xl font-bold text-[#f5f5f5]">{subscriptions.length}</div>
              <div className="text-sm text-[#888]">Active subscriptions</div>
            </div>
            
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <div className="text-2xl font-bold text-[#f5f5f5]">{regularMerchants.length}</div>
              <div className="text-sm text-[#888]">Frequent merchants</div>
            </div>
          </div>

          {subscriptions.length > 0 && (
            <div className="mt-6 p-4 bg-[#ff0080]/10 border border-[#ff0080]/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-[#ff0080]" />
                <span className="font-semibold text-[#f5f5f5]">Subscription Alert</span>
              </div>
              <p className="text-sm text-[#888]">
                You have {subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''}. 
                Consider reviewing them to ensure you're getting value from each one.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
