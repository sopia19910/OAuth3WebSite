import { 
  users, 
  contacts, 
  tokens, 
  chains, 
  projects, 
  apiKeys, 
  transfers, 
  usageMetrics, 
  auditLogs,
  type User, 
  type InsertUser, 
  type LoginUser,
  type Contact, 
  type InsertContact, 
  type Token, 
  type InsertToken, 
  type Chain, 
  type InsertChain,
  type Project,
  type InsertProject,
  type ApiKey,
  type InsertApiKey,
  type Transfer,
  type InsertTransfer,
  type UsageMetric,
  type AuditLog
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact management
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Token management
  getTokensByChain(chainId: number): Promise<Token[]>;
  createToken(token: InsertToken): Promise<Token>;
  deleteToken(id: number, userEmail: string): Promise<boolean>;
  
  // Chain management
  getChains(): Promise<Chain[]>;
  getActiveChain(): Promise<Chain | undefined>;
  getChainByNetworkName(networkName: string): Promise<Chain | undefined>;
  createChain(chain: InsertChain): Promise<Chain>;
  updateChain(id: number, chain: Partial<InsertChain>): Promise<Chain | undefined>;
  deleteChain(id: number): Promise<boolean>;
  
  // Project management
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // API Key management
  getApiKeys(projectId: string): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey & { keyHash: string; keyPrefix: string }): Promise<ApiKey>;
  updateApiKey(id: string, apiKey: Partial<ApiKey>): Promise<ApiKey | undefined>;
  deleteApiKey(id: string): Promise<boolean>;
  getApiKeyByHash(keyHash: string): Promise<ApiKey | undefined>;
  
  // Transfer management
  getTransfers(timeRange?: string): Promise<Transfer[]>;
  getTransfer(id: string): Promise<Transfer | undefined>;
  createTransfer(transfer: InsertTransfer): Promise<Transfer>;
  updateTransfer(id: string, transfer: Partial<Transfer>): Promise<Transfer | undefined>;
  
  // Usage metrics
  getUsageMetrics(timeRange?: string, projectId?: string): Promise<UsageMetric[]>;
  createUsageMetric(metric: Omit<UsageMetric, 'id' | 'createdAt'>): Promise<UsageMetric>;
  
  // Audit logs
  getAuditLogs(timeRange?: string): Promise<AuditLog[]>;
  createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tokens: Map<number, Token>;
  private chains: Map<number, Chain>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.tokens = new Map();
    this.chains = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser,
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      company: insertUser.company || null,
      isVerified: false,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentId++;
    const contact: Contact = { 
      ...insertContact, 
      id,
      company: insertContact.company || null,
      createdAt: new Date()
    };
    // In memory storage for contacts (in real app, this would be persisted)
    console.log("Contact submitted:", contact);
    return contact;
  }

  async getTokensByChain(chainId: number): Promise<Token[]> {
    return Array.from(this.tokens.values()).filter(
      (token) => token.chainId === chainId
    );
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const id = this.currentId++;
    const token: Token = {
      ...insertToken,
      id,
      createdAt: new Date()
    };
    this.tokens.set(id, token);
    return token;
  }

  async deleteToken(id: number, userEmail: string): Promise<boolean> {
    const token = this.tokens.get(id);
    if (token && token.userEmail === userEmail) {
      this.tokens.delete(id);
      return true;
    }
    return false;
  }

  async getChains(): Promise<Chain[]> {
    return Array.from(this.chains.values());
  }

  async getActiveChain(): Promise<Chain | undefined> {
    return Array.from(this.chains.values()).find(chain => chain.isActive);
  }

  async getChainByNetworkName(networkName: string): Promise<Chain | undefined> {
    return Array.from(this.chains.values()).find(chain => chain.networkName === networkName);
  }

  async createChain(insertChain: InsertChain): Promise<Chain> {
    const id = this.currentId++;
    const chain: Chain = {
      ...insertChain,
      id,
      isActive: insertChain.isActive ?? true,
      networkImage: insertChain.networkImage ?? null,
      zkAccountFactory: insertChain.zkAccountFactory ?? null,
      verifierAddress: insertChain.verifierAddress ?? null,
      oauthNamingService: insertChain.oauthNamingService ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.chains.set(id, chain);
    return chain;
  }

  async updateChain(id: number, insertChain: Partial<InsertChain>): Promise<Chain | undefined> {
    const chain = this.chains.get(id);
    if (chain) {
      const updated = { ...chain, ...insertChain, updatedAt: new Date() };
      this.chains.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteChain(id: number): Promise<boolean> {
    return this.chains.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const { db } = await import("./db");
    const { contacts } = await import("@shared/schema");
    
    const [contact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async getTokensByChain(chainId: number): Promise<Token[]> {
    const { db } = await import("./db");
    const { tokens } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    return await db.select().from(tokens).where(
      eq(tokens.chainId, chainId)
    );
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const { db } = await import("./db");
    const { tokens } = await import("@shared/schema");
    
    const [token] = await db
      .insert(tokens)
      .values(insertToken)
      .returning();
    return token;
  }

  async deleteToken(id: number, userEmail: string): Promise<boolean> {
    const { db } = await import("./db");
    const { tokens } = await import("@shared/schema");
    const { eq, and } = await import("drizzle-orm");
    
    const result = await db
      .delete(tokens)
      .where(and(eq(tokens.id, id), eq(tokens.userEmail, userEmail)));
    
    return !!result;
  }

  async getChains(): Promise<Chain[]> {
    const { db } = await import("./db");
    const { chains } = await import("@shared/schema");
    
    return await db.select().from(chains);
  }

  async getActiveChain(): Promise<Chain | undefined> {
    const { db } = await import("./db");
    const { chains } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [chain] = await db.select().from(chains).where(eq(chains.isActive, true));
    return chain || undefined;
  }

  async getChainByNetworkName(networkName: string): Promise<Chain | undefined> {
    const { db } = await import("./db");
    const { chains } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [chain] = await db.select().from(chains).where(eq(chains.networkName, networkName));
    return chain || undefined;
  }

  async createChain(insertChain: InsertChain): Promise<Chain> {
    const { db } = await import("./db");
    const { chains } = await import("@shared/schema");
    
    const [chain] = await db
      .insert(chains)
      .values(insertChain)
      .returning();
    return chain;
  }

  async updateChain(id: number, insertChain: Partial<InsertChain>): Promise<Chain | undefined> {
    const { db } = await import("./db");
    const { chains } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [chain] = await db
      .update(chains)
      .set({ ...insertChain, updatedAt: new Date() })
      .where(eq(chains.id, id))
      .returning();
    return chain || undefined;
  }

  async deleteChain(id: number): Promise<boolean> {
    const { db } = await import("./db");
    const { chains } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const result = await db
      .delete(chains)
      .where(eq(chains.id, id));
    
    return !!result;
  }

  // Project management methods
  async getProjects(): Promise<Project[]> {
    const { db } = await import("./db");
    const { projects } = await import("@shared/schema");
    
    return await db.select().from(projects);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const { db } = await import("./db");
    const { projects } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const { db } = await import("./db");
    const { projects } = await import("@shared/schema");
    
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: string, updateData: Partial<Project>): Promise<Project | undefined> {
    const { db } = await import("./db");
    const { projects } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [project] = await db
      .update(projects)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const { db } = await import("./db");
    const { projects } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id));
    
    return !!result;
  }

  // API Key management methods
  async getApiKeys(projectId: string): Promise<ApiKey[]> {
    const { db } = await import("./db");
    const { apiKeys } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    return await db.select().from(apiKeys).where(eq(apiKeys.projectId, projectId));
  }

  async createApiKey(insertApiKey: InsertApiKey & { keyHash: string; keyPrefix: string }): Promise<ApiKey> {
    const { db } = await import("./db");
    const { apiKeys } = await import("@shared/schema");
    
    const [apiKey] = await db
      .insert(apiKeys)
      .values(insertApiKey)
      .returning();
    return apiKey;
  }

  async updateApiKey(id: string, updateData: Partial<ApiKey>): Promise<ApiKey | undefined> {
    const { db } = await import("./db");
    const { apiKeys } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [apiKey] = await db
      .update(apiKeys)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(apiKeys.id, id))
      .returning();
    return apiKey || undefined;
  }

  async deleteApiKey(id: string): Promise<boolean> {
    const { db } = await import("./db");
    const { apiKeys } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const result = await db
      .delete(apiKeys)
      .where(eq(apiKeys.id, id));
    
    return !!result;
  }

  async getApiKeyByHash(keyHash: string): Promise<ApiKey | undefined> {
    const { db } = await import("./db");
    const { apiKeys } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash));
    return apiKey || undefined;
  }

  // Transfer management methods
  async getTransfers(timeRange?: string): Promise<Transfer[]> {
    const { db } = await import("./db");
    const { transfers } = await import("@shared/schema");
    const { gte } = await import("drizzle-orm");
    
    let query = db.select().from(transfers);
    
    if (timeRange) {
      const now = new Date();
      let cutoff: Date;
      
      switch (timeRange) {
        case '24h':
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      
      query = query.where(gte(transfers.createdAt, cutoff));
    }
    
    return await query;
  }

  async getTransfer(id: string): Promise<Transfer | undefined> {
    const { db } = await import("./db");
    const { transfers } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [transfer] = await db.select().from(transfers).where(eq(transfers.id, id));
    return transfer || undefined;
  }

  async createTransfer(insertTransfer: InsertTransfer): Promise<Transfer> {
    const { db } = await import("./db");
    const { transfers } = await import("@shared/schema");
    
    const [transfer] = await db
      .insert(transfers)
      .values({
        ...insertTransfer,
        status: "submitted",
        apiKeyId: "temp-api-key-id" // This would come from the API request context
      })
      .returning();
    return transfer;
  }

  async updateTransfer(id: string, updateData: Partial<Transfer>): Promise<Transfer | undefined> {
    const { db } = await import("./db");
    const { transfers } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [transfer] = await db
      .update(transfers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(transfers.id, id))
      .returning();
    return transfer || undefined;
  }

  // Usage metrics methods
  async getUsageMetrics(timeRange?: string, projectId?: string): Promise<UsageMetric[]> {
    const { db } = await import("./db");
    const { usageMetrics } = await import("@shared/schema");
    const { gte, eq, and } = await import("drizzle-orm");
    
    let conditions = [];
    
    if (timeRange) {
      const now = new Date();
      let cutoff: Date;
      
      switch (timeRange) {
        case '24h':
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      
      conditions.push(gte(usageMetrics.createdAt, cutoff));
    }
    
    if (projectId) {
      conditions.push(eq(usageMetrics.projectId, projectId));
    }
    
    let query = db.select().from(usageMetrics);
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    
    return await query;
  }

  async createUsageMetric(insertMetric: Omit<UsageMetric, 'id' | 'createdAt'>): Promise<UsageMetric> {
    const { db } = await import("./db");
    const { usageMetrics } = await import("@shared/schema");
    
    const [metric] = await db
      .insert(usageMetrics)
      .values(insertMetric)
      .returning();
    return metric;
  }

  // Audit log methods
  async getAuditLogs(timeRange?: string): Promise<AuditLog[]> {
    const { db } = await import("./db");
    const { auditLogs } = await import("@shared/schema");
    const { gte, desc } = await import("drizzle-orm");
    
    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
    
    if (timeRange) {
      const now = new Date();
      let cutoff: Date;
      
      switch (timeRange) {
        case '24h':
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      
      query = query.where(gte(auditLogs.createdAt, cutoff));
    }
    
    return await query;
  }

  async createAuditLog(insertLog: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const { db } = await import("./db");
    const { auditLogs } = await import("@shared/schema");
    
    const [log] = await db
      .insert(auditLogs)
      .values(insertLog)
      .returning();
    return log;
  }
}

export const storage = new DatabaseStorage();
