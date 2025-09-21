import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SpendingChart } from "@/components/SpendingChart";
import { IncomeVsSpendingChart } from "@/components/IncomeVsSpendingChart";
import { SpendingInsights } from "@/components/SpendingInsights";
import { TopMerchants } from "@/components/TopMerchants";
import { SpendingTrendChart } from "@/components/SpendingTrendChart";
import { motion } from "framer-motion";

export default function Analytics() {
  const { isLoading, isAuthenticated } = useAuth();
  
  const spendingByCategory = useQuery(api.transactions.getSpendingByCategory);
  const incomeVsSpending = useQuery(api.transactions.getIncomeVsSpending);
  const monthlyTrend = useQuery(api.transactions.getMonthlySpendingTrend, { months: 6 });
  const topMerchants = useQuery(api.transactions.getTopMerchants, { limit: 5 });
  const dailyTrend = useQuery(api.transactions.getDailySpendingTrend, { days: 30 });
  const weeklyTrend = useQuery(api.transactions.getWeeklySpendingTrend, { weeks: 12 });

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
          <p className="text-[#888]">Please log in to view your analytics.</p>
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
            className="text-3xl font-bold text-[#f5f5f5] mb-2"
          >
            Analytics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#888]"
          >
            Deep insights into your spending patterns and financial trends
          </motion.p>
        </div>

        <div className="space-y-8">
          {/* Core Spending Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <SpendingChart data={spendingByCategory || []} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <IncomeVsSpendingChart data={incomeVsSpending || { totalIncome: 0, totalSpending: 0 }} />
            </motion.div>
          </motion.div>

          {/* Spending Insights and Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <SpendingInsights 
              spendingByCategory={spendingByCategory || []} 
              monthlyTrend={monthlyTrend || []} 
            />
          </motion.div>

          {/* Top Merchants */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <TopMerchants merchants={topMerchants || []} />
            </motion.div>
            
            {/* Monthly Trend Chart */}
            {monthlyTrend && monthlyTrend.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <SpendingTrendChart 
                  data={monthlyTrend.map(item => ({
                    period: item.month,
                    amount: item.amount,
                    label: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  }))}
                  title="Monthly Spending Trend"
                  description="Your spending patterns over the last 6 months"
                  type="area"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Daily and Weekly Trends */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.1 }}
            >
              <SpendingTrendChart 
                data={dailyTrend || []}
                title="Daily Spending Trend"
                description="Your daily spending over the last 30 days"
                type="line"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              <SpendingTrendChart 
                data={weeklyTrend || []}
                title="Weekly Spending Trend"
                description="Your weekly spending over the last 12 weeks"
                type="area"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
