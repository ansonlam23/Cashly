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

  // Generate actionable recommendations with roast → recommendation → impact formula
  const actionableRecommendations = [];
  
  // Helper function to generate structured recommendations
  const generateStructuredRecommendation = (category: string, amount: number, categoryType: string) => {
    const recommendations: { [key: string]: any[] } = {
      'food and drink': [
        {
          roast: `You spent $${amount.toLocaleString()} on food delivery this month? You're single-handedly keeping the restaurant industry afloat.`,
          recommendation: "Try meal prepping 3 days a week instead of ordering delivery.",
          impact: `Save $${Math.round(amount * 0.4).toLocaleString()} monthly and actually know what's in your food.`
        },
        {
          roast: `At this rate, your pizza guy knows more about your budget than your bank after you spent $${amount.toLocaleString()} on food.`,
          recommendation: "Cook at home just 2 more times per week.",
          impact: `Cut your food spending by $${Math.round(amount * 0.3).toLocaleString()} monthly.`
        },
        {
          roast: `Maybe cook once? Just once? Your wallet and arteries will thank you after dropping $${amount.toLocaleString()} on takeout.`,
          recommendation: "Start with one homemade meal per week and build from there.",
          impact: `Save $${Math.round(amount * 0.2).toLocaleString()} monthly while learning a life skill.`
        }
      ],
      'transportation': [
        {
          roast: `You spent $${amount.toLocaleString()} on Uber this month? You could've just bought a used bike and a helmet… with streamers.`,
          recommendation: "Replace just 2 Uber rides per week with public transit or walking.",
          impact: `Save $${Math.round(amount * 0.4).toLocaleString()} monthly and get some exercise.`
        },
        {
          roast: `Uber surge pricing isn't an investment strategy after you dropped $${amount.toLocaleString()} on rides. Take the bus, champ.`,
          recommendation: "Use rideshare only for late nights or emergencies.",
          impact: `Reduce transportation costs by $${Math.round(amount * 0.5).toLocaleString()} monthly.`
        },
        {
          roast: `If you walk, you save money and skip leg day. Especially after spending $${amount.toLocaleString()} on transportation.`,
          recommendation: "Walk or bike for trips under 1 mile.",
          impact: `Save $${Math.round(amount * 0.3).toLocaleString()} monthly and improve your fitness.`
        }
      ],
      'shopping': [
        {
          roast: `Amazon called — they want to know if you're their silent business partner after you spent $${amount.toLocaleString()} on shopping.`,
          recommendation: "Wait 48 hours before buying anything over $25 online.",
          impact: `Reduce impulse purchases by $${Math.round(amount * 0.4).toLocaleString()} monthly.`
        },
        {
          roast: `Retail therapy is not tax-deductible, sorry. Especially after dropping $${amount.toLocaleString()} on shopping.`,
          recommendation: "Set a monthly shopping budget and stick to it.",
          impact: `Limit spending to $${Math.round(amount * 0.6).toLocaleString()} monthly and avoid buyer's remorse.`
        },
        {
          roast: `You're two sweaters away from starring in an episode of Hoarders: Student Edition after spending $${amount.toLocaleString()} on shopping.`,
          recommendation: "Buy only what you need, not what you want in the moment.",
          impact: `Cut shopping expenses by $${Math.round(amount * 0.5).toLocaleString()} monthly.`
        }
      ],
      'coffee shops': [
        {
          roast: `You spent $${amount.toLocaleString()} on Starbucks this month? That's not a latte, that's a mortgage.`,
          recommendation: "Make coffee at home 4 days a week, treat yourself 3 days.",
          impact: `Save $${Math.round(amount * 0.6).toLocaleString()} monthly and still get your caffeine fix.`
        },
        {
          roast: `Your caffeine budget has officially outpaced your textbook budget after spending $${amount.toLocaleString()} on coffee.`,
          recommendation: "Invest in a good coffee maker and bring your own cup.",
          impact: `Reduce coffee spending by $${Math.round(amount * 0.7).toLocaleString()} monthly.`
        },
        {
          roast: `At this point, your barista should add you on their family phone plan after you spent $${amount.toLocaleString()} on coffee.`,
          recommendation: "Limit coffee shop visits to 2-3 times per week maximum.",
          impact: `Save $${Math.round(amount * 0.5).toLocaleString()} monthly while maintaining the social aspect.`
        }
      ],
      'entertainment': [
        {
          roast: `Do you really need Netflix, Hulu, Disney+, and Crunchyroll after spending $${amount.toLocaleString()} on entertainment? You've built a streaming hedge fund.`,
          recommendation: "Keep only 2 streaming services and rotate them monthly.",
          impact: `Save $${Math.round(amount * 0.5).toLocaleString()} monthly and actually watch what you pay for.`
        },
        {
          roast: `Your subscriptions look like Pokémon: you're trying to catch 'em all after dropping $${amount.toLocaleString()} on entertainment.`,
          recommendation: "Audit all subscriptions and cancel what you haven't used in 30 days.",
          impact: `Eliminate $${Math.round(amount * 0.4).toLocaleString()} in monthly subscription waste.`
        },
        {
          roast: `You're subscribed to more services than you attend lectures after spending $${amount.toLocaleString()} on entertainment.`,
          recommendation: "Use free alternatives like library streaming or student discounts.",
          impact: `Cut entertainment costs by $${Math.round(amount * 0.6).toLocaleString()} monthly.`
        }
      ]
    };
    
    // Check for partial matches
    for (const [key, recList] of Object.entries(recommendations)) {
      if (categoryType.toLowerCase().includes(key) || key.includes(categoryType.toLowerCase())) {
        return recList[randomSeed % recList.length];
      }
    }
    
    // Default structured recommendation
    return {
      roast: `$${amount.toLocaleString()} on ${category}? You're basically a walking ATM for this industry.`,
      recommendation: `Reduce ${category} spending by 25% through better planning and alternatives.`,
      impact: `Save $${Math.round(amount * 0.25).toLocaleString()} monthly and redirect funds to your goals.`
    };
  };

  // Generate category-specific recommendations
  if (topCategory && (topCategory.amount / totalSpending) > 0.2) {
    const structuredRec = generateStructuredRecommendation(topCategory.category, topCategory.amount, topCategory.category);
    actionableRecommendations.push({
      roast: structuredRec.roast,
      recommendation: structuredRec.recommendation,
      impact: structuredRec.impact
    });
  }
  
  // Generate overspending recommendations
  if (isOverspending) {
    const overspendingRecs = [
      {
        roast: `You saved $0 this month — bold strategy, let's see how it plays out.`,
        recommendation: "Start by saving just $20 per week automatically.",
        impact: "Build a $1,040 emergency fund by year-end and reduce financial stress."
      },
      {
        roast: `Your bank account is flatter than your roommate's soda.`,
        recommendation: "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
        impact: `Save $${Math.round(totalIncome * 0.2).toLocaleString()} monthly and build wealth over time.`
      },
      {
        roast: `Maybe Venmo yourself $10 and call it 'future you fund.'`,
        recommendation: "Set up automatic transfers of $50 bi-weekly to a savings account.",
        impact: "Accumulate $1,300 annually without thinking about it."
      }
    ];
    actionableRecommendations.push(overspendingRecs[randomSeed % overspendingRecs.length]);
  }
  
  // Generate goal-related recommendations
  if (goals.length > 0) {
    const goalRecs = [
      {
        roast: `Your goals are collecting dust like your gym membership.`,
        recommendation: "Set up automatic weekly transfers to your goal accounts.",
        impact: `Reach your goals ${Math.round(goals[0].targetAmount / (goals[0].monthlyContribution || 100))} months faster.`
      },
      {
        roast: `Your future self called - they're not impressed with your progress.`,
        recommendation: "Increase your goal contributions by just $25 per month.",
        impact: `Add $300 annually to your goal fund and build momentum.`
      }
    ];
    actionableRecommendations.push(goalRecs[randomSeed % goalRecs.length]);
  }
  
  // Add general recommendations if we need more
  if (actionableRecommendations.length < 2) {
    const generalRecs = [
        {
          roast: `Your subscriptions look like Pokémon: you're trying to catch 'em all after spending $${(totalSpending || 0).toLocaleString()} this month.`,
          recommendation: "Cancel 2 subscriptions you haven't used in 30 days.",
          impact: "Save $20-40 monthly and simplify your life."
        },
        {
          roast: `Retail therapy is not tax-deductible, sorry. Especially after spending $${(totalSpending || 0).toLocaleString()} this month.`,
          recommendation: "Use the 24-hour rule for purchases over $50.",
          impact: "Reduce impulse spending by 60% and avoid buyer's remorse."
        },
        {
          roast: `Your barista should add you on their family phone plan after you spent $${(totalSpending || 0).toLocaleString()} this month.`,
          recommendation: "Make coffee at home 3 days a week.",
          impact: "Save $60-100 monthly and still get your caffeine fix."
        }
    ];
    
    const numGeneralRecs = Math.min(2 - actionableRecommendations.length, 2);
    const shuffledGeneralRecs = generalRecs.sort(() => 0.5 - Math.random());
    actionableRecommendations.push(...shuffledGeneralRecs.slice(0, numGeneralRecs));
  }

  return {
    spendingHighlights,
    categoryInsights,
    predictions,
    funFacts,
    actionableRecommendations
  };
}

// Generate AI-like investment insights directly without external LLM
function generateInvestmentInsightsDirectly(investmentData: any) {
  console.log("generateInvestmentInsightsDirectly called with:", investmentData);
  
  if (!investmentData) {
    throw new Error("No investment data provided");
  }
  
  const { portfolioSummary, investments } = investmentData;
  
  if (!portfolioSummary) {
    throw new Error("No portfolio summary provided");
  }
  
  if (!investments || !Array.isArray(investments)) {
    throw new Error("No investments array provided");
  }
  
  console.log("Processing investment data:", {
    portfolioSummary,
    investmentsCount: investments.length
  });
  
  // Handle case with no investments
  if (investments.length === 0) {
    return {
      portfolioHighlights: {
        bestPerformer: "No investments to analyze yet!",
        worstPerformer: "Add some stocks to get started!",
        diversificationAlert: "Time to start building your portfolio!",
        riskAssessment: "No risk yet - add some investments!"
      },
      stockInsights: [],
      portfolioAnalysis: [{
        type: "no_investments",
        message: "You don't have any investments yet - time to start building wealth!",
        actionable: "Research and add your first stock to begin your investment journey."
      }],
      funFacts: [
        "The best time to start investing was yesterday, the second best time is now! ⏰",
        "Every dollar invested today is a dollar working for your future! 💰",
        "Compound interest is the 8th wonder of the world - start early! ⚡"
      ],
      actionableRecommendations: [{
        roast: "Your portfolio is emptier than a ghost town!",
        recommendation: "Start with 3-5 blue-chip stocks from different sectors.",
        impact: "Begin building wealth and learning about investing with low-risk positions."
      }]
    };
  }
  
  // Add some randomization to make insights feel fresh each time
  const randomSeed = Date.now() % 1000;
  const randomVariations = [
    "📈", "💰", "🚀", "💎", "🔥", "⭐", "🎯", "💪", "🌟", "⚡"
  ];
  const randomEmoji = randomVariations[randomSeed % randomVariations.length];

  // Calculate key metrics
  const totalValue = portfolioSummary.totalValue || 0;
  const totalGainLoss = portfolioSummary.totalGainLoss || 0;
  const totalGainLossPercent = portfolioSummary.totalGainLossPercent || 0;
  const dayChange = portfolioSummary.dayChange || 0;
  const investmentCount = portfolioSummary.investmentCount || 0;

  // Find best and worst performers
  const sortedInvestments = investments.length > 0 ? [...investments].sort((a, b) => (b.totalGainLossPercent || 0) - (a.totalGainLossPercent || 0)) : [];
  const bestPerformer = sortedInvestments[0] || null;
  const worstPerformer = sortedInvestments[sortedInvestments.length - 1] || null;

  // Calculate diversification metrics
  const totalInvested = investments.length > 0 ? investments.reduce((sum: number, inv: any) => sum + (inv.shares * inv.averageCost), 0) : 0;
  const largestHolding = investments.length > 0 ? investments.reduce((max: any, inv: any) => 
    inv.totalValue > max.totalValue ? inv : max, investments[0]
  ) : { totalValue: 0, symbol: 'N/A' };
  const largestHoldingPercent = totalValue > 0 ? (largestHolding.totalValue / totalValue) * 100 : 0;

  // Generate portfolio highlights with variations
  const getBestPerformerMessage = (investment: any) => {
    if (!investment) return "No investments to analyze yet!";
    
    const gainLoss = investment.totalGainLoss || 0;
    const gainLossPercent = investment.totalGainLossPercent || 0;
    
    const messages = [
      `${investment.symbol} is your star performer with ${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(1)}% returns! ${randomEmoji}`,
      `${investment.symbol} is crushing it with ${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(1)}% gains - keep holding! 💪`,
      `Your ${investment.symbol} position is up ${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(1)}% - that's some serious alpha! 🚀`,
      `${investment.symbol} is your portfolio's MVP with ${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(1)}% performance! ⭐`
    ];
    return messages[randomSeed % messages.length];
  };

  const getWorstPerformerMessage = (investment: any) => {
    if (!investment) return "No investments to analyze yet!";
    
    const gainLoss = investment.totalGainLoss || 0;
    const gainLossPercent = investment.totalGainLossPercent || 0;
    
    const messages = [
      `${investment.symbol} is having a rough time with ${gainLossPercent.toFixed(1)}% returns. Time to review? 🤔`,
      `${investment.symbol} is down ${Math.abs(gainLossPercent).toFixed(1)}% - maybe it's time to cut losses or average down? 📉`,
      `Your ${investment.symbol} position is struggling at ${gainLossPercent.toFixed(1)}% - consider your strategy! 💭`,
      `${investment.symbol} is underperforming with ${gainLossPercent.toFixed(1)}% returns - time for a portfolio review! 🔍`
    ];
    return messages[randomSeed % messages.length];
  };

  const getDiversificationMessage = () => {
    if (investmentCount === 0) return "No investments to diversify yet!";
    if (investmentCount === 1) return "You have only one stock - time to diversify! 🎯";
    if (largestHoldingPercent > 50) return `Your ${largestHolding.symbol} position is ${largestHoldingPercent.toFixed(1)}% of your portfolio - consider rebalancing! ⚖️`;
    if (largestHoldingPercent > 30) return `Your ${largestHolding.symbol} holding is ${largestHoldingPercent.toFixed(1)}% of your portfolio - good diversification! 👍`;
    return `Great diversification with ${investmentCount} holdings! Your largest position is only ${largestHoldingPercent.toFixed(1)}%! 🎉`;
  };

  const getRiskAssessment = () => {
    if (investmentCount === 0) return "No risk yet - add some investments!";
    
    const highVolatilityStocks = investments.length > 0 ? investments.filter((inv: any) => Math.abs(inv.dayChangePercent || 0) > 5).length : 0;
    const totalVolatility = investments.length > 0 ? investments.reduce((sum: number, inv: any) => sum + Math.abs(inv.dayChangePercent || 0), 0) / investmentCount : 0;
    
    if (highVolatilityStocks > investmentCount * 0.5) {
      return `High risk portfolio with ${highVolatilityStocks} volatile stocks - consider some stable blue chips! ⚠️`;
    } else if (totalVolatility > 3) {
      return `Moderate risk with ${totalVolatility.toFixed(1)}% average daily volatility - well balanced! ⚖️`;
    } else {
      return `Conservative portfolio with ${totalVolatility.toFixed(1)}% average volatility - steady and safe! 🛡️`;
    }
  };

  const portfolioHighlights = {
    bestPerformer: getBestPerformerMessage(bestPerformer),
    worstPerformer: getWorstPerformerMessage(worstPerformer),
    diversificationAlert: getDiversificationMessage(),
    riskAssessment: getRiskAssessment()
  };

  // Generate stock insights
  const stockInsights = investments.length > 0 ? investments.slice(0, 5).map((investment: any, index: number) => {
    const gainLoss = investment.totalGainLoss || 0;
    const gainLossPercent = investment.totalGainLossPercent || 0;
    const dayChangePercent = investment.dayChangePercent || 0;
    
    const getInsight = (inv: any) => {
      if (gainLossPercent > 20) return `${inv.symbol} is absolutely crushing it with ${gainLossPercent.toFixed(1)}% gains!`;
      if (gainLossPercent > 10) return `${inv.symbol} is performing well with solid ${gainLossPercent.toFixed(1)}% returns.`;
      if (gainLossPercent > 0) return `${inv.symbol} is in the green with ${gainLossPercent.toFixed(1)}% gains.`;
      if (gainLossPercent > -10) return `${inv.symbol} is slightly down but holding steady.`;
      return `${inv.symbol} is having a tough time with ${gainLossPercent.toFixed(1)}% losses.`;
    };

    const getSuggestion = (inv: any) => {
      if (gainLossPercent > 20) return "Consider taking some profits or setting stop-loss orders to protect gains.";
      if (gainLossPercent > 5) return "Strong performance! Consider if you want to add more or take some profits.";
      if (gainLossPercent > 0) return "Positive momentum - monitor for continued strength.";
      if (gainLossPercent > -10) return "Minor dip - could be a buying opportunity if fundamentals are strong.";
      return "Significant decline - review your investment thesis and consider cutting losses.";
    };

    const getPerformance = (inv: any) => {
      const dayChange = inv.dayChangePercent || 0;
      if (dayChange > 5) return `🔥 Hot today: +${dayChange.toFixed(1)}%`;
      if (dayChange > 0) return `📈 Up today: +${dayChange.toFixed(1)}%`;
      if (dayChange > -5) return `📊 Flat today: ${dayChange.toFixed(1)}%`;
      return `📉 Down today: ${dayChange.toFixed(1)}%`;
    };

    return {
      symbol: investment.symbol,
      insight: getInsight(investment),
      suggestion: getSuggestion(investment),
      performance: getPerformance(investment)
    };
  }) : [];

  // Generate portfolio analysis
  const portfolioAnalysis = [];
  
  // Overall performance analysis
  if (totalGainLossPercent > 20) {
    portfolioAnalysis.push({
      type: "excellent_performance",
      message: `Your portfolio is absolutely crushing it with ${totalGainLossPercent.toFixed(1)}% returns! 🚀`,
      actionable: "Consider rebalancing to lock in some gains and maintain diversification."
    });
  } else if (totalGainLossPercent > 10) {
    portfolioAnalysis.push({
      type: "strong_performance",
      message: `Strong portfolio performance with ${totalGainLossPercent.toFixed(1)}% gains! 💪`,
      actionable: "Keep up the good work and consider adding to your winners."
    });
  } else if (totalGainLossPercent > 0) {
    portfolioAnalysis.push({
      type: "positive_performance",
      message: `Your portfolio is in positive territory with ${totalGainLossPercent.toFixed(1)}% gains.`,
      actionable: "Focus on consistent performance and consider dollar-cost averaging."
    });
  } else if (totalGainLossPercent > -10) {
    portfolioAnalysis.push({
      type: "minor_losses",
      message: `Minor portfolio decline of ${Math.abs(totalGainLossPercent).toFixed(1)}% - stay the course!`,
      actionable: "Review your holdings and consider if this is a buying opportunity."
    });
  } else {
    portfolioAnalysis.push({
      type: "significant_losses",
      message: `Portfolio is down ${Math.abs(totalGainLossPercent).toFixed(1)}% - time for a strategy review!`,
      actionable: "Consider rebalancing, cutting losses, or reviewing your investment thesis."
    });
  }

  // Diversification analysis
  if (investmentCount < 3) {
    portfolioAnalysis.push({
      type: "low_diversification",
      message: `You only have ${investmentCount} stock${investmentCount !== 1 ? 's' : ''} - diversification is key to reducing risk!`,
      actionable: "Consider adding 3-5 more stocks from different sectors to improve diversification."
    });
  } else if (largestHoldingPercent > 40) {
    portfolioAnalysis.push({
      type: "concentration_risk",
      message: `Your ${largestHolding.symbol} position is ${largestHoldingPercent.toFixed(1)}% of your portfolio - that's concentration risk!`,
      actionable: "Consider reducing this position to under 30% and spreading the money across other stocks."
    });
  } else {
    portfolioAnalysis.push({
      type: "good_diversification",
      message: `Great diversification with ${investmentCount} holdings and your largest position at ${largestHoldingPercent.toFixed(1)}%!`,
      actionable: "Maintain this balanced approach and consider adding more positions over time."
    });
  }

  // Generate fun facts
  const funFacts = [];
  
  if (bestPerformer && bestPerformer.totalGainLoss && !isNaN(bestPerformer.totalGainLoss)) {
    const bestGain = bestPerformer.totalGainLoss;
    const bestSymbol = bestPerformer.symbol || 'Unknown';
    const bestFacts = [
      `Your ${bestSymbol} position made you $${bestGain.toLocaleString()} - that's like finding money in your couch! 💰`,
      `${bestSymbol} is your money-making machine with $${bestGain.toLocaleString()} in gains! 🚀`,
      `$${bestGain.toLocaleString()} from ${bestSymbol}? You're basically a stock market wizard! 🧙‍♂️`,
      `Your ${bestSymbol} gains of $${bestGain.toLocaleString()} could buy a nice vacation! ✈️`
    ];
    funFacts.push(bestFacts[randomSeed % bestFacts.length]);
  }
  
  if (totalValue > 0 && !isNaN(totalValue)) {
    const dailyAverage = totalValue / 30;
    const dailyFacts = [
      `Your portfolio is worth $${totalValue.toLocaleString()} - that's $${dailyAverage.toLocaleString()} per day of the month! 📊`,
      `$${totalValue.toLocaleString()} portfolio value? You're building serious wealth! 💎`,
      `Your $${totalValue.toLocaleString()} portfolio could buy ${Math.round(totalValue / 50000)} luxury cars! 🚗`,
      `$${totalValue.toLocaleString()} in investments? Your future self is going to thank you! 🙏`
    ];
    funFacts.push(dailyFacts[randomSeed % dailyFacts.length]);
  }
  
  if (investmentCount > 0 && totalValue > 0 && !isNaN(totalValue)) {
    const avgValuePerStock = totalValue / investmentCount;
    const stockFacts = [
      `You have ${investmentCount} stock${investmentCount !== 1 ? 's' : ''} worth an average of $${avgValuePerStock.toLocaleString()} each! 📈`,
      `${investmentCount} different stocks? You're more diversified than a mutual fund! 🎯`,
      `Your ${investmentCount} holdings average $${avgValuePerStock.toLocaleString()} each - that's some serious positions! 💪`,
      `$${avgValuePerStock.toLocaleString()} per stock across ${investmentCount} holdings? You're building a mini empire! 👑`
    ];
    funFacts.push(stockFacts[randomSeed % stockFacts.length]);
  }

  // Add some general investment fun facts if we don't have enough
  if (funFacts.length < 2) {
    const generalFacts = [
      "The stock market has historically returned about 10% annually - you're on the right track! 📈",
      "Compound interest is the 8th wonder of the world - keep investing! ⚡",
      "Time in the market beats timing the market - consistency is key! ⏰",
      "Every dollar invested today is a dollar working for your future! 💰",
      "Diversification is the only free lunch in investing! 🍽️",
      "Your portfolio is like a garden - it needs time to grow! 🌱"
    ];
    
    const numGeneralFacts = Math.min(2 - funFacts.length, 2);
    const shuffledGeneralFacts = generalFacts.sort(() => 0.5 - Math.random());
    funFacts.push(...shuffledGeneralFacts.slice(0, numGeneralFacts));
  }

  // Generate actionable recommendations with roast → recommendation → impact formula
  const actionableRecommendations = [];
  
  // Helper function to generate structured investment recommendations
  const generateInvestmentRecommendation = (type: string, data: any) => {
    const recommendations: { [key: string]: any[] } = {
      'concentration_risk': [
        {
          roast: `Your ${data.symbol || 'Unknown'} position is ${(data.percent || 0).toFixed(1)}% of your portfolio? You're putting all your eggs in one basket!`,
          recommendation: "Reduce this position to under 30% and spread the money across 3-5 other stocks.",
          impact: `Reduce concentration risk by ${((data.percent || 0) - 30).toFixed(1)}% and improve portfolio stability.`
        },
        {
          roast: `$${(data.value || 0).toLocaleString()} in just ${data.symbol || 'Unknown'}? That's not diversification, that's gambling!`,
          recommendation: "Sell 40% of this position and invest in different sectors.",
          impact: `Diversify $${((data.value || 0) * 0.4).toLocaleString()} across multiple stocks to reduce risk.`
        }
      ],
      'low_diversification': [
        {
          roast: `Only ${data.count} stock${data.count !== 1 ? 's' : ''}? You're not diversified, you're just hoping!`,
          recommendation: "Add 3-5 more stocks from different sectors (tech, healthcare, finance, consumer).",
          impact: "Reduce portfolio risk by 40-60% and improve long-term stability."
        },
        {
          roast: `Your portfolio looks like a one-trick pony with just ${data.count} holding${data.count !== 1 ? 's' : ''}!`,
          recommendation: "Research and add stocks from at least 3 different sectors.",
          impact: "Create a more balanced portfolio that can weather market volatility."
        }
      ],
      'underperforming': [
        {
          roast: `${data.symbol || 'Unknown'} is down ${Math.abs(data.percent || 0).toFixed(1)}%? Time to cut your losses or your losses will cut you!`,
          recommendation: "Set a stop-loss at 15% below your average cost and stick to it.",
          impact: `Limit potential losses to $${((data.value || 0) * 0.15).toLocaleString()} and preserve capital.`
        },
        {
          roast: `Your ${data.symbol || 'Unknown'} position is bleeding money with ${(data.percent || 0).toFixed(1)}% losses!`,
          recommendation: "Review your investment thesis - if nothing has changed, consider selling.",
          impact: "Stop the bleeding and redeploy capital into better opportunities."
        }
      ],
      'overperforming': [
        {
          roast: `${data.symbol || 'Unknown'} is up ${(data.percent || 0).toFixed(1)}%? Don't get greedy - take some profits!`,
          recommendation: "Sell 25% of your position to lock in gains and reduce risk.",
          impact: `Secure $${((data.gains || 0) * 0.25).toLocaleString()} in profits while keeping upside exposure.`
        },
        {
          roast: `$${(data.gains || 0).toLocaleString()} in gains from ${data.symbol || 'Unknown'}? Time to rebalance before it becomes too big!`,
          recommendation: "Take profits on 30% of the position and reinvest in other opportunities.",
          impact: `Lock in $${((data.gains || 0) * 0.3).toLocaleString()} while maintaining growth potential.`
        }
      ]
    };
    
    return recommendations[type]?.[randomSeed % (recommendations[type]?.length || 1)] || {
      roast: "Your portfolio needs some attention!",
      recommendation: "Review your holdings and consider rebalancing.",
      impact: "Improve your overall investment strategy and risk management."
    };
  };

  // Generate concentration risk recommendations
  if (largestHoldingPercent > 40) {
    const rec = generateInvestmentRecommendation('concentration_risk', {
      symbol: largestHolding.symbol,
      percent: largestHoldingPercent,
      value: largestHolding.totalValue
    });
    actionableRecommendations.push(rec);
  }
  
  // Generate diversification recommendations
  if (investmentCount < 3) {
    const rec = generateInvestmentRecommendation('low_diversification', {
      count: investmentCount
    });
    actionableRecommendations.push(rec);
  }
  
  // Generate performance-based recommendations
  if (worstPerformer && worstPerformer.totalGainLossPercent < -15) {
    const rec = generateInvestmentRecommendation('underperforming', {
      symbol: worstPerformer.symbol,
      percent: worstPerformer.totalGainLossPercent,
      value: worstPerformer.totalValue
    });
    actionableRecommendations.push(rec);
  }
  
  if (bestPerformer && bestPerformer.totalGainLossPercent > 25) {
    const rec = generateInvestmentRecommendation('overperforming', {
      symbol: bestPerformer.symbol,
      percent: bestPerformer.totalGainLossPercent,
      gains: bestPerformer.totalGainLoss
    });
    actionableRecommendations.push(rec);
  }
  
  // Add general investment recommendations if we need more
  if (actionableRecommendations.length < 2) {
    const generalRecs = [
      {
        roast: "Your portfolio is like a ship without a rudder - you need a strategy!",
        recommendation: "Set clear investment goals and create a written investment plan.",
        impact: "Improve decision-making and reduce emotional investing mistakes."
      },
      {
        roast: "You're probably checking your portfolio 10 times a day - that's not investing, that's gambling!",
        recommendation: "Check your portfolio once a week maximum and focus on long-term trends.",
        impact: "Reduce stress and make better long-term investment decisions."
      },
      {
        roast: "Your portfolio is all over the place - you need some structure!",
        recommendation: "Create target allocation percentages for different sectors and rebalance quarterly.",
        impact: "Maintain consistent risk levels and improve portfolio performance over time."
      }
    ];
    
    const numGeneralRecs = Math.min(2 - actionableRecommendations.length, 2);
    const shuffledGeneralRecs = generalRecs.sort(() => 0.5 - Math.random());
    actionableRecommendations.push(...shuffledGeneralRecs.slice(0, numGeneralRecs));
  }

  return {
    portfolioHighlights,
    stockInsights,
    portfolioAnalysis,
    funFacts,
    actionableRecommendations
  };
}

export const generateInvestmentInsights = action({
  args: {
    portfolioSummary: v.any(),
    investments: v.array(v.any())
  },
  handler: async (ctx, args) => {
    try {
      console.log("Generating investment insights with data:", {
        portfolioSummary: args.portfolioSummary,
        investmentsCount: args.investments?.length || 0
      });
      
      // Try to use Llama service first, fallback to direct generation
      try {
        const response: any = await fetch('http://localhost:5001/generate-investment-insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(args),
        });

        if (response.ok) {
          const result: any = await response.json();
          if (result.success && result.insights) {
            console.log("Successfully generated investment insights using Llama");
            return result.insights;
          }
        }
        
        console.log("Llama service unavailable for investments, falling back to direct generation");
      } catch (llamaError) {
        console.log("Llama service error for investments, falling back to direct generation:", llamaError);
      }
      
      const insights = generateInvestmentInsightsDirectly(args);
      console.log("Successfully generated investment insights");
      return insights;
    } catch (error) {
      console.error("Error generating investment insights:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        args: args
      });
      throw new Error(`Failed to generate investment insights: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

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
      ]: [any, any, any, any, any, any] = await Promise.all([
        ctx.runQuery(api.transactions.getSpendingByCategory),
        ctx.runQuery(api.transactions.getIncomeVsSpending),
        ctx.runQuery(api.transactions.getTopMerchants, { limit: 5 }),
        ctx.runQuery(api.transactions.getMonthlySpendingTrend, { months: 6 }),
        ctx.runQuery(api.transactions.getCurrentBalance),
        ctx.runQuery(api.goals.getActiveGoals)
      ]);

      // Prepare data for AI
      const financialData: any = {
        totalIncome: incomeVsSpending?.totalIncome || 0,
        totalSpending: incomeVsSpending?.totalSpending || 0,
        netFlow: currentBalance?.netFlow || 0,
        currentBalance: currentBalance?.currentBalance || 0,
        spendingByCategory: spendingByCategory || [],
        topMerchants: topMerchants || [],
        monthlyTrend: monthlyTrend || [],
        goals: userGoals || []
      };

      // Try to use Llama service first, fallback to direct generation
      try {
        const response: any = await fetch('http://localhost:5001/generate-insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(financialData),
        });

        if (response.ok) {
          const result: any = await response.json();
          if (result.success && result.insights) {
            console.log("Successfully generated insights using Llama");
            return result.insights;
          }
        }
        
        console.log("Llama service unavailable, falling back to direct generation");
      } catch (llamaError) {
        console.log("Llama service error, falling back to direct generation:", llamaError);
      }

      // Fallback to direct generation
      const insights = generateInsightsDirectly(financialData);
      return insights;

    } catch (error) {
      console.error('Error generating AI insights:', error);
      throw new Error(`Failed to generate AI insights: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// API import moved to top of file
