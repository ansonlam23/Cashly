import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Home, Car, Shield, TrendingUp } from "lucide-react";

interface Goal {
  _id: string;
  goalType: "house" | "car" | "emergency" | "investment" | "general";
  targetAmount: number;
  currentAmount?: number;
  targetDate: string;
  monthlyContribution?: number;
  riskTolerance: string;
  description?: string;
}

interface GoalsOverviewProps {
  goals: Goal[];
}

const goalIcons = {
  house: Home,
  car: Car,
  emergency: Shield,
  investment: TrendingUp,
  general: Target,
};

const goalColors = {
  house: "#00ff88",
  car: "#0088ff",
  emergency: "#ff0080",
  investment: "#ffaa00",
  general: "#aa00ff",
};

export function GoalsOverview({ goals }: GoalsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#f5f5f5]">Financial Goals</h2>
          <p className="text-[#888]">Track your progress towards financial freedom</p>
        </div>
        <Button className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a]">
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const Icon = goalIcons[goal.goalType];
            const color = goalColors[goal.goalType];
            const progress = ((goal.currentAmount || 0) / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - (goal.currentAmount || 0);
            
            return (
              <Card key={goal._id} className="bg-[#111111] border-[#333] hover:border-[#555] transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-[#f5f5f5] capitalize">
                          {goal.goalType} Goal
                        </CardTitle>
                        <CardDescription className="text-[#888]">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className="bg-[#333] text-[#ccc] capitalize"
                    >
                      {goal.riskTolerance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#888]">Progress</span>
                      <span className="text-[#f5f5f5]">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-2"
                      style={{ 
                        backgroundColor: '#333',
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[#888]">Current</p>
                      <p className="font-semibold text-[#f5f5f5]">
                        ${(goal.currentAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#888]">Target</p>
                      <p className="font-semibold text-[#f5f5f5]">
                        ${goal.targetAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#888]">Remaining</p>
                      <p className="font-semibold text-[#ff0080]">
                        ${remaining.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#888]">Monthly</p>
                      <p className="font-semibold text-[#00ff88]">
                        ${(goal.monthlyContribution || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-[#888] italic">
                      "{goal.description}"
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] border-[#333] border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-16 w-16 text-[#555] mb-4" />
            <h3 className="text-xl font-semibold text-[#f5f5f5] mb-2">No Goals Set</h3>
            <p className="text-[#888] text-center mb-6 max-w-md">
              Start your financial journey by setting your first goal. Whether it's saving for a house, 
              building an emergency fund, or planning investments - we'll help you get there.
            </p>
            <Button className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0a0a]">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
