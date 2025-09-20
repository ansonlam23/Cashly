import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getUserStatements = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("bankStatements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const createStatement = mutation({
  args: {
    fileName: v.string(),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("bankStatements", {
      userId: user._id,
      fileName: args.fileName,
      fileId: args.fileId,
      uploadDate: Date.now(),
      processingStatus: "pending",
    });
  },
});

export const updateStatementStatus = mutation({
  args: {
    statementId: v.id("bankStatements"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    totalTransactions: v.optional(v.number()),
    dateRange: v.optional(v.object({
      start: v.string(),
      end: v.string()
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const { statementId, status, ...updates } = args;
    
    return await ctx.db.patch(statementId, {
      processingStatus: status,
      ...updates,
    });
  },
});
