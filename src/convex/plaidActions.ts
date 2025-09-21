"use node";

import { PlaidApi, Configuration, PlaidEnvironments, TransactionsGetRequest, CountryCode, Products } from "plaid";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

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
      client_name: "Cashly",
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
    // Generate custom transactions with diverse categories for better testing
    // Using the correct Plaid API format for custom_transactions
    const customTransactions = [
      {
        date: '2024-01-15',
        amount: -12.50,
        name: 'Starbucks Coffee',
        merchant_name: 'Starbucks',
        category: ['Food and Drink', 'Coffee Shop'],
        transaction_type: 'place'
      },
      {
        date: '2024-01-14',
        amount: -45.80,
        name: 'McDonald\'s',
        merchant_name: 'McDonald\'s',
        category: ['Food and Drink', 'Restaurants'],
        transaction_type: 'place'
      },
      {
        date: '2024-01-13',
        amount: -89.20,
        name: 'Whole Foods Market',
        merchant_name: 'Whole Foods',
        category: ['Food and Drink', 'Groceries'],
        transaction_type: 'place'
      },
      {
        date: '2024-01-12',
        amount: -15.75,
        name: 'Uber',
        merchant_name: 'Uber',
        category: ['Transportation', 'Rideshare'],
        transaction_type: 'place'
      },
      {
        date: '2024-01-11',
        amount: -125.99,
        name: 'Amazon',
        merchant_name: 'Amazon',
        category: ['Shops', 'Online'],
        transaction_type: 'place'
      },
      {
        date: '2024-01-10',
        amount: -24.99,
        name: 'Netflix',
        merchant_name: 'Netflix',
        category: ['Recreation', 'Entertainment'],
        transaction_type: 'place'
      },
      {
        date: '2024-01-09',
        amount: -89.45,
        name: 'Electric Company',
        merchant_name: 'Electric Co',
        category: ['Utilities', 'Electric'],
        transaction_type: 'place'
      },
      {
        date: '2024-01-08',
        amount: 2500.00,
        name: 'Salary Deposit',
        merchant_name: 'Employer',
        category: ['Income', 'Salary'],
        transaction_type: 'place'
      }
    ];

    const request = {
      institution_id: args.institutionId || "ins_109508", // Default to Chase
      initial_products: [Products.Transactions], // Use Products enum
      // Temporarily remove custom_transactions due to TypeScript issues
      // options: {
      //   custom_transactions: customTransactions,
      // },
    };

    console.log('Creating sandbox public token (basic connection)');
    console.log('Request body:', JSON.stringify(request, null, 2));
    
    try {
      const response = await plaidClient.sandboxPublicTokenCreate(request);
      console.log('Successfully created sandbox public token');
      return response.data.public_token;
    } catch (error) {
      console.error('Error creating sandbox public token:', error);
      console.error('Request that failed:', JSON.stringify(request, null, 2));
      throw new Error(`Failed to create sandbox public token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

// Add custom transactions directly to database for better testing
export const addCustomTransactionsAction = action({
  args: { userId: v.string() },
  handler: async (ctx, args): Promise<{ success: boolean; transactionsCount: number; totalTransactions: number }> => {
    try {
      console.log('Adding custom transactions to database...');
      console.log('User ID received:', args.userId);
      
      // Define custom transactions with diverse categories
      const customTransactions = [
        {
          transaction_id: 'custom_starbucks_001',
          date: '2024-01-15',
          name: 'Starbucks Coffee',
          amount: -12.50,
          category: ['Food and Drink', 'Coffee Shop'],
          merchant_name: 'Starbucks',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_mcdonalds_001',
          date: '2024-01-14',
          name: 'McDonald\'s',
          amount: -45.80,
          category: ['Food and Drink', 'Restaurants'],
          merchant_name: 'McDonald\'s',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_wholefoods_001',
          date: '2024-01-13',
          name: 'Whole Foods Market',
          amount: -89.20,
          category: ['Food and Drink', 'Groceries'],
          merchant_name: 'Whole Foods',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_uber_001',
          date: '2024-01-12',
          name: 'Uber',
          amount: -15.75,
          category: ['Transportation', 'Rideshare'],
          merchant_name: 'Uber',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_amazon_001',
          date: '2024-01-11',
          name: 'Amazon',
          amount: -125.99,
          category: ['Shops', 'Online'],
          merchant_name: 'Amazon',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_netflix_001',
          date: '2024-01-10',
          name: 'Netflix',
          amount: -24.99,
          category: ['Recreation', 'Entertainment'],
          merchant_name: 'Netflix',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_electric_001',
          date: '2024-01-09',
          name: 'Electric Company',
          amount: -89.45,
          category: ['Utilities', 'Electric'],
          merchant_name: 'Electric Co',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_salary_001',
          date: '2024-01-08',
          name: 'Salary Deposit',
          amount: 2500.00,
          category: ['Income', 'Salary'],
          merchant_name: 'Employer',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_target_001',
          date: '2024-01-07',
          name: 'Target',
          amount: -78.50,
          category: ['Shops', 'Department Store'],
          merchant_name: 'Target',
          account_id: 'custom_account_001',
        },
        {
          transaction_id: 'custom_metro_001',
          date: '2024-01-06',
          name: 'Metro Transit',
          amount: -2.50,
          category: ['Transportation', 'Public Transit'],
          merchant_name: 'Metro',
          account_id: 'custom_account_001',
        }
      ];

      // Save transactions to database using the existing mutation
      const result: { success: boolean; transactionsCount: number; totalTransactions: number } = await ctx.runMutation(api.plaidMutations.saveTransactions, {
        transactions: customTransactions,
        userId: args.userId,
      });

      console.log('Successfully added custom transactions to database');
      return { success: true, transactionsCount: result.transactionsCount, totalTransactions: result.totalTransactions };
    } catch (error) {
      console.error('Error adding custom transactions:', error);
      throw new Error(`Failed to add custom transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
