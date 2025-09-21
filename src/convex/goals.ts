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
      .order("desc")
      .collect();
  },
});

export const getGoalsByCategory = query({
  args: { category: v.union(v.literal("short_term"), v.literal("medium_term"), v.literal("long_term")) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("financialGoals")
      .withIndex("by_user_and_category", (q) => q.eq("userId", user._id).eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

export const getGoalsByPriority = query({
  args: { priority: v.union(v.literal("urgent"), v.literal("fun"), v.literal("dream")) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("financialGoals")
      .withIndex("by_user_and_priority", (q) => q.eq("userId", user._id).eq("priority", args.priority))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

export const createGoal = mutation({
  args: {
    title: v.string(),
    goalType: v.union(
      v.literal("emergency"),
      v.literal("discretionary"),
      v.literal("investment"),
      v.literal("laptop"),
      v.literal("bike"),
      v.literal("travel"),
      v.literal("house"),
      v.literal("car"),
      v.literal("education"),
      v.literal("retirement"),
      v.literal("general")
    ),
    category: v.union(
      v.literal("short_term"),
      v.literal("medium_term"),
      v.literal("long_term")
    ),
    priority: v.union(
      v.literal("urgent"),
      v.literal("fun"),
      v.literal("dream")
    ),
    targetAmount: v.number(),
    currentAmount: v.optional(v.number()),
    targetDate: v.string(),
    monthlyContribution: v.optional(v.number()),
    riskTolerance: v.optional(v.union(
      v.literal("conservative"),
      v.literal("moderate"),
      v.literal("aggressive"),
      v.literal("very_aggressive"),
      v.literal("ultra_aggressive")
    )),
    description: v.optional(v.string()),
    milestones: v.optional(v.array(v.object({
      amount: v.number(),
      description: v.string(),
      achieved: v.boolean(),
      achievedAt: v.optional(v.number())
    }))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const now = Date.now();
    return await ctx.db.insert("financialGoals", {
      userId: user._id,
      title: args.title,
      goalType: args.goalType,
      category: args.category,
      priority: args.priority,
      targetAmount: args.targetAmount,
      currentAmount: args.currentAmount || 0,
      targetDate: args.targetDate,
      monthlyContribution: args.monthlyContribution,
      riskTolerance: args.riskTolerance,
      isActive: true,
      description: args.description,
      createdAt: now,
      lastUpdated: now,
      milestones: args.milestones || [],
    });
  },
});

export const updateGoal = mutation({
  args: {
    goalId: v.id("financialGoals"),
    updates: v.object({
      title: v.optional(v.string()),
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
      milestones: v.optional(v.array(v.object({
        amount: v.number(),
        description: v.string(),
        achieved: v.boolean(),
        achievedAt: v.optional(v.number())
      }))),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== user._id) {
      throw new Error("Goal not found or access denied");
    }

    return await ctx.db.patch(args.goalId, {
      ...args.updates,
      lastUpdated: Date.now(),
    });
  },
});

export const addToGoal = mutation({
  args: {
    goalId: v.id("financialGoals"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== user._id) {
      throw new Error("Goal not found or access denied");
    }

    const newAmount = goal.currentAmount + args.amount;
    return await ctx.db.patch(args.goalId, {
      currentAmount: newAmount,
      lastUpdated: Date.now(),
    });
  },
});

export const achieveMilestone = mutation({
  args: {
    goalId: v.id("financialGoals"),
    milestoneIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== user._id) {
      throw new Error("Goal not found or access denied");
    }

    if (!goal.milestones || args.milestoneIndex >= goal.milestones.length) {
      throw new Error("Milestone not found");
    }

    const updatedMilestones = [...goal.milestones];
    updatedMilestones[args.milestoneIndex] = {
      ...updatedMilestones[args.milestoneIndex],
      achieved: true,
      achievedAt: Date.now(),
    };

    return await ctx.db.patch(args.goalId, {
      milestones: updatedMilestones,
      lastUpdated: Date.now(),
    });
  },
});

export const deleteGoal = mutation({
  args: { goalId: v.id("financialGoals") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const goal = await ctx.db.get(args.goalId);
    if (!goal || goal.userId !== user._id) {
      throw new Error("Goal not found or access denied");
    }

    return await ctx.db.delete(args.goalId);
  },
});