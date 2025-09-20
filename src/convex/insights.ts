import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getUserInsights = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("insights")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit || 20);
  },
});

export const getUnreadInsights = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("insights")
      .withIndex("by_user_and_read", (q) => q.eq("userId", user._id).eq("isRead", false))
      .collect();
  },
});

export const createInsight = mutation({
  args: {
    type: v.union(
      v.literal("spending_pattern"),
      v.literal("budget_recommendation"),
      v.literal("investment_advice"),
      v.literal("humorous_roast"),
      v.literal("goal_progress")
    ),
    title: v.string(),
    content: v.string(),
    severity: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("critical"),
      v.literal("positive")
    ),
    relatedCategory: v.optional(v.string()),
    actionable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("insights", {
      userId: user._id,
      isRead: false,
      actionable: false,
      ...args,
    });
  },
});

export const markInsightAsRead = mutation({
  args: { insightId: v.id("insights") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.patch(args.insightId, { isRead: true });
  },
});
