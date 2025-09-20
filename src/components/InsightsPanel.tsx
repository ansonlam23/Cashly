import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  TrendingUp,
  DollarSign,
  Target,
  Zap
} from "lucide-react";

interface Insight {
  _id: string;
  type: "spending_pattern" | "budget_recommendation" | "investment_advice" | "humorous_roast" | "goal_progress";
  title: string;
  content: string;
  severity: "info" | "warning" | "critical" | "positive";
  relatedCategory?: string;
  actionable: boolean;
}

interface InsightsPanelProps {
  insights: Insight[];
}

const insightIcons = {
  spending_pattern: TrendingUp,
  budget_recommendation: DollarSign,
  investment_advice: Target,
  humorous_roast: Zap,
  goal_progress: CheckCircle,
};

const severityColors = {
  info: "#0088ff",
  warning: "#ffaa00",
  critical: "#ff0080",
  positive: "#00ff88",
};

const severityIcons = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertTriangle,
  positive: CheckCircle,
};

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#f5f5f5]">AI Insights</h2>
          <p className="text-[#888]">Personalized recommendations based on your spending</p>
        </div>
        <Badge variant="secondary" className="bg-[#333] text-[#ccc]">
          {insights.length} New
        </Badge>
      </div>

      {insights.length > 0 ? (
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {insights.map((insight) => {
              const TypeIcon = insightIcons[insight.type];
              const SeverityIcon = severityIcons[insight.severity];
              const color = severityColors[insight.severity];
              
              return (
                <Card 
                  key={insight._id} 
                  className="bg-[#111111] border-[#333] hover:border-[#555] transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-[#f5f5f5] text-lg">
                            {insight.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary"
                              className="text-xs capitalize"
                              style={{ backgroundColor: `${color}20`, color }}
                            >
                              <SeverityIcon className="h-3 w-3 mr-1" />
                              {insight.severity}
                            </Badge>
                            {insight.relatedCategory && (
                              <Badge variant="outline" className="text-xs border-[#555] text-[#ccc]">
                                {insight.relatedCategory}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {insight.actionable && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-[#555] text-[#ccc] hover:bg-[#1a1a1a]"
                        >
                          Take Action
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#ccc] leading-relaxed">
                      {insight.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        <Card className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] border-[#333] border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lightbulb className="h-16 w-16 text-[#555] mb-4" />
            <h3 className="text-xl font-semibold text-[#f5f5f5] mb-2">No Insights Yet</h3>
            <p className="text-[#888] text-center mb-6 max-w-md">
              Upload your bank statements and set some goals to start receiving personalized 
              AI insights about your spending patterns and financial opportunities.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="border-[#555] text-[#ccc] hover:bg-[#1a1a1a]">
                Upload Statement
              </Button>
              <Button className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a]">
                Set Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
