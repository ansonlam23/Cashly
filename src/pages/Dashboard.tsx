import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Upload, 
  PieChart,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SpendingChart } from "@/components/SpendingChart";
import { TransactionsList } from "@/components/TransactionsList";
import { GoalsOverview } from "@/components/GoalsOverview";
import { InsightsPanel } from "@/components/InsightsPanel";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user } = useAuth();
  
  const transactions = useQuery(api.transactions.getTransactionsByUser, { limit: 10 });
  const spendingByCategory = useQuery(api.transactions.getSpendingByCategory);
  const monthlyTrend = useQuery(api.transactions.getMonthlySpendingTrend, { months: 6 });
  const goals = useQuery(api.goals.getActiveGoals);
  const insights = useQuery(api.insights.getUnreadInsights);
  const statements = useQuery(api.bankStatements.getUserStatements);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const totalSpent = spendingByCategory?.reduce((sum, cat) => sum + cat.amount, 0) || 0;
  const totalTransactions = transactions?.length || 0;
  const activeGoalsCount = goals?.length || 0;
  const unreadInsightsCount = insights?.length || 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Welcome back, {user?.name || "Student"}! 💰
              </h1>
              <p className="text-[#888] text-lg">
                Let's see how your money is behaving today...
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-[#111111] border-[#333] hover:border-[#00ff88] transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#ccc]">Total Spent</CardTitle>
                    <DollarSign className="h-4 w-4 text-[#ff0080]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#f5f5f5]">
                      ${totalSpent.toFixed(2)}
                    </div>
                    <p className="text-xs text-[#888] mt-1">
                      Across all categories
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-[#111111] border-[#333] hover:border-[#0088ff] transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#ccc]">Transactions</CardTitle>
                    <BarChart3 className="h-4 w-4 text-[#0088ff]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#f5f5f5]">
                      {totalTransactions}
                    </div>
                    <p className="text-xs text-[#888] mt-1">
                      Recent activity
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-[#111111] border-[#333] hover:border-[#00ff88] transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#ccc]">Active Goals</CardTitle>
                    <Target className="h-4 w-4 text-[#00ff88]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#f5f5f5]">
                      {activeGoalsCount}
                    </div>
                    <p className="text-xs text-[#888] mt-1">
                      Financial targets
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-[#111111] border-[#333] hover:border-[#ff0080] transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-[#ccc]">New Insights</CardTitle>
                    <Lightbulb className="h-4 w-4 text-[#ff0080]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-[#f5f5f5]">
                      {unreadInsightsCount}
                    </div>
                    <p className="text-xs text-[#888] mt-1">
                      AI recommendations
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-[#111111] border border-[#333]">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-[#0a0a0a]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-[#0088ff] data-[state=active]:text-[#0a0a0a]"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="goals" 
                  className="data-[state=active]:bg-[#ff0080] data-[state=active]:text-[#0a0a0a]"
                >
                  Goals
                </TabsTrigger>
                <TabsTrigger 
                  value="insights" 
                  className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-[#0a0a0a]"
                >
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SpendingChart data={spendingByCategory || []} />
                  <TransactionsList transactions={transactions || []} />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <SpendingChart data={spendingByCategory || []} />
                  {monthlyTrend && monthlyTrend.length > 0 && (
                    <Card className="bg-[#111111] border-[#333]">
                      <CardHeader>
                        <CardTitle className="text-[#f5f5f5]">Monthly Spending Trend</CardTitle>
                        <CardDescription className="text-[#888]">
                          Your spending patterns over the last 6 months
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] flex items-center justify-center text-[#888]">
                          Chart visualization would go here
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <GoalsOverview goals={goals || []} />
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <InsightsPanel insights={insights || []} />
              </TabsContent>
            </Tabs>

            {/* Upload Section */}
            {(!statements || statements.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <Card className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] border-[#333] border-2 border-dashed">
                  <CardHeader className="text-center">
                    <Upload className="h-12 w-12 text-[#00ff88] mx-auto mb-4" />
                    <CardTitle className="text-[#f5f5f5]">Upload Your First Bank Statement</CardTitle>
                    <CardDescription className="text-[#888]">
                      Get started by uploading a PDF bank statement to see your spending insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button 
                      className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a] font-semibold"
                      size="lg"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Statement
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
