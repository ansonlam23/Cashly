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
  BarChart3,
  Zap,
  PieChart,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";

interface InvestmentAIInsightsData {
  portfolioHighlights: {
    bestPerformer: string;
    worstPerformer: string;
    diversificationAlert: string;
    riskAssessment: string;
  };
  stockInsights: Array<{
    symbol: string;
    insight: string;
    suggestion: string;
    performance: string;
  }>;
  portfolioAnalysis: Array<{
    type: string;
    message: string;
    actionable: string;
  }>;
  funFacts: string[];
  actionableRecommendations: Array<string | { roast: string; recommendation: string; impact: string }>;
}

interface InvestmentAIInsightsProps {
  portfolioSummary: any;
  investments: any[];
}

export function InvestmentAIInsights({ portfolioSummary, investments }: InvestmentAIInsightsProps) {
  const [insights, setInsights] = useState<InvestmentAIInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  
  const generateInvestmentInsights = useAction(api.aiInsights.generateInvestmentInsights);

  const loadInsights = async (isRefresh = false) => {
    if (!portfolioSummary) {
      setError("No portfolio data available");
      return;
    }
    
    if (!investments || !Array.isArray(investments)) {
      setError("No investment data available");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateInvestmentInsights({
        portfolioSummary,
        investments
      });
      setInsights(result as InvestmentAIInsightsData);
      setLastRefresh(new Date());
      
      if (isRefresh) {
        // Add a small delay to show the refresh animation
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate investment insights');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (portfolioSummary && investments) {
      loadInsights();
    }
  }, [portfolioSummary, investments]);

  if (isLoading) {
    return (
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Investment Insights
          </CardTitle>
          <CardDescription className="text-[#888]">
            Your personal investment advisor is analyzing your portfolio...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#00ff88] mx-auto mb-4" />
              <p className="text-[#888]">Analyzing your investment portfolio...</p>
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
                    AI Investment Insights
                  </CardTitle>
                  <CardDescription className="text-[#888]">
                    Your personal investment advisor with personality! 📈
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
                        Analyzing...
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
              Investment Insights Error
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
                    Analyzing...
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
                    AI Investment Insights
                  </CardTitle>
                  <CardDescription className="text-[#888]">
                    Your personal investment advisor with personality! 📈
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
                        Analyzing...
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
              No Investment Data
            </CardTitle>
            <CardDescription className="text-[#888]">
              Add some investments to get started!
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
                    Analyzing...
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
                  AI Investment Insights
                </CardTitle>
                <CardDescription className="text-[#888]">
                  Your personal investment advisor with personality! 📈
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
                      Analyzing...
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

      {/* Portfolio Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-[#111111] border-[#00ff88]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-[#00ff88]" />
              <span className="font-semibold text-[#f5f5f5]">Best Performer</span>
            </div>
            <p className="text-sm text-[#888]">{insights.portfolioHighlights.bestPerformer}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#ff0080]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-[#ff0080]" />
              <span className="font-semibold text-[#f5f5f5]">Worst Performer</span>
            </div>
            <p className="text-sm text-[#888]">{insights.portfolioHighlights.worstPerformer}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#ffaa00]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-[#ffaa00]" />
              <span className="font-semibold text-[#f5f5f5]">Diversification</span>
            </div>
            <p className="text-sm text-[#888]">{insights.portfolioHighlights.diversificationAlert}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#0088ff]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-[#0088ff]" />
              <span className="font-semibold text-[#f5f5f5]">Risk Level</span>
            </div>
            <p className="text-sm text-[#888]">{insights.portfolioHighlights.riskAssessment}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stock Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Stock Analysis
            </CardTitle>
            <CardDescription className="text-[#888]">
              Individual stock performance and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.stockInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-[#1a1a1a] rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Badge className="bg-[#00ff88] text-black">
                      {insight.symbol}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-[#f5f5f5] font-medium mb-2">{insight.insight}</p>
                      <p className="text-sm text-[#888] mb-2">{insight.suggestion}</p>
                      <p className="text-xs text-[#00ff88] font-medium">{insight.performance}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Portfolio Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-[#111111] border-[#0088ff]">
          <CardHeader>
            <CardTitle className="text-[#0088ff] flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Portfolio Analysis
            </CardTitle>
            <CardDescription className="text-[#888]">
              Overall portfolio health and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.portfolioAnalysis.map((analysis, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 bg-[#1a1a1a] rounded-lg border border-[#0088ff]/30"
                >
                  <p className="text-[#f5f5f5] font-medium mb-2">{analysis.message}</p>
                  <p className="text-sm text-[#888]">
                    <strong>Action:</strong> {analysis.actionable}
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
              Investment Fun Facts
            </CardTitle>
            <CardDescription className="text-[#888]">
              Interesting observations about your portfolio
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
              Investment Recommendations
            </CardTitle>
            <CardDescription className="text-[#888]">
              Specific steps to optimize your investment strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.actionableRecommendations.map((recommendation, index) => {
                // Check if it's a structured recommendation (object) or simple string
                const isStructured = typeof recommendation === 'object' && recommendation.roast;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333]"
                  >
                    {isStructured ? (
                      <div className="space-y-4">
                        {/* Roast */}
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#ff0080] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-[#f5f5f5] text-sm leading-relaxed">{recommendation.roast}</p>
                          </div>
                        </div>
                        
                        {/* Recommendation */}
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#0088ff] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            💡
                          </div>
                          <div className="flex-1">
                            <p className="text-[#f5f5f5] text-sm leading-relaxed">{recommendation.recommendation}</p>
                          </div>
                        </div>
                        
                        {/* Impact */}
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#00ff88] rounded-full flex items-center justify-center text-black font-bold text-sm">
                            🎯
                          </div>
                          <div className="flex-1">
                            <p className="text-[#f5f5f5] text-sm leading-relaxed">{recommendation.impact}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#00ff88] rounded-full flex items-center justify-center text-black font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-[#f5f5f5] flex-1">{String(recommendation)}</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
