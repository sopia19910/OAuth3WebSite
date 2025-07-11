import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      
      res.json({ 
        success: true, 
        message: "Thank you for your message! We'll get back to you soon.",
        id: contact.id 
      });
    } catch (error) {
      console.error("Contact form error:", error);
      
      if (error instanceof Error && 'issues' in error) {
        // Zod validation error
        res.status(400).json({
          success: false,
          message: "Please check your form data",
          errors: (error as any).issues
        });
      } else {
        res.status(500).json({
          success: false,
          message: "An error occurred while processing your request"
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
