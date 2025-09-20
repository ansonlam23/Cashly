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
    try {
      console.log('Fetching transactions with access token:', args.accessToken?.substring(0, 10) + '...');
      
      const startDate =
        args.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const endDate = args.endDate || new Date().toISOString().split("T")[0];

      console.log('Date range:', { startDate, endDate });

      const request: TransactionsGetRequest = {
        access_token: args.accessToken,
        start_date: startDate,
        end_date: endDate,
      };

      console.log('Making Plaid API request...');
      const response = await plaidClient.transactionsGet(request);
      console.log('Plaid API response received, transaction count:', response.data.transactions?.length || 0);
      
      return response.data.transactions;
    } catch (error) {
      console.error('Error in fetchTransactionsAction:', error);
      throw new Error(`Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Create sandbox public token for testing
export const createSandboxPublicTokenAction = action({
  args: { 
    institutionId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const request = {
      institution_id: args.institutionId || "ins_109508", // Default to Chase
      initial_products: [Products.Transactions],
      options: {
        webhook: "https://your-webhook-url.com", // Optional webhook
      },
    };

    const response = await plaidClient.sandboxPublicTokenCreate(request);
    return response.data.public_token;
  },
});

// Test Plaid connection and get account info
export const testPlaidConnectionAction = action({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    try {
      console.log('Testing Plaid connection with access token:', args.accessToken?.substring(0, 10) + '...');
      
      // Get account information
      const accountsResponse = await plaidClient.accountsGet({
        access_token: args.accessToken,
      });
      
      console.log('Accounts found:', accountsResponse.data.accounts?.length || 0);
      
      // Get item information
      const itemResponse = await plaidClient.itemGet({
        access_token: args.accessToken,
      });
      
      console.log('Item info:', {
        itemId: itemResponse.data.item?.item_id,
        institutionId: itemResponse.data.item?.institution_id,
        availableProducts: itemResponse.data.item?.available_products,
        billedProducts: itemResponse.data.item?.billed_products,
      });
      
      return {
        success: true,
        accountsCount: accountsResponse.data.accounts?.length || 0,
        itemId: itemResponse.data.item?.item_id,
        institutionId: itemResponse.data.item?.institution_id,
        availableProducts: itemResponse.data.item?.available_products,
        billedProducts: itemResponse.data.item?.billed_products,
      };
    } catch (error) {
      console.error('Error testing Plaid connection:', error);
      throw new Error(`Failed to test Plaid connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
