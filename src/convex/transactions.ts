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

    // Fill in missing weeks with 0
    const result = [];
    for (let i = 0; i < weeks; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (i * 7));
      const weekKey = weekStart.toISOString().split('T')[0];
      const amount = weeklyTotals.get(weekKey) || 0;
      
      result.push({
        period: weekKey,
        amount,
        label: `Week ${i + 1}`
      });
    }

    return result;
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
