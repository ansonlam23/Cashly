import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getTransactionsByUser = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit || 100);

    return transactions;
  },
});

export const getTransactionsByCategory = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    if (args.category) {
      return await ctx.db
        .query("transactions")
        .withIndex("by_user_and_category", (q) => 
          q.eq("userId", user._id).eq("category", args.category!)
        )
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getSpendingByCategory = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.lt(q.field("amount"), 0)) // Only debits
      .collect();

    const categoryTotals = new Map<string, number>();
    
    for (const transaction of transactions) {
      const current = categoryTotals.get(transaction.category) || 0;
      categoryTotals.set(transaction.category, current + Math.abs(transaction.amount));
    }

    return Array.from(categoryTotals.entries()).map(([category, amount]) => ({
      category,
      amount,
    })).sort((a, b) => b.amount - a.amount);
  },
});

export const getMonthlySpendingTrend = query({
  args: { months: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.lt(q.field("amount"), 0)) // Only debits
      .collect();

    const monthlyTotals = new Map<string, number>();
    
    for (const transaction of transactions) {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      const current = monthlyTotals.get(month) || 0;
      monthlyTotals.set(month, current + Math.abs(transaction.amount));
    }

    return Array.from(monthlyTotals.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-(args.months || 12));
  },
});

export const getIncomeVsSpending = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { totalIncome: 0, totalSpending: 0 };

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let totalIncome = 0;
    let totalSpending = 0;

    for (const transaction of transactions) {
      if (transaction.amount > 0) {
        // Positive amounts are income
        totalIncome += transaction.amount;
      } else {
        // Negative amounts are spending
        totalSpending += Math.abs(transaction.amount);
      }
    }

    return { totalIncome, totalSpending };
  },
});

export const getTopMerchants = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.lt(q.field("amount"), 0)) // Only spending transactions
      .collect();

    const merchantMap = new Map<string, { amount: number; count: number; category: string }>();

    for (const transaction of transactions) {
      const merchant = transaction.merchant || transaction.description;
      const amount = Math.abs(transaction.amount);
      
      if (merchantMap.has(merchant)) {
        const existing = merchantMap.get(merchant)!;
        existing.amount += amount;
        existing.count += 1;
      } else {
        merchantMap.set(merchant, {
          amount,
          count: 1,
          category: transaction.category
        });
      }
    }

    return Array.from(merchantMap.entries())
      .map(([merchant, data]) => ({
        merchant,
        amount: data.amount,
        transactionCount: data.count,
        category: data.category
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, args.limit || 10);
  },
});

export const getDailySpendingTrend = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const days = args.days || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.lt(q.field("amount"), 0)) // Only spending transactions
      .collect();

    const dailyTotals = new Map<string, number>();
    
    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= startDate && transactionDate <= endDate) {
        const dayKey = transaction.date;
        const current = dailyTotals.get(dayKey) || 0;
        dailyTotals.set(dayKey, current + Math.abs(transaction.amount));
      }
    }

    // Fill in missing days with 0
    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayKey = date.toISOString().split('T')[0];
      const amount = dailyTotals.get(dayKey) || 0;
      
      result.push({
        period: dayKey,
        amount,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }

    return result;
  },
});

export const getWeeklySpendingTrend = query({
  args: { weeks: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const weeks = args.weeks || 12;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (weeks * 7));

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.lt(q.field("amount"), 0)) // Only spending transactions
      .collect();

    const weeklyTotals = new Map<string, number>();
    
    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= startDate && transactionDate <= endDate) {
        // Get the start of the week (Monday)
        const weekStart = new Date(transactionDate);
        const dayOfWeek = transactionDate.getDay();
        const diff = transactionDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        weekStart.setDate(diff);
        
        const weekKey = weekStart.toISOString().split('T')[0];
        const current = weeklyTotals.get(weekKey) || 0;
        weeklyTotals.set(weekKey, current + Math.abs(transaction.amount));
      }
    }

    // Generate weekly data points
    const result = [];
    const currentWeekStart = new Date();
    const dayOfWeek = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);
    
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(currentWeekStart.getDate() - (i * 7));
      const weekKey = weekStart.toISOString().split('T')[0];
      const amount = weeklyTotals.get(weekKey) || 0;
      
      // Create a more readable label
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const label = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      
      result.unshift({
        period: weekKey,
        amount,
        label
      });
    }

    return result;
  },
});

export const getCategoryTrends = query({
  args: { months: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const months = args.months || 6;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.lt(q.field("amount"), 0)) // Only spending transactions
      .collect();

    const categoryTrends = new Map<string, Map<string, number>>();
    
    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= startDate && transactionDate <= endDate) {
        const monthKey = transactionDate.toISOString().substring(0, 7); // YYYY-MM
        const category = transaction.category;
        
        if (!categoryTrends.has(category)) {
          categoryTrends.set(category, new Map());
        }
        
        const categoryData = categoryTrends.get(category)!;
        const current = categoryData.get(monthKey) || 0;
        categoryData.set(monthKey, current + Math.abs(transaction.amount));
      }
    }

    // Generate trend data for each category
    const result = [];
    for (const [category, monthlyData] of categoryTrends.entries()) {
      const trendData = [];
      for (let i = 0; i < months; i++) {
        const date = new Date(endDate);
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().substring(0, 7);
        const amount = monthlyData.get(monthKey) || 0;
        
        trendData.unshift({
          period: monthKey,
          amount,
          label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        });
      }
      
      // Calculate growth rate
      const firstMonth = trendData[0]?.amount || 0;
      const lastMonth = trendData[trendData.length - 1]?.amount || 0;
      const growthRate = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
      
      result.push({
        category,
        data: trendData,
        growthRate,
        totalSpent: trendData.reduce((sum, item) => sum + item.amount, 0)
      });
    }

    return result.sort((a, b) => b.totalSpent - a.totalSpent);
  },
});

export const getRecurringExpenses = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.lt(q.field("amount"), 0)) // Only spending transactions
      .collect();

    const merchantFrequency = new Map<string, { count: number; totalAmount: number; lastTransaction: string; transactions: any[] }>();
    
    for (const transaction of transactions) {
      const merchant = transaction.merchant || transaction.description;
      if (merchantFrequency.has(merchant)) {
        const data = merchantFrequency.get(merchant)!;
        data.count += 1;
        data.totalAmount += Math.abs(transaction.amount);
        data.transactions.push(transaction);
        if (transaction.date > data.lastTransaction) {
          data.lastTransaction = transaction.date;
        }
      } else {
        merchantFrequency.set(merchant, {
          count: 1,
          totalAmount: Math.abs(transaction.amount),
          lastTransaction: transaction.date,
          transactions: [transaction]
        });
      }
    }

    // Find recurring expenses (3+ transactions)
    const recurring = Array.from(merchantFrequency.entries())
      .filter(([_, data]) => data.count >= 3)
      .map(([merchant, data]) => ({
        merchant,
        frequency: data.count,
        totalAmount: data.totalAmount,
        averageAmount: data.totalAmount / data.count,
        lastTransaction: data.lastTransaction,
        category: data.transactions[0]?.category || "Other",
        isSubscription: data.count >= 6 && data.transactions.every(t => 
          Math.abs(t.amount - data.transactions[0].amount) < 5 // Similar amounts
        )
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return recurring;
  },
});

export const getSpendingForecast = query({
  args: { months: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { forecast: [], insights: [] };

    const months = args.months || 6;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 3); // Use last 3 months for prediction

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.lt(q.field("amount"), 0)) // Only spending transactions
      .collect();

    const monthlyTotals = new Map<string, number>();
    
    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= startDate && transactionDate <= endDate) {
        const monthKey = transactionDate.toISOString().substring(0, 7);
        const current = monthlyTotals.get(monthKey) || 0;
        monthlyTotals.set(monthKey, current + Math.abs(transaction.amount));
      }
    }

    // Calculate average monthly spending
    const monthlyAmounts = Array.from(monthlyTotals.values());
    const averageMonthly = monthlyAmounts.length > 0 
      ? monthlyAmounts.reduce((sum, amount) => sum + amount, 0) / monthlyAmounts.length 
      : 0;

    // Generate forecast
    const forecast = [];
    for (let i = 1; i <= months; i++) {
      const forecastDate = new Date(endDate);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      const monthKey = forecastDate.toISOString().substring(0, 7);
      
      forecast.push({
        period: monthKey,
        predictedAmount: averageMonthly,
        label: forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
    }

    // Generate insights
    const insights = [];
    if (averageMonthly > 0) {
      const yearlyProjection = averageMonthly * 12;
      insights.push({
        type: "yearly_projection",
        message: `At current spending rate, you'll spend $${yearlyProjection.toLocaleString()} this year`,
        amount: yearlyProjection
      });

      const topCategory = await ctx.db
        .query("transactions")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.lt(q.field("amount"), 0))
        .collect();

      const categoryTotals = new Map<string, number>();
      for (const transaction of topCategory) {
        const category = transaction.category;
        const current = categoryTotals.get(category) || 0;
        categoryTotals.set(category, current + Math.abs(transaction.amount));
      }

      const topCategoryEntry = Array.from(categoryTotals.entries())
        .sort((a, b) => b[1] - a[1])[0];

      if (topCategoryEntry) {
        const [category, amount] = topCategoryEntry;
        const percentage = (amount / Array.from(categoryTotals.values()).reduce((sum, val) => sum + val, 0)) * 100;
        insights.push({
          type: "top_category",
          message: `${category} is your #1 expense (${percentage.toFixed(1)}%)`,
          category,
          percentage
        });
      }
    }

    return { forecast, insights };
  },
});

export const getCurrentBalance = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { currentBalance: 0, totalIncome: 0, totalSpending: 0, netFlow: 0 };

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let totalIncome = 0;
    let totalSpending = 0;

    for (const transaction of transactions) {
      if (transaction.amount > 0) {
        totalIncome += transaction.amount;
      } else {
        totalSpending += Math.abs(transaction.amount);
      }
    }

    const netFlow = totalIncome - totalSpending;
    const currentBalance = netFlow; // Assuming starting balance is 0

    return {
      currentBalance,
      totalIncome,
      totalSpending,
      netFlow
    };
  },
});

export const addTransaction = mutation({
  args: {
    statementId: v.id("bankStatements"),
    date: v.string(),
    description: v.string(),
    amount: v.number(),
    category: v.string(),
    merchant: v.optional(v.string()),
    transactionType: v.union(v.literal("debit"), v.literal("credit")),
    balance: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("transactions", {
      userId: user._id,
      ...args,
    });
  },
});

export const addManualTransaction = mutation({
  args: {
    date: v.string(),
    description: v.string(),
    amount: v.number(),
    category: v.string(),
    merchant: v.optional(v.string()),
    transactionType: v.union(v.literal("debit"), v.literal("credit")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("transactions", {
      userId: user._id,
      ...args,
    });
  },
});

export const deleteTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Verify the transaction belongs to the user
    const transaction = await ctx.db.get(args.id);
    if (!transaction || transaction.userId !== user._id) {
      throw new Error("Transaction not found or not authorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const clearAllTransactions = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Get all transactions for the user
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Delete all transactions
    const deletePromises = transactions.map(transaction => 
      ctx.db.delete(transaction._id)
    );

    await Promise.all(deletePromises);

    return { 
      success: true, 
      deletedCount: transactions.length,
      message: `Successfully deleted ${transactions.length} transactions`
    };
  },
});
