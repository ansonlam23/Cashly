/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aiInsights from "../aiInsights.js";
import type * as auth from "../auth.js";
import type * as bankStatements from "../bankStatements.js";
import type * as goals from "../goals.js";
import type * as http from "../http.js";
import type * as insights from "../insights.js";
import type * as investments from "../investments.js";
import type * as pdfUpload from "../pdfUpload.js";
import type * as plaidActions from "../plaidActions.js";
import type * as plaidMutations from "../plaidMutations.js";
import type * as plaidQueries from "../plaidQueries.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiInsights: typeof aiInsights;
  auth: typeof auth;
  bankStatements: typeof bankStatements;
  goals: typeof goals;
  http: typeof http;
  insights: typeof insights;
  investments: typeof investments;
  pdfUpload: typeof pdfUpload;
  plaidActions: typeof plaidActions;
  plaidMutations: typeof plaidMutations;
  plaidQueries: typeof plaidQueries;
  transactions: typeof transactions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
