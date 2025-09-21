import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2, TrendingUp, Calendar, DollarSign, AlertTriangle, Target, Zap, BarChart3 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { SpendingTrendChart } from "@/components/SpendingTrendChart";
import { CategoryTrendChart } from "@/components/CategoryTrendChart";
import { RecurringExpenses } from "@/components/RecurringExpenses";
import { SpendingForecast } from "@/components/SpendingForecast";

export default function Trends() {
  const { isLoading, isAuthenticated } = useAuth();
  
  const dailyTrend = useQuery(api.transactions.getDailySpendingTrend, { days: 30 });
  const weeklyTrend = useQuery(api.transactions.getWeeklySpendingTrend, { weeks: 12 });
  const monthlyTrend = useQuery(api.transactions.getMonthlySpendingTrend, { months: 6 });
  const categoryTrends = useQuery(api.transactions.getCategoryTrends, { months: 6 });
  const recurringExpenses = useQuery(api.transactions.getRecurringExpenses);
  const spendingForecast = useQuery(api.transactions.getSpendingForecast, { months: 6 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#f5f5f5] mb-4">Authentication Required</h1>
          <p className="text-[#888]">Please log in to view your trends.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 ml-64 p-8"
      >
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold text-[#f5f5f5] mb-2 flex items-center gap-3"
          >
            <TrendingUp className="h-8 w-8 text-[#00ff88]" />
            Spending Trends
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#888]"
          >
            Discover patterns, forecasts, and behavioral insights in your spending
          </motion.p>
        </div>

        <Tabs defaultValue="patterns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#1a1a1a]">
            <TabsTrigger value="patterns" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              <BarChart3 className="h-4 w-4 mr-2" />
              Patterns
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              <Target className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="recurring" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              <Zap className="h-4 w-4 mr-2" />
              Recurring
            </TabsTrigger>
            <TabsTrigger value="forecast" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              <Calendar className="h-4 w-4 mr-2" />
              Forecast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <SpendingTrendChart 
                data={dailyTrend || []}
                title="Daily Spending Pattern"
                description="Your daily spending over the last 30 days"
                type="line"
              />
              <SpendingTrendChart 
                data={weeklyTrend || []}
                title="Weekly Spending Pattern"
                description="Your weekly spending over the last 12 weeks"
                type="area"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SpendingTrendChart 
                data={monthlyTrend?.map(item => ({
                  period: item.month,
                  amount: item.amount,
                  label: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                })) || []}
                title="Monthly Spending Pattern"
                description="Your monthly spending over the last 6 months"
                type="area"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CategoryTrendChart 
                data={categoryTrends || []}
                title="Category Growth Trends"
                description="How your spending categories are changing over time"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="recurring" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <RecurringExpenses 
                expenses={recurringExpenses || []}
                title="Recurring Expenses"
                description="Merchants and subscriptions you visit regularly"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SpendingForecast 
                forecast={spendingForecast?.forecast || []}
                insights={spendingForecast?.insights || []}
                title="Spending Forecast"
                description="Predictions and insights based on your spending patterns"
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
