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

  // Add some randomization to make insights feel fresh each time
  const randomSeed = Date.now() % 1000;
  const randomVariations = [
    "💡", "🎯", "🚀", "💪", "🔥", "⭐", "🎉", "💎", "🌟", "⚡"
  ];
  const randomEmoji = randomVariations[randomSeed % randomVariations.length];

  // Calculate key metrics
  const topCategory = spendingByCategory[0];
  const biggestMerchant = topMerchants[0];
  const isOverspending = netFlow < 0;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;

  // Generate spending highlights with variations
  const getCategoryRoast = (category: string, amount: number) => {
    const categoryLower = category.toLowerCase();
    const roasts: { [key: string]: string[] } = {
      'food and drink': [
        `You've spent $${amount.toLocaleString()} on DoorDash this month. Congrats, you basically own stock in fries now.`,
        `At this rate, your pizza guy knows more about your budget than your bank.`,
        `Maybe cook once? Just once? Your wallet and arteries will thank you.`,
        `$${amount.toLocaleString()} on food delivery? You're single-handedly keeping the restaurant industry afloat.`
      ],
      'transportation': [
        `$${amount.toLocaleString()} on Uber? You could've just bought a used bike and a helmet… with streamers.`,
        `Uber surge pricing isn't an investment strategy. Take the bus, champ.`,
        `If you walk, you save money and skip leg day.`,
        `Your Uber driver probably thinks you're a rideshare influencer.`
      ],
      'shopping': [
        `Amazon called — they want to know if you're their silent business partner.`,
        `Retail therapy is not tax-deductible, sorry.`,
        `You're two sweaters away from starring in an episode of Hoarders: Student Edition.`,
        `$${amount.toLocaleString()} on shopping? Your closet has better ROI than your portfolio.`
      ],
      'coffee shops': [
        `$${amount.toLocaleString()} on Starbucks? That's not a latte, that's a mortgage.`,
        `Your caffeine budget has officially outpaced your textbook budget.`,
        `At this point, your barista should add you on their family phone plan.`,
        `$${amount.toLocaleString()} on coffee? You're basically a walking caffeine subscription.`
      ],
      'entertainment': [
        `Do you really need Netflix, Hulu, Disney+, and Crunchyroll? You've built a streaming hedge fund.`,
        `Your subscriptions look like Pokémon: you're trying to catch 'em all.`,
        `You're subscribed to more services than you attend lectures.`,
        `$${amount.toLocaleString()} on entertainment? Your couch is getting more action than your bank account.`
      ]
    };
    
    // Check for partial matches
    for (const [key, roastList] of Object.entries(roasts)) {
      if (categoryLower.includes(key) || key.includes(categoryLower)) {
        return roastList[randomSeed % roastList.length];
      }
    }
    
    // Default roasts for other categories
    return [
      `$${amount.toLocaleString()} on ${category}? ${randomEmoji} Someone's been treating themselves!`,
      `Your ${category} spending hit $${amount.toLocaleString()} - that's some serious dedication! 💪`,
      `$${amount.toLocaleString()} in ${category}... your wallet is feeling the burn! 🔥`,
      `$${amount.toLocaleString()} on ${category}? You're basically a walking ATM for this industry.`
    ][randomSeed % 4];
  };

  const expenseVariations = topCategory ? [
    getCategoryRoast(topCategory.category, topCategory.amount),
    `You spent $${topCategory.amount.toLocaleString()} on ${topCategory.category} this month... that's a lot of ${topCategory.category.toLowerCase()}! 🍕`,
    `$${topCategory.amount.toLocaleString()} on ${topCategory.category}? ${randomEmoji} Someone's been treating themselves!`,
    `Your ${topCategory.category} spending hit $${topCategory.amount.toLocaleString()} - that's some serious dedication! 💪`
  ] : ["No major expenses detected yet!"];

  const overspendingVariations = [
    `You're spending $${Math.abs(netFlow).toLocaleString()} more than you earn this month... time to check those habits! 💸`,
    `$${Math.abs(netFlow).toLocaleString()} over budget? ${randomEmoji} Time to tighten those purse strings!`,
    `Your spending is $${Math.abs(netFlow).toLocaleString()} above income - let's get back on track! 🎯`,
    `Overspending by $${Math.abs(netFlow).toLocaleString()}? ${randomEmoji} Time for a financial reality check!`,
    `You saved $0 this month — bold strategy, let's see how it plays out.`,
    `Your bank account is flatter than your roommate's soda.`,
    `Maybe Venmo yourself $10 and call it 'future you fund.'`,
    `$${Math.abs(netFlow).toLocaleString()} in the red? Your budget needs more red flags than a bullfight.`
  ];

  const positiveVariations = [
    `Amazing! You're saving ${savingsRate.toFixed(1)}% of your income - that's financial discipline! 🏆`,
    `You're saving ${savingsRate.toFixed(1)}% of your income - every bit counts! 💪`,
    `Time to start building those savings habits! 🚀`,
    `${savingsRate.toFixed(1)}% savings rate? ${randomEmoji} You're crushing it!`,
    `Your ${savingsRate.toFixed(1)}% savings rate is impressive - keep it up! ⭐`
  ];

  const spendingHighlights = {
    biggestExpense: topCategory 
      ? expenseVariations[randomSeed % expenseVariations.length]
      : "No major expenses detected yet!",
    
    overspendingAlert: isOverspending 
      ? overspendingVariations[randomSeed % overspendingVariations.length]
      : positiveVariations[randomSeed % positiveVariations.length],
    
    positiveReinforcement: savingsRate > 20 
      ? positiveVariations[randomSeed % positiveVariations.length]
      : savingsRate > 0 
        ? positiveVariations[randomSeed % positiveVariations.length]
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

  // Generate fun facts with variations
  const funFacts = [];
  
  if (biggestMerchant && biggestMerchant.merchant && biggestMerchant.totalAmount && biggestMerchant.count) {
    const avgPerTransaction = biggestMerchant.totalAmount / biggestMerchant.count;
    const merchantFacts = [
      `You've visited ${biggestMerchant.merchant} ${biggestMerchant.count} times - that's $${avgPerTransaction.toLocaleString('en-US')} per visit!`,
      `${biggestMerchant.merchant} has seen you ${biggestMerchant.count} times this month - they know you by name! ${randomEmoji}`,
      `$${avgPerTransaction.toLocaleString('en-US')} per visit at ${biggestMerchant.merchant}? ${randomEmoji} You're a VIP customer!`,
      `Your ${biggestMerchant.count} visits to ${biggestMerchant.merchant} cost $${avgPerTransaction.toLocaleString('en-US')} each - that's loyalty! 💎`
    ];
    funFacts.push(merchantFacts[randomSeed % merchantFacts.length]);
  }
  
  if (totalSpending > 0 && !isNaN(totalSpending)) {
    const dailyAverage = totalSpending / 30;
    if (!isNaN(dailyAverage) && dailyAverage > 0) {
      const dailyFacts = [
        `You spend an average of $${dailyAverage.toLocaleString('en-US')} per day - that's like buying ${Math.round(dailyAverage / 5)} coffees daily!`,
        `$${dailyAverage.toLocaleString('en-US')} daily spending? ${randomEmoji} That's some serious cash flow!`,
        `Your daily average of $${dailyAverage.toLocaleString('en-US')} could buy ${Math.round(dailyAverage / 3)} movie tickets! 🎬`,
        `$${dailyAverage.toLocaleString('en-US')} per day adds up to $${(dailyAverage * 365).toLocaleString('en-US')} annually! 💰`
      ];
      funFacts.push(dailyFacts[randomSeed % dailyFacts.length]);
    }
  }
  
  if (savingsRate > 0 && !isNaN(savingsRate)) {
    const yearlySavings = (totalIncome - totalSpending) * 12;
    if (!isNaN(yearlySavings) && yearlySavings > 0) {
      const savingsFacts = [
        `At this rate, you'll save $${yearlySavings.toLocaleString()} this year - that's a nice vacation fund! ✈️`,
        `$${yearlySavings.toLocaleString()} in annual savings? ${randomEmoji} You're building serious wealth!`,
        `Your yearly savings of $${yearlySavings.toLocaleString()} could buy a nice car! 🚗`,
        `$${yearlySavings.toLocaleString()} saved annually - that's financial freedom in the making! 🏆`
      ];
      funFacts.push(savingsFacts[randomSeed % savingsFacts.length]);
    }
  }

  // Add some general fun facts if we don't have enough data
  if (funFacts.length < 2) {
    const generalFacts = [
      `Financial health is a journey, not a destination! ${randomEmoji}`,
      `Every dollar saved today is a dollar earned for tomorrow! 💰`,
      `Small consistent actions lead to big financial wins! 🎯`,
      `Your future self will thank you for the financial choices you make today! 🙏`,
      `Building wealth is like building muscle - it takes time and consistency! 💪`,
      `The best time to start managing your money was yesterday, the second best time is now! ⏰`,
      `Your bank account is flatter than your roommate's soda.`,
      `Maybe Venmo yourself $10 and call it 'future you fund.'`,
      `You saved $0 this month — bold strategy, let's see how it plays out.`,
      `Your subscriptions look like Pokémon: you're trying to catch 'em all.`,
      `Retail therapy is not tax-deductible, sorry.`,
      `Your barista should add you on their family phone plan.`
    ];
    
    // Add 1-2 general facts
    const numGeneralFacts = Math.min(2 - funFacts.length, 2);
    const shuffledGeneralFacts = generalFacts.sort(() => 0.5 - Math.random());
    funFacts.push(...shuffledGeneralFacts.slice(0, numGeneralFacts));
  }

  // Generate actionable recommendations with variations
  const actionableRecommendations = [];
  
  if (isOverspending) {
    const overspendingTips = [
      "Create a monthly budget and stick to it - your future self will thank you!",
      "Track every expense for a week to identify spending leaks! 🔍",
      "Set up spending alerts on your bank account to stay aware! 📱",
      "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings! 📊"
    ];
    actionableRecommendations.push(overspendingTips[randomSeed % overspendingTips.length]);
  }
  
  if (topCategory && (topCategory.amount / totalSpending) > 0.3) {
    const categoryTips = [
      `Reduce ${topCategory.category} spending by 20% - that's $${(topCategory.amount * 0.2).toLocaleString('en-US')} saved monthly!`,
      `Cut ${topCategory.category} costs by shopping around for better deals! 🛒`,
      `Set a monthly limit for ${topCategory.category} and track it closely! 📈`,
      `Find free alternatives to some of your ${topCategory.category} expenses! 💡`
    ];
    actionableRecommendations.push(categoryTips[randomSeed % categoryTips.length]);
  }
  
  if (goals.length > 0) {
    const goalTips = [
      "Set up automatic transfers to your goal accounts - out of sight, out of mind!",
      "Review your goals monthly and adjust contributions as needed! 🎯",
      "Celebrate small milestones to stay motivated! 🎉",
      "Consider increasing your goal contributions by 1% each month! 📈"
    ];
    actionableRecommendations.push(goalTips[randomSeed % goalTips.length]);
  }
  
  const generalTips = [
    "Review your subscriptions monthly - cancel what you don't use!",
    "Use the 24-hour rule for purchases over $50 - sleep on it!",
    "Set up price alerts for items you want to buy! 🔔",
    "Try a no-spend challenge for one category this month! 🚫",
    "Use cash for discretionary spending to feel the impact! 💵",
    "Compare prices online before making any purchase! 💻",
    "Maybe cook once? Just once? Your wallet and arteries will thank you.",
    "If you walk, you save money and skip leg day.",
    "Your barista should add you on their family phone plan.",
    "Retail therapy is not tax-deductible, sorry.",
    "Maybe Venmo yourself $10 and call it 'future you fund.'",
    "Your subscriptions look like Pokémon: you're trying to catch 'em all."
  ];
  
  // Add 2-3 random general tips
  const numTips = 2 + (randomSeed % 2);
  const shuffledTips = generalTips.sort(() => 0.5 - Math.random());
  actionableRecommendations.push(...shuffledTips.slice(0, numTips));

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
