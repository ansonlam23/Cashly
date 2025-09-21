import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface BalanceSummaryProps {
  currentBalance: number;
  totalIncome: number;
  totalSpending: number;
  netFlow: number;
}

export function BalanceSummary({ currentBalance, totalIncome, totalSpending, netFlow }: BalanceSummaryProps) {
  const isPositive = netFlow >= 0;
  const isNegative = netFlow < 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Current Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#888] flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              isPositive ? 'text-[#00ff88]' : isNegative ? 'text-[#ff0080]' : 'text-[#f5f5f5]'
            }`}>
              ${currentBalance.toLocaleString()}
            </div>
            <p className="text-xs text-[#888] mt-1">
              {isPositive ? 'You\'re in the green!' : isNegative ? 'You\'re overspending' : 'Balanced'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Income */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#888] flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00ff88]">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-[#888] mt-1">
              Money coming in
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Spending */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#888] flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#ff0080]">
              ${totalSpending.toLocaleString()}
            </div>
            <p className="text-xs text-[#888] mt-1">
              Money going out
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Net Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className={`bg-[#111111] border-2 ${
          isPositive ? 'border-[#00ff88]' : isNegative ? 'border-[#ff0080]' : 'border-[#333]'
        }`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#888] flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Net Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              isPositive ? 'text-[#00ff88]' : isNegative ? 'text-[#ff0080]' : 'text-[#f5f5f5]'
            }`}>
              {isPositive ? '+' : ''}${netFlow.toLocaleString()}
            </div>
            <p className="text-xs text-[#888] mt-1">
              {isPositive ? 'Income > Spending' : isNegative ? 'Spending > Income' : 'Balanced'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
