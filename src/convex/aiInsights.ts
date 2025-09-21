import { action } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { api } from "./_generated/api";

// Generate AI-like insights directly without external LLM
function generateInsightsDirectly(financialData: any) {
  const {
    totalIncome,
    totalSpending,
    netFlow,
    currentBalance,
    spendingByCategory,
    topMerchants,
    monthlyTrend,
    goals
  } = financialData;

  // Calculate key metrics
  const topCategory = spendingByCategory[0];
  const biggestMerchant = topMerchants[0];
  const isOverspending = netFlow < 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

  // Generate spending highlights
  const spendingHighlights = {
    biggestExpense: topCategory 
      ? `You spent $${topCategory.amount.toLocaleString()} on ${topCategory.category} this month... that's a lot of ${topCategory.category.toLowerCase()}! 🍕`
      : "No major expenses detected yet!",
    
    overspendingAlert: isOverspending 
      ? `You're spending $${Math.abs(netFlow).toLocaleString()} more than you earn this month... time to check those habits! 💸`
      : "Great job staying within your means! 🎉",
    
    positiveReinforcement: savingsRate > 20 
      ? `Amazing! You're saving ${savingsRate.toFixed(1)}% of your income - that's financial discipline! 🏆`
      : savingsRate > 0 
        ? `You're saving ${savingsRate.toFixed(1)}% of your income - every bit counts! 💪`
        : "Time to start building those savings habits! 🚀"
  };

  // Generate category insights
  const categoryInsights = spendingByCategory.slice(0, 3).map((category: any, index: number) => {
    const percentage = totalSpending > 0 ? (category.amount / totalSpending) * 100 : 0;
    const suggestions = {
      "Food and Drink": "Try meal prepping to cut costs by 20%! Your wallet and waistline will thank you.",
      "Transportation": "Consider walking or biking for short trips - it's free and healthy!",
      "Entertainment": "Look for student discounts and free events on campus.",
      "Shopping": "Wait 24 hours before buying non-essentials - you might not want it tomorrow.",
      "Coffee Shops": "A $5 coffee habit = $1,825/year. Consider a French press!",
      "Other": "This category needs some attention - track what's going here."
    };

    return {
      category: category.category,
      insight: `${category.category} is ${percentage.toFixed(1)}% of your spending - ${percentage > 30 ? 'that\'s quite a lot!' : 'not too bad.'}`,
      suggestion: suggestions[category.category as keyof typeof suggestions] || "Consider if this spending aligns with your goals."
    };
  });

  // Generate predictions
  const predictions = [];
  
  if (goals.length > 0) {
    const activeGoal = goals[0];
    const monthlyContribution = activeGoal.monthlyContribution || 0;
    const remainingAmount = activeGoal.targetAmount - activeGoal.currentAmount;
    const monthsToGoal = monthlyContribution > 0 ? Math.ceil(remainingAmount / monthlyContribution) : 999;
    
    predictions.push({
      type: "goal_timeline",
      message: `At your current rate, you'll reach your ${activeGoal.title} goal in ${monthsToGoal} months.`,
      actionable: monthlyContribution > 0 ? "Keep up the consistent contributions!" : "Consider setting up automatic monthly contributions."
    });
  }

  if (monthlyTrend.length >= 2) {
    const recent = monthlyTrend[monthlyTrend.length - 1].amount;
    const previous = monthlyTrend[monthlyTrend.length - 2].amount;
    const change = ((recent - previous) / previous) * 100;
    
    predictions.push({
      type: "spending_trend",
      message: `Your spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% this month.`,
      actionable: change > 10 ? "Time to review what caused the increase!" : "Great job controlling your spending!"
    });
  }

  // Generate fun facts
  const funFacts = [];
  
  if (biggestMerchant) {
    const avgPerTransaction = biggestMerchant.totalAmount / biggestMerchant.count;
    funFacts.push(`You've visited ${biggestMerchant.merchant} ${biggestMerchant.count} times - that's $${avgPerTransaction.toFixed(2)} per visit!`);
  }
  
  if (totalSpending > 0) {
    const dailyAverage = totalSpending / 30;
    funFacts.push(`You spend an average of $${dailyAverage.toFixed(2)} per day - that's like buying ${Math.round(dailyAverage / 5)} coffees daily!`);
  }
  
  if (savingsRate > 0) {
    const yearlySavings = (totalIncome - totalSpending) * 12;
    funFacts.push(`At this rate, you'll save $${yearlySavings.toLocaleString()} this year - that's a nice vacation fund! ✈️`);
  }

  // Generate actionable recommendations
  const actionableRecommendations = [];
  
  if (isOverspending) {
    actionableRecommendations.push("Create a monthly budget and stick to it - your future self will thank you!");
  }
  
  if (topCategory && (topCategory.amount / totalSpending) > 0.3) {
    actionableRecommendations.push(`Reduce ${topCategory.category} spending by 20% - that's $${(topCategory.amount * 0.2).toFixed(2)} saved monthly!`);
  }
  
  if (goals.length > 0) {
    actionableRecommendations.push("Set up automatic transfers to your goal accounts - out of sight, out of mind!");
  }
  
  actionableRecommendations.push("Review your subscriptions monthly - cancel what you don't use!");
  actionableRecommendations.push("Use the 24-hour rule for purchases over $50 - sleep on it!");

  return {
    spendingHighlights,
    categoryInsights,
    predictions,
    funFacts,
    actionableRecommendations
  };
}

export const generateAIInsights = action({
  args: {},
  handler: async (ctx) => {
    // For actions, we need to use runQuery instead of direct context access
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) throw new Error("Not authenticated");

    try {
      // Get all financial data
      const [
        spendingByCategory,
        incomeVsSpending,
        topMerchants,
        monthlyTrend,
        currentBalance,
        userGoals
      ] = await Promise.all([
        ctx.runQuery(api.transactions.getSpendingByCategory),
        ctx.runQuery(api.transactions.getIncomeVsSpending),
        ctx.runQuery(api.transactions.getTopMerchants, { limit: 5 }),
        ctx.runQuery(api.transactions.getMonthlySpendingTrend, { months: 6 }),
        ctx.runQuery(api.transactions.getCurrentBalance),
        ctx.runQuery(api.goals.getActiveGoals)
      ]);

      // Prepare data for AI
      const financialData = {
        totalIncome: incomeVsSpending?.totalIncome || 0,
        totalSpending: incomeVsSpending?.totalSpending || 0,
        netFlow: currentBalance?.netFlow || 0,
        currentBalance: currentBalance?.currentBalance || 0,
        spendingByCategory: spendingByCategory || [],
        topMerchants: topMerchants || [],
        monthlyTrend: monthlyTrend || [],
        goals: userGoals || []
      };

      // Generate insights directly using a simpler approach
      // Since we can't use child_process in Convex, we'll create insights here
      const insights = generateInsightsDirectly(financialData);
      return insights;

    } catch (error) {
      console.error('Error generating AI insights:', error);
      throw new Error(`Failed to generate AI insights: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// API import moved to top of file
