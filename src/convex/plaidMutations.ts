import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Save Plaid item to database
export const savePlaidItem = mutation({
  args: { accessToken: v.string(), itemId: v.string(), institutionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("plaidItems", {
      userId: user._id,
      itemId: args.itemId,
      accessToken: args.accessToken,
      institutionId: args.institutionId,
      createdAt: Date.now(),
    });
  },
});

// Save transactions to database
export const saveTransactions = mutation({
  args: {
    transactions: v.array(
      v.object({
        transaction_id: v.string(),
        date: v.string(),
        name: v.string(),
        amount: v.number(),
        category: v.optional(v.array(v.string())),
        merchant_name: v.optional(v.string()),
        account_id: v.string(),
      })
    ),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const storedTransactions: string[] = [];

    for (const t of args.transactions) {
      const existing = await ctx.db
        .query("transactions")
        .withIndex("by_plaid_id", (q: any) => q.eq("plaidTransactionId", t.transaction_id))
        .first();

      if (!existing) {
        const id = await ctx.db.insert("transactions", {
          userId: args.userId as any,
          plaidTransactionId: t.transaction_id,
          date: t.date,
          description: t.name,
          amount: -t.amount,
          category: t.category?.[0] || "Other",
          merchant: t.merchant_name || t.name,
          transactionType: t.amount > 0 ? "credit" : "debit",
          balance: undefined,
          accountId: t.account_id,
          statementId: undefined as any,
        });

        storedTransactions.push(id);
      }
    }

    return { success: true, transactionsCount: storedTransactions.length, totalTransactions: args.transactions.length };
  },
});

// Remove Plaid item from DB
export const removePlaidItemFromDb = mutation({
  args: { itemId: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const item = await ctx.db
      .query("plaidItems")
      .withIndex("by_item_id", (q: any) => q.eq("itemId", args.itemId))
      .first();

    if (!item || item.userId !== user._id) throw new Error("Plaid item not found");

    await ctx.db.delete(item._id);
    return { success: true };
  },
});
