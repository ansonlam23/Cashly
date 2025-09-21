import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getCurrentUser } from "./users";

// Get all investments for a user
export const getUserInvestments = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const investments = await ctx.db
      .query("investments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return investments;
  },
});

// Get portfolio summary
export const getPortfolioSummary = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const investments = await ctx.db
      .query("investments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);
    const totalGainLoss = investments.reduce((sum, inv) => sum + inv.totalGainLoss, 0);
    const totalGainLossPercent = totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0;
    const dayChange = investments.reduce((sum, inv) => sum + (inv.dayChange * inv.shares), 0);

    return {
      totalValue,
      totalGainLoss,
      totalGainLossPercent,
      dayChange,
      investmentCount: investments.length,
      investments: investments.sort((a, b) => b.totalValue - a.totalValue)
    };
  },
});

// Add or update an investment
export const addInvestment = mutation({
  args: {
    symbol: v.string(),
    shares: v.number(),
    averageCost: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if investment already exists
    const existing = await ctx.db
      .query("investments")
      .withIndex("by_user_and_symbol", (q) => 
        q.eq("userId", user._id).eq("symbol", args.symbol.toUpperCase())
      )
      .first();

    if (existing) {
      // Update existing investment with new shares and average cost
      const totalShares = existing.shares + args.shares;
      const totalCost = (existing.shares * existing.averageCost) + (args.shares * args.averageCost);
      const newAverageCost = totalCost / totalShares;

      await ctx.db.patch(existing._id, {
        shares: totalShares,
        averageCost: newAverageCost,
        lastUpdated: Date.now(),
      });

      return existing._id;
    } else {
      // Create new investment
      return await ctx.db.insert("investments", {
        userId: user._id,
        symbol: args.symbol.toUpperCase(),
        shares: args.shares,
        averageCost: args.averageCost,
        currentPrice: 0, // Will be updated by price fetch
        dayChange: 0,
        dayChangePercent: 0,
        totalValue: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        lastUpdated: 0,
        addedDate: Date.now(),
      });
    }
  },
});

// Update investment prices
export const updateInvestmentPrices = mutation({
  args: {
    symbol: v.string(),
    currentPrice: v.number(),
    dayChange: v.number(),
    dayChangePercent: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const investment = await ctx.db
      .query("investments")
      .withIndex("by_user_and_symbol", (q) => 
        q.eq("userId", user._id).eq("symbol", args.symbol.toUpperCase())
      )
      .first();

    if (!investment) return null;

    const totalValue = investment.shares * args.currentPrice;
    const totalGainLoss = (args.currentPrice - investment.averageCost) * investment.shares;
    const totalGainLossPercent = investment.averageCost > 0 
      ? ((args.currentPrice - investment.averageCost) / investment.averageCost) * 100 
      : 0;

    await ctx.db.patch(investment._id, {
      currentPrice: args.currentPrice,
      dayChange: args.dayChange,
      dayChangePercent: args.dayChangePercent,
      totalValue,
      totalGainLoss,
      totalGainLossPercent,
      lastUpdated: Date.now(),
    });

    return investment._id;
  },
});

// Delete an investment
export const deleteInvestment = mutation({
  args: { id: v.id("investments") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const investment = await ctx.db.get(args.id);
    if (!investment || investment.userId !== user._id) {
      throw new Error("Investment not found or not authorized");
    }

    await ctx.db.delete(args.id);
  },
});

// Get historical stock prices for charts
export const getStockPrices = query({
  args: { 
    symbol: v.string(),
    days: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const prices = await ctx.db
      .query("stockPrices")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol.toUpperCase()))
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), startDate.toISOString().split('T')[0]),
          q.lte(q.field("date"), endDate.toISOString().split('T')[0])
        )
      )
      .order("asc")
      .collect();

    return prices;
  },
});

// Store historical stock price data
export const storeStockPrices = mutation({
  args: {
    symbol: v.string(),
    prices: v.array(v.object({
      date: v.string(),
      open: v.number(),
      high: v.number(),
      low: v.number(),
      close: v.number(),
      volume: v.number(),
    }))
  },
  handler: async (ctx, args) => {
    const symbol = args.symbol.toUpperCase();
    
    // Delete existing prices for this symbol
    const existing = await ctx.db
      .query("stockPrices")
      .withIndex("by_symbol", (q) => q.eq("symbol", symbol))
      .collect();

    for (const price of existing) {
      await ctx.db.delete(price._id);
    }

    // Insert new prices
    const results = [];
    for (const price of args.prices) {
      const id = await ctx.db.insert("stockPrices", {
        symbol,
        date: price.date,
        open: price.open,
        high: price.high,
        low: price.low,
        close: price.close,
        volume: price.volume,
        timestamp: Date.now(),
      });
      results.push(id);
    }

    return results;
  },
});

// Action to fetch stock data from external API
export const fetchStockData = action({
  args: { 
    symbol: v.string(),
    days: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const symbol = args.symbol.toUpperCase();
    const days = args.days || 30;
    
    try {
      // Using Alpha Vantage API (free tier)
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY || "4Y9CTEY1GZ8L2Q7R";
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`
      );
      
      const data = await response.json();
      
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }
      
      if (data["Note"]) {
        throw new Error("API rate limit exceeded. Please try again later.");
      }
      
      const timeSeries = data["Time Series (Daily)"];
      if (!timeSeries) {
        throw new Error("No data available for this symbol");
      }
      
      // Convert to our format
      const prices = Object.entries(timeSeries)
        .slice(0, days)
        .map(([date, data]: [string, any]) => ({
          date,
          open: parseFloat(data["1. open"]),
          high: parseFloat(data["2. high"]),
          low: parseFloat(data["3. low"]),
          close: parseFloat(data["4. close"]),
          volume: parseInt(data["5. volume"]),
        }))
        .reverse(); // Oldest first
      
      // Store in database
      await ctx.runMutation(api.investments.storeStockPrices, {
        symbol,
        prices
      });
      
      return prices;
    } catch (error) {
      console.error("Error fetching stock data:", error);
      throw new Error(`Failed to fetch data for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Action to fetch current stock price
export const fetchCurrentPrice = action({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    const symbol = args.symbol.toUpperCase();
    
    try {
      // Using Alpha Vantage API for current price
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY || "4Y9CTEY1GZ8L2Q7R";
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data["Error Message"]) {
        throw new Error(data["Error Message"]);
      }
      
      if (data["Note"]) {
        throw new Error("API rate limit exceeded. Please try again later.");
      }
      
      const quote = data["Global Quote"];
      if (!quote || !quote["01. symbol"]) {
        throw new Error("No data available for this symbol");
      }
      
      const currentPrice = parseFloat(quote["05. price"]);
      const dayChange = parseFloat(quote["09. change"]);
      const dayChangePercent = parseFloat(quote["10. change percent"].replace("%", ""));
      
      return {
        symbol,
        currentPrice,
        dayChange,
        dayChangePercent
      };
    } catch (error) {
      console.error("Error fetching current price:", error);
      throw new Error(`Failed to fetch price for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Action to update all investment prices
export const updateAllInvestmentPrices = action({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<Array<{ symbol: string; success: boolean; error?: string }>> => {
    const investments = await ctx.runQuery(api.investments.getUserInvestments, {});
    
    const results: Array<{ symbol: string; success: boolean; error?: string }> = [];
    for (const investment of investments) {
      try {
        const priceData = await ctx.runAction(api.investments.fetchCurrentPrice, {
          symbol: investment.symbol
        });
        
        await ctx.runMutation(api.investments.updateInvestmentPrices, {
          symbol: investment.symbol,
          currentPrice: priceData.currentPrice,
          dayChange: priceData.dayChange,
          dayChangePercent: priceData.dayChangePercent,
        });
        
        results.push({ symbol: investment.symbol, success: true });
      } catch (error) {
        console.error(`Failed to update ${investment.symbol}:`, error);
        results.push({ symbol: investment.symbol, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
    
    return results;
  },
});
