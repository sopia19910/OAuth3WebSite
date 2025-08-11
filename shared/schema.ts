import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  userEmail: text("user_email").notNull(),
  chainId: integer("chain_id").notNull(),
  address: text("address").notNull(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chains = pgTable("chains", {
  id: serial("id").primaryKey(),
  networkName: text("network_name").notNull().unique(),
  rpcUrl: text("rpc_url").notNull(),
  chainId: integer("chain_id").notNull().unique(),
  explorerUrl: text("explorer_url").notNull(),
  networkImage: text("network_image"),
  zkAccountFactory: text("zk_account_factory"),
  verifierAddress: text("verifier_address"),
  oauthNamingService: text("oauth_naming_service"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// API Management Tables
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  owner: text("owner").notNull(), // user email or identifier
  status: text("status").notNull().default("active"), // active, suspended, deleted
  purpose: text("purpose").notNull(), // web, mobile, server, other
  callbackDomains: jsonb("callback_domains").$type<string[]>().default([]),
  ipWhitelist: jsonb("ip_whitelist").$type<string[]>().default([]),
  defaultChainId: integer("default_chain_id").notNull(),
  gasSponsorEnabled: boolean("gas_sponsor_enabled").default(false),
  gasDailyLimit: decimal("gas_daily_limit", { precision: 18, scale: 6 }).default("0"),
  dailyTransferLimit: integer("daily_transfer_limit").default(100),
  dailyAmountLimit: decimal("daily_amount_limit", { precision: 18, scale: 6 }).default("1000"),
  allowedChains: jsonb("allowed_chains").$type<number[]>().default([]),
  webhookUrl: text("webhook_url"),
  webhookSecret: text("webhook_secret"),
  riskScore: integer("risk_score").default(0), // 0-100
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  keyName: text("key_name").notNull(),
  keyHash: text("key_hash").notNull().unique(), // hashed API key
  keyPrefix: text("key_prefix").notNull(), // first 8 chars for display
  permissions: jsonb("permissions").$type<string[]>().default(["read", "transfer"]),
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transfers = pgTable("transfers", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  apiKeyId: uuid("api_key_id").notNull(),
  chainId: integer("chain_id").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  tokenAddress: text("token_address"), // null for native token
  amount: decimal("amount", { precision: 18, scale: 6 }).notNull(),
  status: text("status").notNull(), // submitted, pending, confirmed, failed, cancelled
  txHash: text("tx_hash"),
  errorCode: text("error_code"),
  errorMessage: text("error_message"),
  gasUsed: decimal("gas_used", { precision: 18, scale: 6 }),
  gasCost: decimal("gas_cost", { precision: 18, scale: 6 }),
  isSponsored: boolean("is_sponsored").default(false),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usageMetrics = pgTable("usage_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  date: timestamp("date").notNull(),
  endpoint: text("endpoint").notNull(),
  requestCount: integer("request_count").default(0),
  successCount: integer("success_count").default(0),
  errorCount: integer("error_count").default(0),
  avgLatency: integer("avg_latency").default(0), // milliseconds
  transferCount: integer("transfer_count").default(0),
  gasSponsored: decimal("gas_sponsored", { precision: 18, scale: 6 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actor: text("actor").notNull(), // user who performed action
  action: text("action").notNull(), // what was done
  resource: text("resource").notNull(), // what was affected
  resourceId: text("resource_id"), // ID of affected resource
  details: jsonb("details").$type<Record<string, any>>().default({}),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const riskRules = pgTable("risk_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  conditions: jsonb("conditions").$type<Record<string, any>>().notNull(),
  actions: jsonb("actions").$type<string[]>().notNull(), // ["hold", "alert", "block"]
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  firstName: true,
  lastName: true,
  email: true,
  company: true,
  message: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export const insertTokenSchema = createInsertSchema(tokens).pick({
  userEmail: true,
  chainId: true,
  address: true,
  symbol: true,
  name: true,
}).extend({
  chainId: z.number().positive("Chain ID must be positive"),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long"),
  name: z.string().min(1, "Name is required"),
});

export const insertChainSchema = createInsertSchema(chains).pick({
  networkName: true,
  rpcUrl: true,
  chainId: true,
  explorerUrl: true,
  networkImage: true,
  zkAccountFactory: true,
  verifierAddress: true,
  oauthNamingService: true,
  isActive: true,
}).extend({
  networkName: z.string().min(1, "Network name is required"),
  rpcUrl: z.string().url("Invalid RPC URL"),
  chainId: z.number().positive("Chain ID must be positive"),
  explorerUrl: z.string().url("Invalid explorer URL"),
  networkImage: z.string().optional(),
  zkAccountFactory: z.string().optional(),
  verifierAddress: z.string().optional(),
  oauthNamingService: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  owner: true,
  purpose: true,
  callbackDomains: true,
  ipWhitelist: true,
  defaultChainId: true,
  gasSponsorEnabled: true,
  gasDailyLimit: true,
  dailyTransferLimit: true,
  dailyAmountLimit: true,
  allowedChains: true,
  webhookUrl: true,
}).extend({
  name: z.string().min(2, "Project name must be at least 2 characters").max(50, "Project name too long"),
  owner: z.string().email("Valid email required"),
  purpose: z.enum(["web", "mobile", "server", "other"]),
  defaultChainId: z.number().positive("Chain ID must be positive"),
  callbackDomains: z.array(z.string().url()).optional().default([]),
  ipWhitelist: z.array(z.string()).optional().default([]),
  gasSponsorEnabled: z.boolean().optional().default(false),
  gasDailyLimit: z.string().optional().default("0"),
  dailyTransferLimit: z.number().min(1).max(10000).optional().default(100),
  dailyAmountLimit: z.string().optional().default("1000"),
  allowedChains: z.array(z.number()).optional().default([]),
  webhookUrl: z.string().url().optional(),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  projectId: true,
  keyName: true,
  permissions: true,
  expiresAt: true,
}).extend({
  keyName: z.string().min(1, "Key name is required"),
  permissions: z.array(z.string()).optional().default(["read", "transfer"]),
});

export const insertTransferSchema = createInsertSchema(transfers).pick({
  projectId: true,
  chainId: true,
  fromAddress: true,
  toAddress: true,
  tokenAddress: true,
  amount: true,
  metadata: true,
}).extend({
  fromAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid from address"),
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid to address"),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid token address").optional(),
  amount: z.string().min(1, "Amount is required"),
  chainId: z.number().positive("Chain ID must be positive"),
});

// Relations
export const projectsRelations = relations(projects, ({ many, one }) => ({
  apiKeys: many(apiKeys),
  transfers: many(transfers),
  usageMetrics: many(usageMetrics),
  defaultChain: one(chains, {
    fields: [projects.defaultChainId],
    references: [chains.chainId],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  project: one(projects, {
    fields: [apiKeys.projectId],
    references: [projects.id],
  }),
  transfers: many(transfers),
}));

export const transfersRelations = relations(transfers, ({ one }) => ({
  project: one(projects, {
    fields: [transfers.projectId],
    references: [projects.id],
  }),
  apiKey: one(apiKeys, {
    fields: [transfers.apiKeyId],
    references: [apiKeys.id],
  }),
  chain: one(chains, {
    fields: [transfers.chainId],
    references: [chains.chainId],
  }),
}));

export const usageMetricsRelations = relations(usageMetrics, ({ one }) => ({
  project: one(projects, {
    fields: [usageMetrics.projectId],
    references: [projects.id],
  }),
}));

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;
export type Token = typeof tokens.$inferSelect;
export type InsertChain = z.infer<typeof insertChainSchema>;
export type Chain = typeof chains.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type Transfer = typeof transfers.$inferSelect;
export type UsageMetric = typeof usageMetrics.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type RiskRule = typeof riskRules.$inferSelect;
