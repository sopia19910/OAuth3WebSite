import { storage } from "./storage";

async function initializeChains() {
  try {
    console.log('🔗 Initializing chains...');
    
    // Check if chains already exist
    const existingChains = await storage.getChains();
    
    if (existingChains.length === 0) {
      // Insert holesky chain as the default active chain
      const holeskyChain = await storage.createChain({
        networkName: 'holesky',
        rpcUrl: 'https://sly-purple-arrow.ethereum-holesky.quiknode.pro/527b0c9fc7e623afe132b3a2d5fbe5a79647560f/',
        chainId: 17000,
        explorerUrl: 'https://holesky.etherscan.io',
        isActive: true
      });
      
      console.log('✅ Holesky chain added:', holeskyChain);
    } else {
      console.log('ℹ️  Chains already exist in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing chains:', error);
    process.exit(1);
  }
}

initializeChains();