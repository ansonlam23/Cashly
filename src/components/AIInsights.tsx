import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Sparkles,
  DollarSign,
  Calendar,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";

interface AIInsightsData {
  spendingHighlights: {
    biggestExpense: string;
    overspendingAlert: string;
    positiveReinforcement: string;
  };
  categoryInsights: Array<{
    category: string;
    insight: string;
    suggestion: string;
  }>;
  predictions: Array<{
    type: string;
    message: string;
    actionable: string;
  }>;
  funFacts: string[];
  actionableRecommendations: string[];
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  const generateInsights = useAction(api.aiInsights.generateAIInsights);

  const loadInsights = async (isRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateInsights();
      setInsights(result as AIInsightsData);
      setLastRefresh(new Date());
      
      if (isRefresh) {
        // Add a small delay to show the refresh animation
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Financial Insights
          </CardTitle>
          <CardDescription className="text-[#888]">
            Your personal financial coach is analyzing your data...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#00ff88] mx-auto mb-4" />
              <p className="text-[#888]">Generating personalized insights...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header with refresh button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#111111] border-[#00ff88]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#00ff88] flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    AI Financial Insights
                  </CardTitle>
                  <CardDescription className="text-[#888]">
                    Your personal financial coach with personality! 🤖
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => loadInsights(true)}
                    disabled={isLoading}
                    className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Get New Insights
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Error Card */}
        <Card className="bg-[#111111] border-[#ff0080]">
          <CardHeader>
            <CardTitle className="text-[#ff0080] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              AI Insights Error
            </CardTitle>
            <CardDescription className="text-[#888]">
              Something went wrong while generating insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-[#888] mb-4">{error}</p>
              <Button 
                onClick={() => loadInsights(true)}
                disabled={isLoading}
                className="bg-[#00ff88] hover:bg-[#00cc6a] text-black"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="space-y-6">
        {/* Header with refresh button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-[#111111] border-[#00ff88]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#00ff88] flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    AI Financial Insights
                  </CardTitle>
                  <CardDescription className="text-[#888]">
                    Your personal financial coach with personality! 🤖
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => loadInsights(true)}
                    disabled={isLoading}
                    className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Get New Insights
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* No Insights Card */}
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
              <Brain className="h-5 w-5" />
              No Insights Available
            </CardTitle>
            <CardDescription className="text-[#888]">
              Add some transactions to get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Button 
                onClick={() => loadInsights(true)}
                disabled={isLoading}
                className="bg-[#00ff88] hover:bg-[#00cc6a] text-black"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Insights
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-[#111111] border-[#00ff88]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#00ff88] flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  AI Financial Insights
                </CardTitle>
                <CardDescription className="text-[#888]">
                  Your personal financial coach with personality! 🤖
                  {lastRefresh && (
                    <span className="block text-xs mt-1">
                      Last updated: {lastRefresh.toLocaleTimeString()}
                    </span>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => loadInsights(true)}
                  disabled={isLoading}
                  className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Get New Insights
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Spending Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-[#111111] border-[#ff0080]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-[#ff0080]" />
              <span className="font-semibold text-[#f5f5f5]">Biggest Expense</span>
            </div>
            <p className="text-sm text-[#888]">{insights.spendingHighlights.biggestExpense}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#ffaa00]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-[#ffaa00]" />
              <span className="font-semibold text-[#f5f5f5]">Alert</span>
            </div>
            <p className="text-sm text-[#888]">{insights.spendingHighlights.overspendingAlert}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#00ff88]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-[#00ff88]" />
              <span className="font-semibold text-[#f5f5f5]">Good Job!</span>
            </div>
            <p className="text-sm text-[#888]">{insights.spendingHighlights.positiveReinforcement}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
              <Target className="h-5 w-5" />
              Category Insights
            </CardTitle>
            <CardDescription className="text-[#888]">
              What your spending categories are telling you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.categoryInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-[#1a1a1a] rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Badge className="bg-[#00ff88] text-black">
                      {insight.category}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-[#f5f5f5] font-medium mb-2">{insight.insight}</p>
                      <p className="text-sm text-[#888]">{insight.suggestion}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-[#111111] border-[#0088ff]">
          <CardHeader>
            <CardTitle className="text-[#0088ff] flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Future Predictions
            </CardTitle>
            <CardDescription className="text-[#888]">
              What your current patterns mean for the future
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.predictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-[#1a1a1a] rounded-lg border border-[#0088ff]/30"
                >
                  <p className="text-[#f5f5f5] font-medium mb-2">{prediction.message}</p>
                  <p className="text-sm text-[#888]">
                    <strong>Action:</strong> {prediction.actionable}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fun Facts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-[#111111] border-[#ff0080]">
          <CardHeader>
            <CardTitle className="text-[#ff0080] flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Fun Facts
            </CardTitle>
            <CardDescription className="text-[#888]">
              Light-hearted observations about your spending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.funFacts.map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-3 bg-[#1a1a1a] rounded-lg"
                >
                  <p className="text-[#f5f5f5]">{fact}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actionable Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="bg-[#111111] border-[#00ff88]">
          <CardHeader>
            <CardTitle className="text-[#00ff88] flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Actionable Recommendations
            </CardTitle>
            <CardDescription className="text-[#888]">
              Specific steps you can take to improve your financial health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.actionableRecommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg"
                >
                  <div className="w-6 h-6 bg-[#00ff88] rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-[#f5f5f5] flex-1">{recommendation}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
