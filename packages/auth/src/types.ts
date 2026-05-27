/**
 * Type definitions for RocketChat Authentication
 * Issue #1265: Replace 'any' types with proper TypeScript types
 */

export interface AuthToken {
  authToken: string;
  userId: string;
}

export interface CurrentUser {
  _id: string;
  username: string;
  name?: string;
  status?: string;
  statusConnection?: string;
  utcOffset?: number;
  active?: boolean;
  roles?: string[];
  emails?: Array<{ address: string; verified: boolean }>;
  authToken?: string;
  [key: string]: unknown; // Allow additional fields
}
