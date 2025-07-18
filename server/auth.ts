import { OAuth2Client } from 'google-auth-library';
import type { Request, Response, NextFunction } from 'express';
import * as snarkjs from 'snarkjs';
import fs from 'fs';
import path from 'path';

// Initialize OAuth2Client lazily to ensure env vars are loaded
let oauth2ClientInstance: OAuth2Client | null = null;

export function getOAuth2Client(): OAuth2Client {
  if (!oauth2ClientInstance) {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';
    
    console.log('🔧 OAuth2 Client Configuration:');
    console.log('CLIENT_ID:', CLIENT_ID);
    console.log('REDIRECT_URI:', REDIRECT_URI);
    
    if (CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
      console.error('❌ ERROR: Google OAuth credentials not loaded!');
      console.error('❌ Make sure you have a .env file with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
      console.error('❌ Do NOT use sudo when running the server - it prevents loading the .env file');
    }
    
    oauth2ClientInstance = new OAuth2Client(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );
  }
  return oauth2ClientInstance;
}

// Don't initialize eagerly - let getOAuth2Client() handle it
// export const oauth2Client = getOAuth2Client();

// Session user type
export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  googleId: string;
}

// Extend Express Request type to include user
declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
    zkpData?: {
      circuitInput: any;
      inputFilename: string;
      userSecret: number;
      timestamp: number;
    };
  }
}

// Middleware to check if user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Helper function to generate secure circuit input
export async function generateSecureCircuitInput(email: string, domain: string, idToken: string) {
  console.log('🔧 Generating secure circuit input...');

  // Generate V3 circuit input with userSecret and timestamp for unique nullifiers
  console.log('🔄 Generating V3 circuit input with unique nullifier support...');

  // V3 circuit expects these fields according to secure-google-oauth.circom
  const emailArray = new Array(16).fill(0); // MAX_EMAIL_LEN = 16
  const domainArray = new Array(10).fill(0); // MAX_DOMAIN_LEN = 10
  const jwtArray = new Array(16).fill(0); // MAX_JWT_LEN = 16

  // Fill email array
  for (let i = 0; i < Math.min(email.length, 16); i++) {
    emailArray[i] = email.charCodeAt(i);
  }

  // Fill domain array
  for (let i = 0; i < Math.min(domain.length, 10); i++) {
    domainArray[i] = domain.charCodeAt(i);
  }

  // Create simplified JWT for circuit
  const jwtStr = `{"email":"${email}"}`;
  for (let i = 0; i < Math.min(jwtStr.length, 16); i++) {
    jwtArray[i] = jwtStr.charCodeAt(i);
  }

  // Generate unique values for each transaction to prevent replay attacks
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const userSecret = Math.floor(Math.random() * 1000000000); // Random secret for nullifier uniqueness

  const v3Input = {
    email: emailArray,
    emailLength: Math.min(email.length, 16),
    domain: domainArray,
    domainLength: Math.min(domain.length, 10),
    googleJWT: jwtArray,
    jwtLength: Math.min(jwtStr.length, 16),
    userSecret: userSecret,
    timestamp: currentTimestamp
  };

  console.log('📧 Email in circuit:', String.fromCharCode(...emailArray.filter(x => x > 0)));
  console.log('🌐 Domain in circuit:', String.fromCharCode(...domainArray.filter(x => x > 0)));
  console.log('🔑 User secret:', userSecret);
  console.log('⏰ Timestamp:', currentTimestamp);

  return v3Input;
}

// Helper function to generate ZK proof using V3 secure circuit
export async function generateSecureZKProof(input: any, authorizedEmailHash: string | null = null, authorizedDomainHash: string | null = null) {
  try {
    console.log('🔒 Generating ZK proof using V3 secure circuit...');

    // Use the V3 secure circuit that supports nullifier generation
    const buildDir = path.join(process.cwd(), 'build-secure-google-oauth');
    const wasmPath = path.join(buildDir, 'secure-google-oauth_js', 'secure-google-oauth.wasm');
    const zkeyPath = path.join(buildDir, 'secure_google_oauth_final.zkey');
    const witnessPath = path.join(buildDir, `witness_${Date.now()}.wtns`);

    // Check if V3 circuit build files exist
    if (!fs.existsSync(wasmPath) || !fs.existsSync(zkeyPath)) {
      console.log('⚠️ V3 secure circuit not found, falling back to V2 circuit...');

      // Fallback to V2 circuit with converted input
      const v2BuildDir = path.join(process.cwd(), 'build-google-jwt-verifier');
      const v2WasmPath = path.join(v2BuildDir, 'google-jwt-verifier_js', 'google-jwt-verifier.wasm');
      const v2ZkeyPath = path.join(v2BuildDir, 'google_jwt_verifier_final.zkey');
      const v2WitnessPath = path.join(v2BuildDir, `witness_${Date.now()}.wtns`);

      if (!fs.existsSync(v2WasmPath) || !fs.existsSync(v2ZkeyPath)) {
        throw new Error('⚠️ Neither V3 nor V2 circuits are built. Please build a circuit first.');
      }

      // Convert V3 input to V2 format for fallback
      const v2Input = convertV3InputToV2Format(input);

      console.log('📊 V2 Circuit input (fallback):');
      console.log('  Email plaintext length:', v2Input.emailPlaintext.length);
      console.log('  JWT header length:', v2Input.jwtHeader.length);
      console.log('  JWT payload length:', v2Input.jwtPayload.length);

      // Generate witness using V2 format
      await snarkjs.wtns.calculate(v2Input, v2WasmPath, v2WitnessPath);

      // Generate proof
      const { proof, publicSignals } = await snarkjs.groth16.prove(v2ZkeyPath, v2WitnessPath);

      // Clean up witness file
      if (fs.existsSync(v2WitnessPath)) {
        fs.unlinkSync(v2WitnessPath);
      }

      console.log('✅ ZK proof generated successfully using V2 circuit (fallback)');
      console.log('📊 Public signals:', publicSignals);
      return { proof, publicSignals };
    }

    // Use V3 circuit with proper input format
    console.log('📊 V3 Circuit input:');
    console.log('  Email length:', input.emailLength);
    console.log('  Domain length:', input.domainLength);
    console.log('  JWT length:', input.jwtLength);
    console.log('  User secret:', input.userSecret);
    console.log('  Timestamp:', input.timestamp);

    // Generate witness using V3 format
    await snarkjs.wtns.calculate(input, wasmPath, witnessPath);

    // Generate proof
    const { proof, publicSignals } = await snarkjs.groth16.prove(zkeyPath, witnessPath);

    // Clean up witness file
    if (fs.existsSync(witnessPath)) {
      fs.unlinkSync(witnessPath);
    }

    console.log('✅ ZK proof generated successfully using V3 circuit');
    console.log('📊 Public signals (V3):', publicSignals);
    console.log('  📧 Email hash:', publicSignals[0]);
    console.log('  🌐 Domain hash:', publicSignals[1]);
    console.log('  🔑 Nullifier:', publicSignals[2]);

    return { proof, publicSignals };

  } catch (error: any) {
    console.error('❌ ZK proof generation failed:', error);
    console.error('❌ Error details:', error.message);
    throw new Error('ZK proof generation failed: ' + error.message);
  }
}

// Helper function to convert V3 input format to V2 format
function convertV3InputToV2Format(v3Input: any) {
  console.log('🔄 Converting V3 input to V2 format...');

  // V2 expects these arrays
  const emailPlaintext = new Array(32).fill(0);
  const jwtHeader = new Array(256).fill(0);
  const jwtPayload = new Array(512).fill(0);
  const jwtSignature = new Array(512).fill(0);
  const googlePublicKey = ["1", "2"]; // Dummy public key for testing

  // Convert email array
  for (let i = 0; i < Math.min(v3Input.emailLength, 32); i++) {
    emailPlaintext[i] = v3Input.email[i] || 0;
  }

  // For JWT, we need to construct a proper JWT format
  // Since V3 only has partial JWT data, we'll create a minimal JWT structure
  const jwtHeaderStr = '{"alg":"RS256","typ":"JWT"}';
  const jwtPayloadStr = `{"email":"${String.fromCharCode(...v3Input.email.slice(0, v3Input.emailLength))}","iat":${v3Input.timestamp}}`;

  // Convert header to ASCII array
  for (let i = 0; i < Math.min(jwtHeaderStr.length, 256); i++) {
    jwtHeader[i] = jwtHeaderStr.charCodeAt(i);
  }

  // Convert payload to ASCII array
  for (let i = 0; i < Math.min(jwtPayloadStr.length, 512); i++) {
    jwtPayload[i] = jwtPayloadStr.charCodeAt(i);
  }

  // Fill signature with dummy data for testing
  for (let i = 0; i < 512; i++) {
    jwtSignature[i] = 65; // ASCII 'A'
  }

  console.log('✅ V3 to V2 conversion complete');
  console.log('  Email string:', String.fromCharCode(...emailPlaintext.filter(x => x > 0)));
  console.log('  JWT header:', jwtHeaderStr);
  console.log('  JWT payload excerpt:', jwtPayloadStr.substring(0, 50) + '...');

  return {
    emailPlaintext,
    jwtHeader,
    jwtPayload,
    jwtSignature,
    googlePublicKey
  };
}