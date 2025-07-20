import { ethers } from 'ethers';
import solc from 'solc';
import fs from 'fs';
import path from 'path';

// Deployment configuration
const SEPOLIA_RPC = 'https://hardworking-fluent-waterfall.ethereum-sepolia.quiknode.pro/4ec26b05f7eb2476ae4abbee59f8421092149b30/';
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';

// Contract compilation helper
function compileContract(contractName: string, contractSource: string, imports: Record<string, string> = {}) {
  const input = {
    language: 'Solidity',
    sources: {
      [contractName]: {
        content: contractSource
      },
      ...Object.entries(imports).reduce((acc, [name, content]) => {
        acc[name] = { content };
        return acc;
      }, {} as Record<string, { content: string }>)
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object']
        }
      }
    }
  };

  // Import callback for OpenZeppelin contracts
  function findImports(importPath: string) {
    if (importPath.startsWith('@openzeppelin/')) {
      const ozPath = path.join('node_modules', importPath);
      try {
        const content = fs.readFileSync(ozPath, 'utf8');
        return { contents: content };
      } catch (error) {
        return { error: `Could not find ${importPath}` };
      }
    }
    return { error: `Import not found: ${importPath}` };
  }

  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
  
  if (output.errors) {
    const errors = output.errors.filter((e: any) => e.severity === 'error');
    if (errors.length > 0) {
      console.error('Compilation errors:', errors);
      throw new Error('Compilation failed');
    }
  }

  return output;
}

async function deployContracts() {
  console.log('🚀 Starting contract deployment to Sepolia...\n');

  if (!PRIVATE_KEY) {
    throw new Error('DEPLOYER_PRIVATE_KEY environment variable not set');
  }

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log('📍 Deployer address:', wallet.address);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log('💰 Balance:', ethers.formatEther(balance), 'ETH\n');

  // Read contract sources
  const verifierSource = fs.readFileSync('contracts/SecureGoogleOAuthVerifier.sol', 'utf8');
  const zkAccountSource = fs.readFileSync('contracts/ZKAccountV3.sol', 'utf8');
  const factorySource = fs.readFileSync('contracts/ZKAccountFactoryV3.sol', 'utf8');

  // Step 1: Deploy SecureGoogleOAuthVerifier
  console.log('1️⃣ Deploying SecureGoogleOAuthVerifier...');
  const verifierCompiled = compileContract('SecureGoogleOAuthVerifier.sol', verifierSource);
  const verifierContract = verifierCompiled.contracts['SecureGoogleOAuthVerifier.sol']['Groth16Verifier'];
  
  const VerifierFactory = new ethers.ContractFactory(
    verifierContract.abi,
    verifierContract.evm.bytecode.object,
    wallet
  );
  
  const verifier = await VerifierFactory.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log('✅ Verifier deployed at:', verifierAddress);

  // Step 2: Deploy ZKAccountV3 Implementation
  console.log('\n2️⃣ Deploying ZKAccountV3 Implementation...');
  const zkAccountCompiled = compileContract(
    'ZKAccountV3.sol', 
    zkAccountSource,
    { 'SecureGoogleOAuthVerifier.sol': verifierSource }
  );
  const zkAccountContract = zkAccountCompiled.contracts['ZKAccountV3.sol']['ZKAccountV3'];
  
  const ZKAccountFactory = new ethers.ContractFactory(
    zkAccountContract.abi,
    zkAccountContract.evm.bytecode.object,
    wallet
  );
  
  const zkAccountImpl = await ZKAccountFactory.deploy();
  await zkAccountImpl.waitForDeployment();
  const zkAccountImplAddress = await zkAccountImpl.getAddress();
  console.log('✅ ZKAccountV3 Implementation deployed at:', zkAccountImplAddress);

  // Step 3: Deploy ZKAccountFactoryV3
  console.log('\n3️⃣ Deploying ZKAccountFactoryV3...');
  const factoryCompiled = compileContract(
    'ZKAccountFactoryV3.sol',
    factorySource,
    { 
      'ZKAccountV3.sol': zkAccountSource,
      'SecureGoogleOAuthVerifier.sol': verifierSource 
    }
  );
  const factoryContract = factoryCompiled.contracts['ZKAccountFactoryV3.sol']['ZKAccountFactoryV3'];
  
  const FactoryFactory = new ethers.ContractFactory(
    factoryContract.abi,
    factoryContract.evm.bytecode.object,
    wallet
  );
  
  const factory = await FactoryFactory.deploy(zkAccountImplAddress, verifierAddress);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log('✅ ZKAccountFactoryV3 deployed at:', factoryAddress);

  // Summary
  console.log('\n📋 Deployment Summary:');
  console.log('========================');
  console.log('Groth16Verifier:', verifierAddress);
  console.log('ZKAccountV3 Implementation:', zkAccountImplAddress);
  console.log('ZKAccountFactoryV3:', factoryAddress);
  console.log('========================\n');

  // Save deployment info
  const deploymentInfo = {
    network: 'sepolia',
    timestamp: new Date().toISOString(),
    contracts: {
      Groth16Verifier: verifierAddress,
      ZKAccountV3Implementation: zkAccountImplAddress,
      ZKAccountFactoryV3: factoryAddress
    }
  };

  fs.writeFileSync('deployment-sepolia.json', JSON.stringify(deploymentInfo, null, 2));
  console.log('💾 Deployment info saved to deployment-sepolia.json');
}

// Run deployment
deployContracts()
  .then(() => {
    console.log('\n✨ Deployment completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });