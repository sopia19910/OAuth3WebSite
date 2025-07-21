import { users, contacts, tokens, chains, type User, type InsertUser, type Contact, type InsertContact, type Token, type InsertToken, type Chain, type InsertChain } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  getTokensByEmail(userEmail: string): Promise<Token[]>;
  createToken(token: InsertToken): Promise<Token>;
  deleteToken(id: number, userEmail: string): Promise<boolean>;
  getChains(): Promise<Chain[]>;
  getActiveChain(): Promise<Chain | undefined>;
  getChainByNetworkName(networkName: string): Promise<Chain | undefined>;
  createChain(chain: InsertChain): Promise<Chain>;
  updateChain(id: number, chain: Partial<InsertChain>): Promise<Chain | undefined>;
  deleteChain(id: number): Promise<boolean>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
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

  async getTokensByEmail(userEmail: string): Promise<Token[]> {
    return Array.from(this.tokens.values()).filter(
      (token) => token.userEmail === userEmail
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

  async getTokensByEmail(userEmail: string): Promise<Token[]> {
    const { db } = await import("./db");
    const { tokens } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    return await db.select().from(tokens).where(eq(tokens.userEmail, userEmail));
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
}

export const storage = new DatabaseStorage();
