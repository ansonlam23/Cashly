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
