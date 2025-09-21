import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Loader2, Plus, Target, Calendar, DollarSign, TrendingUp, AlertCircle, Star, Heart, Zap } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { CreateGoalForm } from "@/components/CreateGoalForm";
import { GoalInsights } from "@/components/GoalInsights";

const GOAL_TEMPLATES = [
  // Short-term goals
  {
    title: "Emergency Fund",
    goalType: "emergency" as const,
    category: "short_term" as const,
    priority: "urgent" as const,
    targetAmount: 500,
    description: "Build a safety net for unexpected expenses",
    monthlyContribution: 167,
    milestones: [
      { amount: 100, description: "First $100 saved", achieved: false },
      { amount: 250, description: "Halfway to emergency fund", achieved: false },
      { amount: 500, description: "Emergency fund complete!", achieved: false }
    ]
  },
  {
    title: "Cut Dining Out",
    goalType: "discretionary" as const,
    category: "short_term" as const,
    priority: "urgent" as const,
    targetAmount: 200,
    description: "Reduce dining out spending by 20% this month",
    monthlyContribution: 200,
    milestones: [
      { amount: 50, description: "First week of reduced spending", achieved: false },
      { amount: 150, description: "Halfway through the month", achieved: false },
      { amount: 200, description: "Monthly goal achieved!", achieved: false }
    ]
  },
  {
    title: "Index Fund Investment",
    goalType: "investment" as const,
    category: "short_term" as const,
    priority: "dream" as const,
    targetAmount: 150,
    description: "Start investing $50/month in index funds",
    monthlyContribution: 50,
    milestones: [
      { amount: 50, description: "First month invested", achieved: false },
      { amount: 100, description: "Two months of consistent investing", achieved: false },
      { amount: 150, description: "Three months of building wealth", achieved: false }
    ]
  },
  // Medium-term goals
  {
    title: "New Laptop",
    goalType: "laptop" as const,
    category: "medium_term" as const,
    priority: "fun" as const,
    targetAmount: 1000,
    description: "Save for a new laptop by next semester",
    monthlyContribution: 200,
    milestones: [
      { amount: 250, description: "Quarter saved", achieved: false },
      { amount: 500, description: "Halfway to new laptop", achieved: false },
      { amount: 750, description: "Almost there!", achieved: false },
      { amount: 1000, description: "Laptop fund complete!", achieved: false }
    ]
  },
  {
    title: "Spring Break Trip",
    goalType: "travel" as const,
    category: "medium_term" as const,
    priority: "fun" as const,
    targetAmount: 500,
    description: "Save for a spring break adventure",
    monthlyContribution: 125,
    milestones: [
      { amount: 125, description: "First month saved", achieved: false },
      { amount: 250, description: "Halfway to adventure", achieved: false },
      { amount: 375, description: "Almost ready to travel", achieved: false },
      { amount: 500, description: "Trip fund ready!", achieved: false }
    ]
  },
  // Long-term goals
  {
    title: "House Down Payment",
    goalType: "house" as const,
    category: "long_term" as const,
    priority: "dream" as const,
    targetAmount: 10000,
    description: "Save for a house down payment in 5 years",
    monthlyContribution: 167,
    milestones: [
      { amount: 1000, description: "First $1,000 saved", achieved: false },
      { amount: 2500, description: "Quarter of the way there", achieved: false },
      { amount: 5000, description: "Halfway to homeownership", achieved: false },
      { amount: 7500, description: "Almost ready to buy", achieved: false },
      { amount: 10000, description: "Down payment ready!", achieved: false }
    ]
  },
  {
    title: "Retirement Fund",
    goalType: "retirement" as const,
    category: "long_term" as const,
    priority: "dream" as const,
    targetAmount: 5000,
    description: "Start building retirement savings early",
    monthlyContribution: 50,
    milestones: [
      { amount: 500, description: "First $500 invested", achieved: false },
      { amount: 1000, description: "First $1,000 milestone", achieved: false },
      { amount: 2500, description: "Halfway to retirement goal", achieved: false },
      { amount: 5000, description: "Retirement fund established!", achieved: false }
    ]
  }
];

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

export default function Goals() {
  const { isLoading, isAuthenticated } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "short_term" | "medium_term" | "long_term">("all");
  
  const goals = useQuery(api.goals.getActiveGoals);
  const shortTermGoals = useQuery(api.goals.getGoalsByCategory, { category: "short_term" });
  const mediumTermGoals = useQuery(api.goals.getGoalsByCategory, { category: "medium_term" });
  const longTermGoals = useQuery(api.goals.getGoalsByCategory, { category: "long_term" });
  
  const addToGoal = useMutation(api.goals.addToGoal);
  const achieveMilestone = useMutation(api.goals.achieveMilestone);
  const deleteGoal = useMutation(api.goals.deleteGoal);

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
          <p className="text-[#888]">Please log in to view your goals.</p>
        </div>
      </div>
    );
  }

  const getGoalsForCategory = () => {
    switch (selectedCategory) {
      case "short_term": return shortTermGoals || [];
      case "medium_term": return mediumTermGoals || [];
      case "long_term": return longTermGoals || [];
      default: return goals || [];
    }
  };

  const handleAddToGoal = async (goalId: string, amount: number) => {
    try {
      await addToGoal({ goalId: goalId as any, amount });
    } catch (error) {
      console.error("Failed to add to goal:", error);
    }
  };

  const handleAchieveMilestone = async (goalId: string, milestoneIndex: number) => {
    try {
      await achieveMilestone({ goalId: goalId as any, milestoneIndex });
    } catch (error) {
      console.error("Failed to achieve milestone:", error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal({ goalId: goalId as any });
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  const currentGoals = getGoalsForCategory();

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
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl font-bold text-[#f5f5f5] mb-2 flex items-center gap-3"
              >
                <Target className="h-8 w-8 text-[#00ff88]" />
                Financial Goals
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[#888]"
              >
                Set, track, and achieve your financial milestones
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </motion.div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#1a1a1a]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="short_term" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Short-term
            </TabsTrigger>
            <TabsTrigger value="medium_term" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Medium-term
            </TabsTrigger>
            <TabsTrigger value="long_term" className="data-[state=active]:bg-[#00ff88] data-[state=active]:text-black">
              Long-term
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GoalInsights goals={goals || []} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="bg-[#111111] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Quick Start Templates
                  </CardTitle>
                  <CardDescription className="text-[#888]">
                    Choose from popular goal templates to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GOAL_TEMPLATES.slice(0, 4).map((template, index) => (
                      <motion.div
                        key={template.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#00ff88] transition-colors cursor-pointer"
                        onClick={() => {
                          setShowCreateForm(true);
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${CATEGORY_COLORS[template.category]} text-white`}>
                            {template.category.replace('_', ' ')}
                          </Badge>
                          <Badge className={`${PRIORITY_COLORS[template.priority]} text-white`}>
                            {template.priority}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-[#f5f5f5] mb-1">{template.title}</h3>
                        <p className="text-sm text-[#888] mb-2">{template.description}</p>
                        <div className="text-lg font-bold text-[#00ff88]">
                          ${template.targetAmount.toLocaleString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111111] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-[#f5f5f5] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Goal Progress
                  </CardTitle>
                  <CardDescription className="text-[#888]">
                    Track your overall progress across all goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goals?.slice(0, 3).map((goal, index) => {
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      const PriorityIcon = PRIORITY_ICONS[goal.priority];
                      
                      return (
                        <motion.div
                          key={goal._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <PriorityIcon className="h-4 w-4 text-[#888]" />
                              <span className="text-sm font-medium text-[#f5f5f5]">{goal.title}</span>
                            </div>
                            <span className="text-sm text-[#888]">
                              ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="text-xs text-[#888]">
                            {progress.toFixed(1)}% complete
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="short_term" className="space-y-6">
            <GoalsList 
              goals={shortTermGoals || []} 
              onAddToGoal={handleAddToGoal}
              onAchieveMilestone={handleAchieveMilestone}
              onDeleteGoal={handleDeleteGoal}
            />
          </TabsContent>

          <TabsContent value="medium_term" className="space-y-6">
            <GoalsList 
              goals={mediumTermGoals || []} 
              onAddToGoal={handleAddToGoal}
              onAchieveMilestone={handleAchieveMilestone}
              onDeleteGoal={handleDeleteGoal}
            />
          </TabsContent>

          <TabsContent value="long_term" className="space-y-6">
            <GoalsList 
              goals={longTermGoals || []} 
              onAddToGoal={handleAddToGoal}
              onAchieveMilestone={handleAchieveMilestone}
              onDeleteGoal={handleDeleteGoal}
            />
          </TabsContent>
        </Tabs>

        {showCreateForm && (
          <CreateGoalForm 
            onClose={() => setShowCreateForm(false)}
            templates={GOAL_TEMPLATES}
          />
        )}
      </motion.div>
    </div>
  );
}

function GoalsList({ 
  goals, 
  onAddToGoal, 
  onAchieveMilestone, 
  onDeleteGoal 
}: { 
  goals: any[]; 
  onAddToGoal: (goalId: string, amount: number) => void;
  onAchieveMilestone: (goalId: string, milestoneIndex: number) => void;
  onDeleteGoal: (goalId: string) => void;
}) {
  if (goals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <Target className="h-16 w-16 mx-auto mb-4 text-[#888] opacity-50" />
        <h3 className="text-xl font-semibold text-[#f5f5f5] mb-2">No goals yet</h3>
        <p className="text-[#888] mb-4">Create your first goal to start building your financial future</p>
        <Button className="bg-[#00ff88] hover:bg-[#00cc6a] text-black">
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {goals.map((goal, index) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const PriorityIcon = PRIORITY_ICONS[goal.priority];
        const isCompleted = goal.currentAmount >= goal.targetAmount;
        
        return (
          <motion.div
            key={goal._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`bg-[#111111] border-[#333] ${isCompleted ? 'border-[#00ff88]' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <PriorityIcon className="h-5 w-5 text-[#888]" />
                    <CardTitle className="text-[#f5f5f5]">{goal.title}</CardTitle>
                    {isCompleted && <Badge className="bg-[#00ff88] text-black">Completed!</Badge>}
                  </div>
                  <Badge className={`${PRIORITY_COLORS[goal.priority]} text-white`}>
                    {goal.priority}
                  </Badge>
                </div>
                <CardDescription className="text-[#888]">
                  {goal.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#888]">Progress</span>
                    <span className="text-[#f5f5f5]">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="text-xs text-[#888] text-center">
                    {progress.toFixed(1)}% complete
                  </div>
                </div>

                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-[#f5f5f5]">Milestones</h4>
                    <div className="space-y-1">
                      {goal.milestones.map((milestone: any, milestoneIndex: number) => (
                        <div key={milestoneIndex} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${milestone.achieved ? 'bg-[#00ff88]' : 'bg-[#333]'}`} />
                          <span className={`text-xs ${milestone.achieved ? 'text-[#00ff88] line-through' : 'text-[#888]'}`}>
                            {milestone.description}
                          </span>
                          {!milestone.achieved && goal.currentAmount >= milestone.amount && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() => onAchieveMilestone(goal._id, milestoneIndex)}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-[#00ff88] hover:bg-[#00cc6a] text-black"
                    onClick={() => onAddToGoal(goal._id, 50)}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Add $50
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#ff0080] text-[#ff0080] hover:bg-[#ff0080] hover:text-white"
                    onClick={() => onDeleteGoal(goal._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
