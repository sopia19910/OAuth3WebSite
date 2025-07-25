import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertContactSchema, insertChainSchema } from "@shared/schema";
import { getOAuth2Client, requireAuth, generateSecureCircuitInput, generateSecureZKProof } from "./auth";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { sendContactEmail } from "./email";

// Contract addresses are now stored in database per chain

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production' && !process.env.GOOGLE_REDIRECT_URI?.includes('localhost'),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    }
  }));
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);

      // Send email notification
      const emailData = {
        firstName: contact.first_name,
        lastName: contact.last_name,
        email: contact.email,
        company: contact.company || undefined,
        message: contact.message
      };

      const emailSent = await sendContactEmail(emailData);
      
      if (!emailSent) {
        console.warn("Email notification could not be sent, but contact was saved successfully");
      }

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

  // Generate OAuth URL
  app.get('/api/auth/google', (req, res) => {
    const oauth2Client = getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid'
      ],
      include_granted_scopes: true
    });

    res.json({
      success: true,
      authUrl: authUrl
    });
  });

  // OAuth callback
  app.get('/api/auth/google/callback', async (req, res) => {
    const { code } = req.query;

    try {
      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Authorization code is required'
        });
      }

      console.log('🔐 Processing OAuth callback');

      // Exchange code for tokens
      const oauth2Client = getOAuth2Client();
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Get user info
      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Failed to get user info');
      }

      const email = payload.email!;
      const emailDomain = email.split('@')[1];

      console.log('📧 Email verified:', email);
      console.log('🌐 Domain:', emailDomain);

      // Store user in session
      req.session.user = {
        id: payload.sub,
        email: email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      };

      // Generate secure circuit input for ZKP
      const circuitInput = await generateSecureCircuitInput(email, emailDomain, tokens.id_token!);

      // Save input file for proof generation
      const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = Date.now();
      const inputFilename = `secure-google-oauth-input-${sanitizedEmail}-${timestamp}.json`;
      const inputPath = path.join(process.cwd(), 'circuits', inputFilename);

      // Ensure circuits directory exists
      const circuitsDir = path.join(process.cwd(), 'circuits');
      if (!fs.existsSync(circuitsDir)) {
        fs.mkdirSync(circuitsDir, { recursive: true });
      }

      fs.writeFileSync(inputPath, JSON.stringify(circuitInput, null, 2));

      console.log('✅ OAuth successful!');
      console.log('💾 ZK input saved to:', inputPath);

      // Store ZKP data in session for later use
      req.session.zkpData = {
        circuitInput,
        inputFilename,
        userSecret: circuitInput.userSecret,
        timestamp: circuitInput.timestamp
      };

      // Redirect back to personal service page
      res.redirect(`/personalservice?oauth=success&email=${encodeURIComponent(email)}&domain=${encodeURIComponent(emailDomain)}`);

    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      res.redirect('/personalservice?oauth=error&message=' + encodeURIComponent('Authentication failed'));
    }
  });

  // Get current user info
  app.get('/api/auth/me', (req, res) => {
    if (req.session.user) {
      res.json({
        success: true,
        user: req.session.user
      });
    } else {
      res.json({
        success: false,
        user: null
      });
    }
  });

  // Get configuration (including RPC URL and contract addresses) - now uses database
  app.get('/api/config', async (req, res) => {
    try {
      const { chainId } = req.query;
      let selectedChain;

      if (chainId) {
        // If chainId is provided, get that specific chain
        const chains = await storage.getChains();
        // Prioritize actual chain ID over database ID to avoid conflicts
        selectedChain = chains.find(chain =>
          chain.chainId.toString() === chainId.toString()
        );
        // If not found by chainId, try database ID as fallback
        if (!selectedChain) {
          selectedChain = chains.find(chain =>
            chain.id.toString() === chainId.toString()
          );
        }
        if (!selectedChain) {
          return res.status(400).json({
            success: false,
            error: 'Invalid chain ID'
          });
        }
      } else {
        // Otherwise use the active chain
        selectedChain = await storage.getActiveChain();
        if (!selectedChain) {
          // If no active chain in database, return error
          return res.status(500).json({
            success: false,
            error: 'No active chain configured in database'
          });
        }
      }

      res.json({
        success: true,
        rpcUrl: selectedChain.rpcUrl,
        networkName: selectedChain.networkName,
        chainId: selectedChain.chainId.toString(),
        explorerUrl: selectedChain.explorerUrl,
        zkVerifierV3Address: selectedChain.verifierAddress,
        zkAccountFactoryV3Address: selectedChain.zkAccountFactory,
        oauthNamingService: selectedChain.oauthNamingService,
        oa3TokenAddress: process.env.OA3_TOKEN_ADDRESS || '0xA28FB91e203721B077fE1EBE450Ee62C0d9857Ea',
        taikoTokenAddress: process.env.TAIKO_TOKEN_ADDRESS || '0x1234567890123456789012345678901234567890'
      });
    } catch (error) {
      console.error('Error fetching config:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch configuration'
      });
    }
  });

  // Check ZK Account V3
  app.get('/api/zkaccount3/check', async (req, res) => {
    try {
      const { walletAddress, chainId } = req.query;

      if (!walletAddress || !ethers.isAddress(walletAddress as string)) {
        return res.status(400).json({
          success: false,
          error: 'Valid walletAddress parameter required'
        });
      }

      console.log('🔍 Checking V3 ZK accounts for:', walletAddress, 'on chain:', chainId || 'active');

      // ZKAccountFactoryV3 ABI
      const zkAccountFactoryV3ABI = [
        "function getUserAccounts(address user) external view returns (address[])",
        "function getAccountCount(address user) external view returns (uint256)",
        "function isZKAccount(address) external view returns (bool)"
      ];

      // Get chain RPC URL from database
      let selectedChain;
      if (chainId) {
        // If chainId is provided, get that specific chain
        const chains = await storage.getChains();
        // Prioritize actual chain ID over database ID to avoid conflicts
        selectedChain = chains.find(chain =>
          chain.chainId.toString() === chainId.toString()
        );
        // If not found by chainId, try database ID as fallback
        if (!selectedChain) {
          selectedChain = chains.find(chain =>
            chain.id.toString() === chainId.toString()
          );
        }
        if (!selectedChain) {
          return res.status(400).json({
            success: false,
            error: 'Invalid chain ID'
          });
        }
      } else {
        // Otherwise use the active chain
        selectedChain = await storage.getActiveChain();
        if (!selectedChain) {
          return res.status(500).json({
            success: false,
            error: 'No active chain configured in database'
          });
        }
      }

      console.log('📍 Using chain:', selectedChain.networkName, 'with RPC:', selectedChain.rpcUrl);

      // Check if ZK Account Factory is deployed on this chain
      if (!selectedChain.zkAccountFactory || !selectedChain.verifierAddress) {
        console.log(`⚠️ ZK Account Factory not deployed on ${selectedChain.networkName}`);
        return res.json({
          success: true,
          hasZKAccount: false,
          zkAccountAddress: null,
          currentOwner: null,
          balance: '0',
          tokenBalance: '0',
          taikoBalance: '0',
          requiresZKProof: false,
          factoryAddress: null,
          emailHash: '0',
          domainHash: '0',
          verifierContract: null,
          accountNonce: '0',
          error: `ZK Account Factory not deployed on ${selectedChain.networkName}`
        });
      }

      const provider = new ethers.JsonRpcProvider(selectedChain.rpcUrl);
      const zkAccountFactoryV3 = new ethers.Contract(selectedChain.zkAccountFactory, zkAccountFactoryV3ABI, provider);

      // Get user's ZK accounts from V3 factory
      let userAccounts;
      try {
        userAccounts = await zkAccountFactoryV3.getUserAccounts(walletAddress);
        console.log('📱 Found', userAccounts.length, 'ZK Account V3(s) for:', walletAddress);
      } catch (error) {
        // Contract not deployed on this chain
        console.log(`⚠️ ZK Account Factory not deployed on ${selectedChain.networkName}`);
        return res.json({
          success: true,
          hasZKAccount: false,
          zkAccountAddress: null,
          currentOwner: null,
          balance: '0',
          tokenBalance: '0',
          taikoBalance: '0',
          requiresZKProof: false,
          factoryAddress: selectedChain.zkAccountFactory,
          emailHash: '0',
          domainHash: '0',
          verifierContract: null,
          accountNonce: '0',
          error: `ZK Account Factory not deployed on ${selectedChain.networkName}`
        });
      }

      if (userAccounts.length > 0) {
        const zkAccountAddress = userAccounts[0]; // Use first account
        console.log(`  ZK Account V3:`, zkAccountAddress);

        // Get account balance
        const accountBalance = await provider.getBalance(zkAccountAddress);
        const balanceETH = ethers.formatEther(accountBalance);

        // Get OA3 token balance from chain-specific tokens
        const erc20ABI = [
          "function balanceOf(address account) external view returns (uint256)",
          "function decimals() external view returns (uint8)"
        ];

        // Get tokens for this chain from database
        const chainTokens = await storage.getTokensByChain(selectedChain.chainId);
        const oa3Token = chainTokens.find(token => token.symbol === 'OA3');

        let tokenBalanceFormatted = '0';
        try {
          if (oa3Token && oa3Token.address && oa3Token.address !== '0x0000000000000000000000000000000000000000') {
            const tokenContract = new ethers.Contract(oa3Token.address, erc20ABI, provider);
            const tokenBalance = await tokenContract.balanceOf(zkAccountAddress);
            const decimals = await tokenContract.decimals();
            tokenBalanceFormatted = ethers.formatUnits(tokenBalance, decimals);
          }
        } catch (error) {
          console.log('⚠️  Error fetching OA3 token balance:', (error as Error).message);
          tokenBalanceFormatted = '0';
        }

        // Get TAIKO token balance (if exists in database)
        const taikoToken = chainTokens.find(token => token.symbol === 'TAIKO');
        let taikoBalanceFormatted = '0';
        try {
          if (taikoToken && taikoToken.address && taikoToken.address !== '0x0000000000000000000000000000000000000000') {
            const taikoContract = new ethers.Contract(taikoToken.address, erc20ABI, provider);
            const taikoBalance = await taikoContract.balanceOf(zkAccountAddress);
            const taikoDecimals = await taikoContract.decimals();
            taikoBalanceFormatted = ethers.formatUnits(taikoBalance, taikoDecimals);
          }
        } catch (error) {
          console.log('⚠️  Error fetching TAIKO token balance:', (error as Error).message);
          taikoBalanceFormatted = '0';
        }

        // Get ZK Account owner information
        const zkAccountABI = [
          "function getAccountInfo() external view returns (address,address,bool,uint256,uint256,uint256)"
        ];

        const zkAccount = new ethers.Contract(zkAccountAddress, zkAccountABI, provider);
        const accountInfo = await zkAccount.getAccountInfo();
        const currentOwner = accountInfo[0];
        const verifierContract = accountInfo[1];
        const requiresZKProof = accountInfo[2];
        const emailHash = accountInfo[3];
        const domainHash = accountInfo[4];
        const nonce = accountInfo[5];

        console.log('📋 ZK Account detailed info:', {
          currentOwner: currentOwner,
          verifierContract: verifierContract,
          requiresZKProof: requiresZKProof,
          emailHash: emailHash?.toString(),
          domainHash: domainHash?.toString(),
          nonce: nonce?.toString()
        });

        // Enhanced response with all account parameters
        res.json({
          success: true,
          hasZKAccount: true,
          zkAccountAddress: zkAccountAddress,
          currentOwner: currentOwner,
          balance: balanceETH,
          tokenBalance: tokenBalanceFormatted,
          taikoBalance: taikoBalanceFormatted,
          requiresZKProof: requiresZKProof,
          factoryAddress: selectedChain.zkAccountFactory,
          emailHash: emailHash?.toString() || '0',
          domainHash: domainHash?.toString() || '0',
          verifierContract: verifierContract || selectedChain.verifierAddress,
          accountNonce: nonce?.toString() || '0'
        });
      } else {
        // No ZK Account found
        res.json({
          success: true,
          hasZKAccount: false,
          zkAccountAddress: null,
          factoryAddress: selectedChain.zkAccountFactory
        });
      }

    } catch (error) {
      console.error('❌ Error fetching V3 accounts:', error);
      res.status(500).json({
        success: false,
        error: (error as Error).message
      });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Failed to logout'
        });
      }
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });

  // Generate ZK Proof
  app.post('/api/zkp/generate', requireAuth, async (req, res) => {
    try {
      if (!req.session.zkpData) {
        return res.status(400).json({
          success: false,
          error: 'No ZKP data available. Please login again.'
        });
      }

      const { circuitInput } = req.session.zkpData;

      console.log('🔒 Generating ZK proof for user:', req.session.user?.email);

      // Generate the ZK proof
      const { proof, publicSignals } = await generateSecureZKProof(circuitInput);

      // Extract meaningful data from public signals
      const emailHash = publicSignals[0];
      const domainHash = publicSignals[1];
      const nullifier = publicSignals[2];

      res.json({
        success: true,
        proof,
        publicSignals,
        zkpData: {
          emailHash,
          domainHash,
          nullifier,
          userSecret: req.session.zkpData.userSecret,
          timestamp: req.session.zkpData.timestamp
        }
      });
    } catch (error) {
      console.error('❌ ZKP generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate ZK proof'
      });
    }
  });

  // Token Management APIs
  app.get('/api/tokens', requireAuth, async (req, res) => {
    try {
      const { chainId } = req.query;
      if (!chainId) {
        return res.status(400).json({
          success: false,
          error: 'Chain ID is required'
        });
      }

      console.log('🔍 Getting tokens for chainId:', chainId, 'parsed:', parseInt(chainId as string));
      const tokens = await storage.getTokensByChain(parseInt(chainId as string));
      console.log('📦 Found tokens:', tokens.length);
      
      res.json({
        success: true,
        tokens
      });
    } catch (error) {
      console.error('❌ Error fetching tokens:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tokens'
      });
    }
  });

  app.post('/api/tokens', requireAuth, async (req, res) => {
    try {
      const userEmail = req.session.user?.email;
      if (!userEmail) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const { insertTokenSchema } = await import('@shared/schema');
      const validatedData = insertTokenSchema.parse({
        ...req.body,
        userEmail,
        chainId: parseInt(req.body.chainId)
      });

      const token = await storage.createToken(validatedData);
      res.json({
        success: true,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('❌ Error creating token:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create token'
      });
    }
  });

  app.delete('/api/tokens/:id', requireAuth, async (req, res) => {
    try {
      const userEmail = req.session.user?.email;
      if (!userEmail) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }

      const tokenId = parseInt(req.params.id);
      if (isNaN(tokenId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid token ID'
        });
      }

      const deleted = await storage.deleteToken(tokenId, userEmail);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Token not found'
        });
      }

      res.json({
        success: true,
        message: 'Token deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting token:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete token'
      });
    }
  });

  // Chain Management APIs
  app.get('/api/chains', async (req, res) => {
    try {
      const chains = await storage.getChains();
      res.json({
        success: true,
        chains
      });
    } catch (error) {
      console.error('❌ Error fetching chains:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch chains'
      });
    }
  });

  app.post('/api/chains', async (req, res) => {
    try {
      const validatedData = insertChainSchema.parse(req.body);

      // If this chain should be active, deactivate all others first
      if (validatedData.isActive) {
        const existingChains = await storage.getChains();
        for (const chain of existingChains) {
          if (chain.isActive) {
            await storage.updateChain(chain.id, { isActive: false });
          }
        }
      }

      const chain = await storage.createChain(validatedData);
      res.json({
        success: true,
        chain
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('❌ Error creating chain:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create chain'
      });
    }
  });

  app.put('/api/chains/:id', async (req, res) => {
    try {
      const chainId = parseInt(req.params.id);
      if (isNaN(chainId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid chain ID'
        });
      }

      const validatedData = insertChainSchema.partial().parse(req.body);

      // If setting this chain as active, deactivate all others first
      if (validatedData.isActive) {
        const existingChains = await storage.getChains();
        for (const chain of existingChains) {
          if (chain.isActive && chain.id !== chainId) {
            await storage.updateChain(chain.id, { isActive: false });
          }
        }
      }

      const chain = await storage.updateChain(chainId, validatedData);
      if (!chain) {
        return res.status(404).json({
          success: false,
          error: 'Chain not found'
        });
      }

      res.json({
        success: true,
        chain
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        });
      }
      console.error('❌ Error updating chain:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update chain'
      });
    }
  });

  app.delete('/api/chains/:id', async (req, res) => {
    try {
      const chainId = parseInt(req.params.id);
      if (isNaN(chainId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid chain ID'
        });
      }

      const deleted = await storage.deleteChain(chainId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Chain not found'
        });
      }

      res.json({
        success: true,
        message: 'Chain deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting chain:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete chain'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
