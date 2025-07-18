import { OAuth2Client } from 'google-auth-library';
import { createHash } from 'crypto';
import { ethers } from 'ethers';

// Extend session interface to include user data
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      name?: string;
      picture?: string;
      googleId: string;
    };
    zkpData?: {
      circuitInput: any;
      inputFilename: string;
      userSecret: string;
      timestamp: number;
    };
  }
}

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

// Create OAuth2 client
export function getOAuth2Client(): OAuth2Client {
  return new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

// Middleware to require authentication
export function requireAuth(req: any, res: any, next: any) {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  next();
}

// Generate secure circuit input for ZK proof
export async function generateSecureCircuitInput(
  email: string,
  emailDomain: string,
  idToken: string
): Promise<any> {
  // Generate a secure random secret
  const userSecret = ethers.randomBytes(32);
  const userSecretHex = ethers.hexlify(userSecret);
  
  // Create timestamp
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Hash the email for privacy
  const emailHash = createHash('sha256').update(email).digest('hex');
  
  // Hash the domain
  const domainHash = createHash('sha256').update(emailDomain).digest('hex');
  
  // Create circuit input
  const circuitInput = {
    // Private inputs (not revealed in proof)
    userSecret: userSecretHex,
    email: email,
    emailDomain: emailDomain,
    idToken: idToken,
    timestamp: timestamp,
    
    // Public inputs (revealed in proof)
    emailHash: emailHash,
    domainHash: domainHash,
    timestampPublic: timestamp,
    
    // Additional metadata
    version: "3.0",
    circuitType: "secure_google_oauth_verification"
  };
  
  console.log('🔐 Generated secure circuit input for:', email);
  console.log('📧 Email hash:', emailHash.slice(0, 10) + '...');
  console.log('🌐 Domain hash:', domainHash.slice(0, 10) + '...');
  console.log('⏰ Timestamp:', timestamp);
  
  return circuitInput;
}

// Generate ZK proof (mock implementation)
export async function generateSecureZKProof(circuitInput: any): Promise<any> {
  // In a real implementation, this would use snarkjs to generate a proof
  // For now, we'll create a mock proof structure
  
  console.log('🔄 Generating ZK proof...');
  
  // Simulate proof generation time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create mock proof structure
  const mockProof = {
    protocol: "groth16",
    curve: "bn128",
    proof: {
      a: [
        ethers.randomBytes(32),
        ethers.randomBytes(32),
        "0x1"
      ],
      b: [
        [ethers.randomBytes(32), ethers.randomBytes(32)],
        [ethers.randomBytes(32), ethers.randomBytes(32)],
        ["0x1", "0x0"]
      ],
      c: [
        ethers.randomBytes(32),
        ethers.randomBytes(32),
        "0x1"
      ]
    },
    publicSignals: [
      circuitInput.emailHash,
      circuitInput.domainHash,
      circuitInput.timestampPublic.toString()
    ]
  };
  
  console.log('✅ ZK proof generated successfully');
  console.log('📊 Public signals:', mockProof.publicSignals);
  
  return mockProof;
}

// Verify ZK proof (mock implementation)
export async function verifyZKProof(proof: any, publicSignals: string[]): Promise<boolean> {
  try {
    // In a real implementation, this would verify the proof using the verification key
    // For now, just validate the structure
    if (!proof || !proof.proof || !proof.publicSignals) {
      return false;
    }
    
    // Check if public signals match
    if (proof.publicSignals.length !== publicSignals.length) {
      return false;
    }
    
    for (let i = 0; i < publicSignals.length; i++) {
      if (proof.publicSignals[i] !== publicSignals[i]) {
        return false;
      }
    }
    
    console.log('✅ ZK proof verification successful');
    return true;
  } catch (error) {
    console.error('❌ ZK proof verification failed:', error);
    return false;
  }
}

// Generate secure user identifier
export function generateSecureUserId(email: string, userSecret: string): string {
  const combined = email + userSecret;
  return createHash('sha256').update(combined).digest('hex');
}

// Hash function for email domain verification
export function hashEmailDomain(domain: string): string {
  return createHash('sha256').update(domain).digest('hex');
}

// Validate email domain
export function validateEmailDomain(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate nonce for security
export function generateNonce(): string {
  return ethers.randomBytes(32).toString();
}

// Create secure session data
export function createSecureSessionData(userInfo: any, zkpData: any): any {
  return {
    user: {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      googleId: userInfo.sub
    },
    zkpData: zkpData,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
}