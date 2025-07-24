import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  isActive: true,
}).extend({
  networkName: z.string().min(1, "Network name is required"),
  rpcUrl: z.string().url("Invalid RPC URL"),
  chainId: z.number().positive("Chain ID must be positive"),
  explorerUrl: z.string().url("Invalid explorer URL"),
  networkImage: z.string().optional(),
  zkAccountFactory: z.string().optional(),
  verifierAddress: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;
export type Token = typeof tokens.$inferSelect;
export type InsertChain = z.infer<typeof insertChainSchema>;
export type Chain = typeof chains.$inferSelect;
