import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Calendar, DollarSign, AlertCircle, Heart, Star } from "lucide-react";

interface GoalInsightsProps {
  goals: any[];
}

const PRIORITY_ICONS = {
  urgent: AlertCircle,
  fun: Heart,
  dream: Star
};

const PRIORITY_COLORS = {
  urgent: "bg-red-500",
  fun: "bg-pink-500",
  dream: "bg-purple-500"
};

const CATEGORY_COLORS = {
  short_term: "bg-green-500",
  medium_term: "bg-yellow-500",
  long_term: "bg-blue-500"
};

export function GoalInsights({ goals }: GoalInsightsProps) {
  if (!goals || goals.length === 0) {
    return (
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goal Insights
          </CardTitle>
          <CardDescription className="text-[#888]">
            Your financial goals and progress overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto mb-4 text-[#888] opacity-50" />
            <p className="text-[#888]">No goals created yet</p>
            <p className="text-sm text-[#666] mt-1">Create your first goal to see insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount);
  const inProgressGoals = goals.filter(goal => goal.currentAmount > 0 && goal.currentAmount < goal.targetAmount);
  const notStartedGoals = goals.filter(goal => goal.currentAmount === 0);

  const goalsByCategory = {
    short_term: goals.filter(goal => goal.category === 'short_term'),
    medium_term: goals.filter(goal => goal.category === 'medium_term'),
    long_term: goals.filter(goal => goal.category === 'long_term')
  };

  const goalsByPriority = {
    urgent: goals.filter(goal => goal.priority === 'urgent'),
    fun: goals.filter(goal => goal.priority === 'fun'),
    dream: goals.filter(goal => goal.priority === 'dream')
  };

  const getNextMilestone = (goal: any) => {
    if (!goal.milestones || goal.milestones.length === 0) return null;
    return goal.milestones.find((milestone: any) => !milestone.achieved && goal.currentAmount >= milestone.amount);
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="bg-[#111111] border-[#333]">
        <CardHeader>
          <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription className="text-[#888]">
            Your progress across all financial goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                <div className="text-2xl font-bold text-[#00ff88]">${totalCurrentAmount.toLocaleString()}</div>
                <div className="text-sm text-[#888]">Saved</div>
              </div>
              <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                <div className="text-2xl font-bold text-[#f5f5f5]">${totalTargetAmount.toLocaleString()}</div>
                <div className="text-sm text-[#888]">Target</div>
              </div>
              <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                <div className="text-2xl font-bold text-[#0088ff]">{overallProgress.toFixed(1)}%</div>
                <div className="text-sm text-[#888]">Complete</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Overall Progress</span>
                <span className="text-[#f5f5f5]">{overallProgress.toFixed(1)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#111111] border-[#00ff88]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-[#00ff88] rounded-full"></div>
              <span className="text-sm font-medium text-[#f5f5f5]">Completed</span>
            </div>
            <div className="text-2xl font-bold text-[#00ff88]">{completedGoals.length}</div>
            <div className="text-xs text-[#888]">Goals achieved</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#0088ff]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-[#0088ff] rounded-full"></div>
              <span className="text-sm font-medium text-[#f5f5f5]">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-[#0088ff]">{inProgressGoals.length}</div>
            <div className="text-xs text-[#888]">Goals active</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#888]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-[#888] rounded-full"></div>
              <span className="text-sm font-medium text-[#f5f5f5]">Not Started</span>
            </div>
            <div className="text-2xl font-bold text-[#888]">{notStartedGoals.length}</div>
            <div className="text-xs text-[#888]">Goals pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Goals by Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(goalsByCategory).map(([category, categoryGoals]) => {
          if (categoryGoals.length === 0) return null;
          
          const categoryProgress = categoryGoals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / categoryGoals.length * 100;
          const categoryTotal = categoryGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
          const categorySaved = categoryGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
          
          return (
            <Card key={category} className="bg-[#111111] border-[#333]">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#f5f5f5] flex items-center gap-2 text-sm">
                  <Badge className={`${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]} text-white`}>
                    {category.replace('_', ' ')}
                  </Badge>
                  {categoryGoals.length} goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-[#f5f5f5]">
                    ${categorySaved.toLocaleString()} / ${categoryTotal.toLocaleString()}
                  </div>
                  <Progress value={categoryProgress} className="h-2" />
                  <div className="text-xs text-[#888]">
                    {categoryProgress.toFixed(1)}% complete
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Milestones */}
      {goals.some(goal => goal.milestones && goal.milestones.some((m: any) => !m.achieved)) && (
        <Card className="bg-[#111111] border-[#333]">
          <CardHeader>
            <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
              <Target className="h-5 w-5" />
              Upcoming Milestones
            </CardTitle>
            <CardDescription className="text-[#888]">
              Milestones you're close to achieving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {goals.map((goal) => {
                const nextMilestone = getNextMilestone(goal);
                if (!nextMilestone) return null;
                
                const progress = (goal.currentAmount / nextMilestone.amount) * 100;
                const PriorityIcon = PRIORITY_ICONS[goal.priority as keyof typeof PRIORITY_ICONS];
                
                return (
                  <div key={goal._id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                    <PriorityIcon className="h-4 w-4 text-[#888]" />
                    <div className="flex-1">
                      <div className="font-medium text-[#f5f5f5] text-sm">{goal.title}</div>
                      <div className="text-xs text-[#888]">{nextMilestone.description}</div>
                      <div className="mt-1">
                        <Progress value={progress} className="h-1" />
                        <div className="text-xs text-[#888] mt-1">
                          ${goal.currentAmount.toLocaleString()} / ${nextMilestone.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
