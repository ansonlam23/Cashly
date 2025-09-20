import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get Plaid access token from DB
export const getPlaidAccessToken = query({
  args: { itemId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    let item;
    if (args.itemId) {
      item = await ctx.db.query("plaidItems").withIndex("by_item_id", (q: any) => q.eq("itemId", args.itemId)).first();
    } else {
      item = await ctx.db.query("plaidItems").withIndex("by_user", (q: any) => q.eq("userId", user._id)).first();
    }

    return item?.accessToken || null;
  },
});

// Get Plaid items for user
export const getPlaidItems = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db.query("plaidItems").withIndex("by_user", (q: any) => q.eq("userId", user._id)).collect();
  },
});
