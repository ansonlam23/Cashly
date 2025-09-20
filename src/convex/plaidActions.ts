"use node";

import { PlaidApi, Configuration, PlaidEnvironments, TransactionsGetRequest, CountryCode, Products } from "plaid";
import { action } from "./_generated/server";
import { v } from "convex/values";

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

/** ---------------- Actions (Node.js / external API calls) ---------------- **/

// Create Plaid Link token
export const createLinkTokenAction = action({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const request = {
      user: { client_user_id: args.userId },
      client_name: "MoneyMentor",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    const response = await plaidClient.linkTokenCreate(request);
    return response.data.link_token;
  },
});

// Exchange public token for access token
export const exchangePublicTokenAction = action({
  args: { publicToken: v.string() },
  handler: async (ctx, args) => {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: args.publicToken,
    });

    return {
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
    };
  },
});

// Fetch transactions from Plaid
export const fetchTransactionsAction = action({
  args: {
    accessToken: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const startDate =
      args.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const endDate = args.endDate || new Date().toISOString().split("T")[0];

    const request: TransactionsGetRequest = {
      access_token: args.accessToken,
      start_date: startDate,
      end_date: endDate,
    };

    const response = await plaidClient.transactionsGet(request);
    return response.data.transactions;
  },
});

// Remove Plaid item from Plaid API
export const removePlaidItemAction = action({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    await plaidClient.itemRemove({ access_token: args.accessToken });
    return { success: true };
  },
});
