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
      console.log('Processing PDF upload:', {
        fileName: args.fileName,
        dataLength: args.pdfData.length,
        dataPreview: args.pdfData.substring(0, 100) + '...'
      });

      // Try to call the PDF processing service
      try {
        const response = await fetch('http://localhost:5001/process-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pdfData: args.pdfData,
            fileName: args.fileName
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('PDF service response:', result);
          return result;
        } else {
          throw new Error(`PDF service returned ${response.status}`);
        }
      } catch (serviceError) {
        console.log('PDF service not available, using mock data:', serviceError);
        
        // Fallback to mock data if service is not available
        const mockTransactions = [
          {
            date: "2024-01-15",
            description: "Sample Transaction 1",
            amount: -25.50,
            merchant: "Sample Store",
            category: "Shopping",
            transactionType: "debit" as const
          },
          {
            date: "2024-01-14",
            description: "Sample Transaction 2",
            amount: -12.75,
            merchant: "Coffee Shop",
            category: "Food and Drink",
            transactionType: "debit" as const
          },
          {
            date: "2024-01-13",
            description: "Sample Transaction 3",
            amount: 1500.00,
            merchant: "Salary Deposit",
            category: "Income",
            transactionType: "credit" as const
          }
        ];

        const totalIncome = mockTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = mockTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const netFlow = totalIncome - totalExpenses;

        // Group by category
        const categories: Record<string, number> = {};
        mockTransactions.forEach(transaction => {
          const category = transaction.category;
          if (!categories[category]) {
            categories[category] = 0;
          }
          categories[category] += Math.abs(transaction.amount);
        });

        return {
          success: true,
          transactions: mockTransactions,
          summary: {
            totalTransactions: mockTransactions.length,
            totalIncome,
            totalExpenses,
            netFlow,
            uniqueMerchants: new Set(mockTransactions.map(t => t.merchant)).size,
            categories
          },
          metadata: {
            processedAt: new Date().toISOString(),
            extractedTextLength: 0,
            transactionLinesFound: mockTransactions.length,
            note: "Using mock data. Start PDF service with: cd pdf-processor && source venv/bin/activate && python server.py"
          }
        };
      }

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
