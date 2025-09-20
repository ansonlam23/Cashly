import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Bank statements and financial data
    bankStatements: defineTable({
      userId: v.id("users"),
      fileName: v.string(),
      fileId: v.id("_storage"),
      uploadDate: v.number(),
      processingStatus: v.union(
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
    }).index("by_user", ["userId"]),

    // Individual transactions extracted from bank statements
    transactions: defineTable({
      userId: v.id("users"),
      statementId: v.id("bankStatements"),
      date: v.string(),
      description: v.string(),
      amount: v.number(),
      category: v.string(),
      merchant: v.optional(v.string()),
      transactionType: v.union(v.literal("debit"), v.literal("credit")),
      balance: v.optional(v.number()),
    }).index("by_user", ["userId"])
      .index("by_statement", ["statementId"])
      .index("by_user_and_date", ["userId", "date"])
      .index("by_user_and_category", ["userId", "category"]),

    // User financial goals and investment plans
    financialGoals: defineTable({
      userId: v.id("users"),
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
      isActive: v.boolean(),
      description: v.optional(v.string()),
    }).index("by_user", ["userId"])
      .index("by_user_and_active", ["userId", "isActive"]),

    // AI-generated insights and recommendations
    insights: defineTable({
      userId: v.id("users"),
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
      isRead: v.boolean(),
      relatedCategory: v.optional(v.string()),
      actionable: v.boolean(),
    }).index("by_user", ["userId"])
      .index("by_user_and_read", ["userId", "isRead"]),

    // Budget categories and limits
    budgets: defineTable({
      userId: v.id("users"),
      category: v.string(),
      monthlyLimit: v.number(),
      currentSpent: v.number(),
      month: v.string(), // YYYY-MM format
      isActive: v.boolean(),
    }).index("by_user", ["userId"])
      .index("by_user_and_month", ["userId", "month"])
      .index("by_user_category_month", ["userId", "category", "month"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;