import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SpendingChart } from "@/components/SpendingChart";
import { IncomeVsSpendingChart } from "@/components/IncomeVsSpendingChart";
import { SpendingInsights } from "@/components/SpendingInsights";
import { TopMerchants } from "@/components/TopMerchants";
import { BalanceSummary } from "@/components/BalanceSummary";
import { motion } from "framer-motion";

export default function Analytics() {
  const { isLoading, isAuthenticated } = useAuth();
  
  const spendingByCategory = useQuery(api.transactions.getSpendingByCategory);
  const incomeVsSpending = useQuery(api.transactions.getIncomeVsSpending);
  const monthlyTrend = useQuery(api.transactions.getMonthlySpendingTrend, { months: 6 });
  const topMerchants = useQuery(api.transactions.getTopMerchants, { limit: 5 });
  const currentBalance = useQuery(api.transactions.getCurrentBalance);

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
          {/* Current Balance and Net Flows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <BalanceSummary 
              currentBalance={currentBalance?.currentBalance || 0}
              totalIncome={currentBalance?.totalIncome || 0}
              totalSpending={currentBalance?.totalSpending || 0}
              netFlow={currentBalance?.netFlow || 0}
            />
          </motion.div>

          {/* Core Spending Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <SpendingChart data={spendingByCategory || []} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <IncomeVsSpendingChart data={incomeVsSpending || { totalIncome: 0, totalSpending: 0 }} />
            </motion.div>
          </motion.div>

          {/* Spending Insights and Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
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
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <TopMerchants merchants={topMerchants || []} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
