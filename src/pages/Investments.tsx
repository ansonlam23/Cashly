import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatCurrency, formatNumber } from "@/lib/format";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  RefreshCw, 
  DollarSign, 
  BarChart3,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart
} from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { InvestmentAIInsights } from "@/components/InvestmentAIInsights";

export default function Investments() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteInvestmentId, setDeleteInvestmentId] = useState<string | null>(null);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [newInvestment, setNewInvestment] = useState({
    symbol: "",
    shares: "",
    averageCost: ""
  });

  const portfolioSummary = useQuery(api.investments.getPortfolioSummary);
  const investments = useQuery(api.investments.getUserInvestments);
  const addInvestment = useMutation(api.investments.addInvestment);
  const deleteInvestment = useMutation(api.investments.deleteInvestment);
  const updateAllPrices = useAction(api.investments.updateAllInvestmentPrices);

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvestment.symbol || !newInvestment.shares || !newInvestment.averageCost) return;

    try {
      await addInvestment({
        symbol: newInvestment.symbol,
        shares: parseFloat(newInvestment.shares),
        averageCost: parseFloat(newInvestment.averageCost),
      });
      
      setNewInvestment({ symbol: "", shares: "", averageCost: "" });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add investment:", error);
    }
  };

  const handleDeleteInvestment = async () => {
    if (deleteInvestmentId) {
      try {
        await deleteInvestment({ id: deleteInvestmentId as any });
        setDeleteInvestmentId(null);
      } catch (error) {
        console.error("Failed to delete investment:", error);
      }
    }
  };

  const handleRefreshPrices = async () => {
    if (!user) return;
    setIsRefreshing(true);
    setRefreshMessage("Refreshing prices...");
    
    try {
      console.log("Starting price refresh for user:", user._id);
      const results = await updateAllPrices({ userId: user._id });
      console.log("Price refresh results:", results);
      
      // Check if any updates failed
      const failedUpdates = results.filter(result => !result.success);
      const successCount = results.filter(result => result.success).length;
      
      if (failedUpdates.length > 0) {
        console.warn("Some price updates failed:", failedUpdates);
        console.error("Detailed error information:", failedUpdates.map(f => ({ symbol: f.symbol, error: f.error })));
        setRefreshMessage(`Updated ${successCount} prices, ${failedUpdates.length} failed. Check console for details.`);
      } else {
        setRefreshMessage(`Successfully updated ${successCount} prices`);
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setRefreshMessage(null), 3000);
    } catch (error) {
      console.error("Failed to refresh prices:", error);
      setRefreshMessage("Failed to refresh prices. Check console for details.");
      setTimeout(() => setRefreshMessage(null), 5000);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00ff88]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (!portfolioSummary || !investments) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff88] mx-auto mb-4"></div>
          <p className="text-[#888]">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">Investment Portfolio</h1>
                  <p className="text-[#888] text-lg">
                    Track your stocks and monitor performance
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleRefreshPrices}
                    disabled={isRefreshing}
                    variant="outline"
                    className="bg-[#111111] border-[#333] text-[#f5f5f5] hover:bg-[#222]"
                  >
                    {isRefreshing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh Prices
                  </Button>
                  
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Investment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111111] border-[#333] text-[#f5f5f5]">
                      <DialogHeader>
                        <DialogTitle>Add New Investment</DialogTitle>
                        <DialogDescription>
                          Enter the stock symbol, number of shares, and your average cost per share.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddInvestment} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="symbol">Stock Symbol</Label>
                          <Input
                            id="symbol"
                            placeholder="e.g., AAPL, TSLA, MSFT"
                            value={newInvestment.symbol}
                            onChange={(e) => setNewInvestment(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                            className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shares">Number of Shares</Label>
                          <Input
                            id="shares"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 10"
                            value={newInvestment.shares}
                            onChange={(e) => setNewInvestment(prev => ({ ...prev, shares: e.target.value }))}
                            className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="averageCost">Average Cost per Share</Label>
                          <Input
                            id="averageCost"
                            type="number"
                            step="0.01"
                            placeholder="e.g., 150.00"
                            value={newInvestment.averageCost}
                            onChange={(e) => setNewInvestment(prev => ({ ...prev, averageCost: e.target.value }))}
                            className="bg-[#1a1a1a] border-[#333] text-[#f5f5f5]"
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddDialogOpen(false)}
                            className="bg-[#333] text-[#f5f5f5] hover:bg-[#444]"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                          >
                            Add Investment
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              {/* Refresh Message */}
              {refreshMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-lg text-sm ${
                    refreshMessage.includes("Successfully") || refreshMessage.includes("Updated")
                      ? "bg-green-900/20 border border-green-500/30 text-green-400"
                      : refreshMessage.includes("Failed")
                      ? "bg-red-900/20 border border-red-500/30 text-red-400"
                      : "bg-blue-900/20 border border-blue-500/30 text-blue-400"
                  }`}
                >
                  {refreshMessage}
                </motion.div>
              )}
            </motion.div>

            {/* Portfolio Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <Card className="bg-[#111111] border-[#333]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#888] text-sm font-medium">Total Portfolio Value</p>
                      <p className="text-2xl font-bold text-[#f5f5f5]">
                        {formatCurrency(portfolioSummary.totalValue)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[#00ff88]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#888] text-sm font-medium">Total Gain/Loss</p>
                      <p className={`text-2xl font-bold ${portfolioSummary.totalGainLoss >= 0 ? 'text-[#00ff88]' : 'text-[#ff0080]'}`}>
                        {portfolioSummary.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.totalGainLoss)}
                      </p>
                      <p className={`text-sm ${portfolioSummary.totalGainLossPercent >= 0 ? 'text-[#00ff88]' : 'text-[#ff0080]'}`}>
                        {portfolioSummary.totalGainLossPercent >= 0 ? '+' : ''}{formatNumber(portfolioSummary.totalGainLossPercent)}%
                      </p>
                    </div>
                    {portfolioSummary.totalGainLoss >= 0 ? (
                      <TrendingUp className="h-8 w-8 text-[#00ff88]" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-[#ff0080]" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#888] text-sm font-medium">Day Change</p>
                      <p className={`text-2xl font-bold ${portfolioSummary.dayChange >= 0 ? 'text-[#00ff88]' : 'text-[#ff0080]'}`}>
                        {portfolioSummary.dayChange >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.dayChange)}
                      </p>
                    </div>
                    {portfolioSummary.dayChange >= 0 ? (
                      <ArrowUpRight className="h-8 w-8 text-[#00ff88]" />
                    ) : (
                      <ArrowDownRight className="h-8 w-8 text-[#ff0080]" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#888] text-sm font-medium">Holdings</p>
                      <p className="text-2xl font-bold text-[#f5f5f5]">
                        {portfolioSummary.investmentCount}
                      </p>
                      <p className="text-sm text-[#888]">stocks</p>
                    </div>
                    <PieChart className="h-8 w-8 text-[#00ff88]" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Investments List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-[#111111] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-[#f5f5f5]">Your Holdings</CardTitle>
                  <CardDescription className="text-[#888]">
                    {investments.length === 0 
                      ? "No investments yet. Add your first stock to get started!"
                      : `${investments.length} investment${investments.length !== 1 ? 's' : ''} in your portfolio`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {investments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-[#888] text-lg mb-2">No investments found</div>
                      <p className="text-[#666] mb-4">Start building your portfolio by adding your first stock</p>
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Investment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {investments.map((investment, index) => (
                        <motion.div
                          key={investment._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {/* Stock Symbol */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-[#00ff88]/20 rounded-full flex items-center justify-center">
                                <span className="font-bold text-[#00ff88] text-sm">
                                  {investment.symbol.substring(0, 2)}
                                </span>
                              </div>
                            </div>

                            {/* Stock Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-[#f5f5f5] text-lg">
                                  {investment.symbol}
                                </h3>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs bg-[#333] text-[#ccc] hover:bg-[#444]"
                                >
                                  {formatNumber(investment.shares)} shares
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-[#888]">
                                <span>Avg Cost: {formatCurrency(investment.averageCost)}</span>
                                <span>Current: {formatCurrency(investment.currentPrice)}</span>
                                <span className={`${investment.dayChangePercent >= 0 ? 'text-[#00ff88]' : 'text-[#ff0080]'}`}>
                                  {investment.dayChangePercent >= 0 ? '+' : ''}{formatNumber(investment.dayChangePercent)}% today
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Value and Actions */}
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-lg font-semibold text-[#f5f5f5]">
                                {formatCurrency(investment.totalValue)}
                              </div>
                              <div className={`text-sm ${investment.totalGainLoss >= 0 ? 'text-[#00ff88]' : 'text-[#ff0080]'}`}>
                                {investment.totalGainLoss >= 0 ? '+' : ''}{formatCurrency(investment.totalGainLoss)} 
                                ({investment.totalGainLossPercent >= 0 ? '+' : ''}{formatNumber(investment.totalGainLossPercent)}%)
                              </div>
                            </div>

                            {/* Delete Button */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-[#888] hover:text-[#ff0080] hover:bg-[#ff0080]/10"
                                  onClick={() => setDeleteInvestmentId(investment._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-[#111111] border-[#333]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-[#f5f5f5]">Delete Investment</AlertDialogTitle>
                                  <AlertDialogDescription className="text-[#888]">
                                    Are you sure you want to delete this investment? This action cannot be undone.
                                    <br />
                                    <br />
                                    <strong className="text-[#f5f5f5]">
                                      {investment.symbol} - {formatNumber(investment.shares)} shares
                                    </strong>
                                    <br />
                                    <span className="text-[#f5f5f5]">
                                      Value: {formatCurrency(investment.totalValue)}
                                    </span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-[#333] text-[#f5f5f5] hover:bg-[#444]">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteInvestment}
                                    className="bg-[#ff0080] text-white hover:bg-[#ff0080]/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Investment Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <InvestmentAIInsights 
                portfolioSummary={portfolioSummary}
                investments={investments}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
