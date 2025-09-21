import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";


export const processPDFUpload = action({
  args: {
    pdfData: v.string(), // Base64 encoded PDF data
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Call the PDF processing service via ngrok
      const response = await fetch('https://c91ae5dc5db6.ngrok-free.app/process-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          pdfData: args.pdfData,
          fileName: args.fileName
        })
      });

      if (!response.ok) {
        throw new Error(`PDF service returned ${response.status}`);
      }

      const result = await response.json();
      
      // Check if any transactions were extracted
      if (!result.success || !result.transactions || result.transactions.length === 0) {
        throw new Error('No transactions could be extracted from the PDF. The PDF may be scanned or not contain readable text.');
      }

      return result;

    } catch (error) {
      console.error('Error processing PDF upload:', error);
      throw new Error(`Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

export const createBankStatement = mutation({
  args: {
    fileName: v.string(),
    totalTransactions: v.number(),
  },
  handler: async (ctx, args): Promise<string> => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("bankStatements", {
      userId: user._id,
      fileName: args.fileName,
      fileId: "placeholder-file-id" as any, // We'll need to handle file storage properly
      uploadDate: Date.now(),
      processingStatus: "completed" as const,
      totalTransactions: args.totalTransactions,
    });
  },
});

export const saveExtractedTransactions = action({
  args: {
    transactions: v.array(v.object({
      date: v.string(),
      description: v.string(),
      amount: v.number(),
      merchant: v.optional(v.string()),
      category: v.string(),
      transactionType: v.union(v.literal("debit"), v.literal("credit")),
    })),
    fileName: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; savedCount: number; transactionIds: string[] }> => {
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) throw new Error("Not authenticated");

    try {
      // Create a bank statement record using a mutation
      const statementId = await ctx.runMutation(api.pdfUpload.createBankStatement, {
        fileName: args.fileName,
        totalTransactions: args.transactions.length,
      });

      const savedTransactions: string[] = [];
      
      for (const transaction of args.transactions) {
        const transactionId: string = await ctx.runMutation(api.transactions.addTransaction, {
          statementId: statementId as any,
          date: transaction.date,
          description: transaction.description,
          amount: transaction.amount,
          category: transaction.category,
          merchant: transaction.merchant,
          transactionType: transaction.transactionType,
        });
        
        savedTransactions.push(transactionId);
      }
      
      return {
        success: true,
        savedCount: savedTransactions.length,
        transactionIds: savedTransactions
      };
      
    } catch (error) {
      console.error('Error saving transactions:', error);
      throw new Error(`Failed to save transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});
