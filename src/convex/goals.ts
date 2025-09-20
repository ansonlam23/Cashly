import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getUserGoals = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("financialGoals")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getActiveGoals = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("financialGoals")
      .withIndex("by_user_and_active", (q) => q.eq("userId", user._id).eq("isActive", true))
      .collect();
  },
});

export const createGoal = mutation({
  args: {
    goalType: v.union(
      v.literal("house"),
      v.literal("car"),
      v.literal("emergency"),
      v.literal("investment"),
      v.literal("general")
    ),
    targetAmount: v.number(),
    currentAmount: v.optional(v.number()),
    targetDate: v.string(),
    monthlyContribution: v.optional(v.number()),
    riskTolerance: v.union(
      v.literal("conservative"),
      v.literal("moderate"),
      v.literal("aggressive"),
      v.literal("very_aggressive"),
      v.literal("ultra_aggressive")
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("financialGoals", {
      userId: user._id,
      isActive: true,
      currentAmount: 0,
      ...args,
    });
  },
});

export const updateGoal = mutation({
  args: {
    goalId: v.id("financialGoals"),
    updates: v.object({
      targetAmount: v.optional(v.number()),
      currentAmount: v.optional(v.number()),
      targetDate: v.optional(v.string()),
      monthlyContribution: v.optional(v.number()),
      riskTolerance: v.optional(v.union(
        v.literal("conservative"),
        v.literal("moderate"),
        v.literal("aggressive"),
        v.literal("very_aggressive"),
        v.literal("ultra_aggressive")
      )),
      isActive: v.optional(v.boolean()),
      description: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.patch(args.goalId, args.updates);
  },
});
