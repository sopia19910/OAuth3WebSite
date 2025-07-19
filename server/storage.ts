import { users, contacts, tokens, type User, type InsertUser, type Contact, type InsertContact, type Token, type InsertToken } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tokens: Map<number, Token>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.tokens = new Map();
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
}

export const storage = new DatabaseStorage();
