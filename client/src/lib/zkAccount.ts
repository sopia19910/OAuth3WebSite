import {ethers} from 'ethers';
import {getProvider} from './wallet';

// Contract addresses - loaded from environment config
let ZK_VERIFIER_V3_ADDRESS: string;
let ZK_ACCOUNT_FACTORY_V3_ADDRESS: string;
let OA3_TOKEN_ADDRESS: string;

// Load contract addresses from backend config
async function loadContractAddresses(chainId?: string) {
    try {
        const url = chainId ? `/api/config?chainId=${chainId}` : '/api/config';
        console.log('🔧 Loading contract addresses from:', url);
        const response = await fetch(url);
        const config = await response.json();
        if (config.success) {
            ZK_VERIFIER_V3_ADDRESS = config.zkVerifierV3Address;
            ZK_ACCOUNT_FACTORY_V3_ADDRESS = config.zkAccountFactoryV3Address;
            OA3_TOKEN_ADDRESS = config.oa3TokenAddress;
            console.log('✅ Contract addresses loaded:');
            console.log('  Chain ID:', config.chainId);
            console.log('  Network Name:', config.networkName);
            console.log('  Factory:', ZK_ACCOUNT_FACTORY_V3_ADDRESS);
            console.log('  Verifier:', ZK_VERIFIER_V3_ADDRESS);
        } else {
            throw new Error('Failed to load contract addresses from config');
        }
    } catch (error) {
        console.error('Error loading contract addresses:', error);
        throw error;
    }
}

// ZKAccountFactoryV3 ABI
const ZK_ACCOUNT_FACTORY_V3_ABI = [
    "function createZKAccount(bool _requiresZKProof, uint256 _authorizedEmailHash, uint256 _authorizedDomainHash, bytes32 _salt, string calldata _gmail) external returns (address)",
    "function getUserAccounts(address user) external view returns (address[])",
    "function getAccountCount(address user) external view returns (uint256)",
    "function predictZKAccountAddress(address owner, bytes32 _salt) external view returns (address)",
    "function isZKAccount(address) external view returns (bool)",
    "function zkVerifier() external view returns (address)",
    "function zkAccountImplementation() external view returns (address)",
    "function getZKAccountByGmailHash(bytes32 _gmailHash) external view returns (address)",
    "event ZKAccountCreated(address indexed owner, address indexed zkAccount, uint256 emailHash, uint256 domainHash, bool requiresZKProof)"
];

export interface ZKAccountInfo {
    hasZKAccount: boolean;
    zkAccountAddress?: string;
    currentOwner?: string;
    balance?: string;
    tokenBalance?: string;
    taikoBalance?: string;
    requiresZKProof?: boolean;
    emailHash?: string;
    domainHash?: string;
    verifierContract?: string;
    accountNonce?: string;
    factoryAddress?: string;
    transactionHash?: string;
    pending?: boolean;
    explorerUrl?: string;
}

export interface ZKAccountCreationResult {
    success: boolean;
    zkAccountAddress?: string;
    transactionHash?: string;
    counterfactualAddress?: string;
    emailHash?: string;
    domainHash?: string;
    explorerUrl?: string;
    error?: string;
}

// Generate deterministic salt based on email and wallet address
function generateSalt(email: string, walletAddress: string): string {
    return ethers.id(email + walletAddress);
}

// Get email and domain hashes from OAuth session (using the same method as the circuit)
async function getOAuthHashesFromSession(): Promise<{ emailHash: bigint, domainHash: bigint }> {
    try {
        // Generate a proof to get the correct hashes used by the circuit
        const response = await fetch('/api/zkp/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get OAuth hashes from session');
        }

        const proofData = await response.json();

        if (!proofData.success) {
            throw new Error(proofData.error || 'Failed to get OAuth hashes');
        }

        return {
            emailHash: BigInt(proofData.publicSignals[0]),
            domainHash: BigInt(proofData.publicSignals[1])
        };
    } catch (error) {
        console.error('Error getting OAuth hashes from session:', error);
        throw error;
    }
}

// Check if user has existing ZK Account using backend API
export async function checkZKAccount(walletAddress: string, chainId?: string): Promise<ZKAccountInfo> {
    try {
        if (!ethers.isAddress(walletAddress)) {
            throw new Error('Invalid wallet address');
        }
        await loadContractAddresses(chainId);

        console.log('🔍 Checking ZK Account for:', walletAddress, 'on chain:', chainId || 'active');

        let url = `/api/zkaccount3/check?walletAddress=${walletAddress}`;
        if (chainId) {
            url += `&chainId=${chainId}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to check ZK account');
        }
        console.log('📋 ZK Account check result:', data);
        return {
            hasZKAccount: data.hasZKAccount,
            zkAccountAddress: data.zkAccountAddress,
            currentOwner: data.currentOwner,
            balance: data.balance,
            tokenBalance: data.tokenBalance,
            taikoBalance: data.taikoBalance,
            requiresZKProof: data.requiresZKProof,
            emailHash: data.emailHash,
            domainHash: data.domainHash,
            verifierContract: data.verifierContract,
            accountNonce: data.accountNonce,
            factoryAddress: data.factoryAddress
        };
    } catch (error) {
        console.error('Error checking ZK account:', error);
        // Handle rate limiting errors gracefully
        if (error instanceof Error && error.message.includes('rate limit')) {
            return {
                hasZKAccount: false,
                zkAccountAddress: undefined,
                currentOwner: undefined,
                balance: '0',
                tokenBalance: '0',
                taikoBalance: '0',
                requiresZKProof: false,
                emailHash: '0',
                domainHash: '0',
                verifierContract: undefined,
                accountNonce: '0',
                factoryAddress: undefined
            };
        }
        throw new Error(`Failed to check ZK account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Create ZK Account
export async function createZKAccount(
    privateKey: string,
    walletAddress: string,
    userEmail: string,
    chainId?: string
): Promise<ZKAccountCreationResult> {
    try {
        // Always reload contract addresses for the specific chain
        await loadContractAddresses(chainId);
        console.log('📝 Contract Addresses for chain', chainId, ':');
        console.log('  🏭 ZK Account Factory V3:', ZK_ACCOUNT_FACTORY_V3_ADDRESS);
        console.log('  ✅ ZK Verifier V3:', ZK_VERIFIER_V3_ADDRESS);
        console.log('  🪙 OA3 Token:', OA3_TOKEN_ADDRESS);

        const provider = await getProvider(chainId);
        const signer = new ethers.Wallet(privateKey, provider);

        // Verify signer address matches wallet address
        if (signer.address.toLowerCase() !== walletAddress.toLowerCase()) {
            throw new Error('Private key does not match wallet address');
        }

        // Get network info for chain-specific gas limits
        const configResponse = await fetch(`/api/config?chainId=${chainId}`);
        const config = await configResponse.json();
        const networkChainId = config.chainId ? parseInt(config.chainId) : chainId;

        // Set higher gas limit for Sepolia (chainId: 11155111)
        const gasLimit = networkChainId === 11155111 ? 1000000 : 500000;

        // Check wallet balance before proceeding with retries
        let balance = await provider.getBalance(walletAddress);
        let balanceInEth = ethers.formatEther(balance);

        console.log(`🔍 Initial balance check for ${walletAddress}: ${balanceInEth} ETH`);

        // Try multiple methods to get the correct balance
        if (balance === 0n) {
            // Wait a bit and retry
            console.log(`⏳ Balance shows 0, waiting and retrying...`);
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Retry with provider
            balance = await provider.getBalance(walletAddress);
            balanceInEth = ethers.formatEther(balance);
            console.log(`🔄 Retry balance: ${balanceInEth} ETH`);

            // If still 0, try direct RPC call
            if (balance === 0n) {
                try {
                    console.log(`⚠️ Still 0, trying direct RPC call to ${config.rpcUrl}`);
                    const response = await fetch(config.rpcUrl, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            method: 'eth_getBalance',
                            params: [walletAddress, 'latest'],
                            id: 1
                        })
                    });
                    const result = await response.json();
                    if (result.result) {
                        const hexBalance = result.result;
                        const alternativeBalance = BigInt(hexBalance);
                        balance = alternativeBalance;
                        balanceInEth = ethers.formatEther(alternativeBalance);
                        console.log(`✅ Direct RPC balance: ${balanceInEth} ETH (hex: ${hexBalance})`);
                    }
                } catch (e) {
                    console.error('❌ Failed to check balance via direct RPC:', e);
                }
            }
        }

        console.log(`📝 Creating ZK Account on chain ${chainId}...`);
        console.log(`📝 Factory contract address: ${ZK_ACCOUNT_FACTORY_V3_ADDRESS}`);
        console.log(`📝 Verifier contract address: ${ZK_VERIFIER_V3_ADDRESS}`);

        const factory = new ethers.Contract(ZK_ACCOUNT_FACTORY_V3_ADDRESS, ZK_ACCOUNT_FACTORY_V3_ABI, signer);

        // Check if account already exists
        console.log(`🔍 Checking existing accounts for ${walletAddress}...`);
        const userAccounts = await factory.getUserAccounts(walletAddress);
        if (userAccounts.length > 0) {
            return {
                success: true,
                zkAccountAddress: userAccounts[0],
                error: 'ZK Account already exists for this wallet'
            };
        }

        // Get correct hashes from OAuth session (same as circuit)
        const {emailHash, domainHash} = await getOAuthHashesFromSession();
        const salt = generateSalt(userEmail, walletAddress);

        // Get counterfactual address
        const counterfactualAddress = await factory.predictZKAccountAddress(walletAddress, salt);

        // Estimate gas and check if wallet has enough
        try {
            const estimatedGas = await factory.createZKAccount.estimateGas(
                true, // requiresZKProof
                emailHash,
                domainHash,
                salt,
                userEmail
            );
            console.log(`📊 Estimated gas: ${estimatedGas.toString()}`);

            const gasPrice = await provider.getFeeData();
            console.log(`⛽ Gas price: ${ethers.formatUnits(gasPrice.gasPrice || 0n, 'gwei')} gwei`);

            const estimatedCost = estimatedGas * (gasPrice.gasPrice || 0n);
            const estimatedCostInEth = ethers.formatEther(estimatedCost);
            console.log(`💸 Estimated transaction cost: ${estimatedCostInEth} ETH`);

            if (balance < estimatedCost) {
                console.error(`❌ Insufficient balance. Have: ${balanceInEth} ETH, Need: ${estimatedCostInEth} ETH`);
                return {
                    success: false,
                    error: `Insufficient balance. You have ${balanceInEth} ETH but need approximately ${estimatedCostInEth} ETH for this transaction.`
                };
            }
        } catch (estimateError) {
            console.error('⚠️ Gas estimation failed:', estimateError);
            console.log('Proceeding with fixed gas limit...');
        }

        // Create the ZK Account
        const createTx = await factory.createZKAccount(
            true, // requiresZKProof
            emailHash,
            domainHash,
            salt,
            userEmail,
            {
                gasLimit: gasLimit
            }
        );

        const txHash = createTx.hash;

        // Use the already fetched config for explorer URL
        const explorerUrl = config.success ? `${config.explorerUrl}/tx/${txHash}` : `https://holesky.etherscan.io/tx/${txHash}`;

        return {
            success: true,
            zkAccountAddress: counterfactualAddress,
            transactionHash: txHash,
            counterfactualAddress,
            emailHash: emailHash.toString(),
            domainHash: domainHash.toString(),
            explorerUrl
        };

    } catch (error) {
        console.error('ZK Account creation error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));

        let errorMessage = 'Failed to create ZK Account: ';

        if (error instanceof Error) {
            // Log the full error for debugging
            console.error('Full error message:', error.message);

            if (error.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient funds for transaction. Please ensure your wallet has enough ETH for gas fees.';
            } else if (error.message.includes('user rejected') || error.message.includes('denied')) {
                errorMessage = 'Transaction was rejected by user.';
            } else if (error.message.includes('nonce')) {
                errorMessage = 'Transaction nonce error. Please try again.';
            } else if (error.message.includes('gas required exceeds allowance')) {
                errorMessage = 'Gas limit too low. The transaction requires more gas than the limit allows.';
            } else {
                errorMessage += error.message;
            }
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

// Wait for transaction confirmation
export async function waitForTransaction(txHash: string, chainId?: string): Promise<ethers.TransactionReceipt | null> {
    try {
        let provider: ethers.JsonRpcProvider;
        provider = await getProvider(chainId);
        return await provider.waitForTransaction(txHash, 1, 30000); // Wait up to 30 seconds
    } catch (error) {
        console.error('Error waiting for transaction:', error);
        return null;
    }
}

export interface TransferResult {
    success: boolean;
    transactionHash?: string;
    error?: string;
    newBalance?: string;
}

// Transfer ETH from ZK Account (frontend-only)
export async function transferETHFromZKAccount(
    privateKey: string,
    walletAddress: string,
    toAddress: string,
    amount: string,
    chainId : string
): Promise<TransferResult> {
    try {
        // Ensure contract addresses are loaded
        await loadContractAddresses(chainId);
        // Input validation
        if (!privateKey || privateKey.trim() === '') {
            throw new Error('Private key is required');
        }

        if (!walletAddress || !ethers.isAddress(walletAddress)) {
            throw new Error('Valid wallet address is required');
        }

        if (!toAddress || toAddress.trim() === '') {
            throw new Error('Recipient address is required');
        }

        if (!ethers.isAddress(toAddress)) {
            throw new Error('Invalid recipient address format');
        }

        if (!amount || amount.trim() === '' || parseFloat(amount) <= 0) {
            throw new Error('Valid amount greater than 0 is required');
        }

        // Check if sending to same address
        if (walletAddress.toLowerCase() === toAddress.toLowerCase()) {
            throw new Error('Cannot send to the same address');
        }

        const provider = await getProvider(chainId);
        const signer = new ethers.Wallet(privateKey, provider);

        // Verify signer address matches wallet address
        if (signer.address.toLowerCase() !== walletAddress.toLowerCase()) {
            throw new Error('Private key does not match wallet address');
        }

        const factory = new ethers.Contract(ZK_ACCOUNT_FACTORY_V3_ADDRESS, ZK_ACCOUNT_FACTORY_V3_ABI, provider);

        // Get user's ZK accounts
        const userAccounts = await factory.getUserAccounts(walletAddress);
        if (userAccounts.length === 0) {
            throw new Error('No ZK Account found for this wallet');
        }

        const zkAccountAddress = userAccounts[0];
        console.log('🏦 Using ZK Account:', zkAccountAddress);

        // Check ETH balance in ZK Account (ZK Account needs ETH to send)
        const ethBalance = await provider.getBalance(zkAccountAddress);
        const amountWei = ethers.parseEther(amount);
        const ethBalanceFormatted = ethers.formatEther(ethBalance);

        console.log('💰 ZK Account ETH Balance:', ethBalanceFormatted, 'ETH');
        console.log('💸 Requested Amount:', amount, 'ETH');

        if (ethBalance < amountWei) {
            throw new Error(`Insufficient ETH balance in ZK Account. Available: ${ethBalanceFormatted} ETH, Requested: ${amount} ETH. You need to send ETH to the ZK Account first.`);
        }

        // Check if owner wallet has enough ETH for gas fees
        const ownerBalance = await provider.getBalance(walletAddress);
        const ownerBalanceFormatted = ethers.formatEther(ownerBalance);
        const minGasBalance = ethers.parseEther('0.001'); // Minimum 0.001 ETH for gas

        if (ownerBalance < minGasBalance) {
            throw new Error(`Insufficient ETH for gas fees in owner wallet. Available: ${ownerBalanceFormatted} ETH, Need at least: 0.001 ETH`);
        }

        // ZK Account V3 ABI for execution
        const zkAccountV3ABI = [
            "function execute(tuple(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[3] publicSignals) proof, address target, uint256 value, bytes data) external",
            "function requiresZKProof() external view returns (bool)"
        ];

        const zkAccount = new ethers.Contract(zkAccountAddress, zkAccountV3ABI, signer);

        // Check if ZK proof is required
        const requiresZKProof = await zkAccount.requiresZKProof();
        console.log('🔒 Requires ZK Proof:', requiresZKProof);

        console.log('🚀 Attempting ETH transfer...');
        console.log('📍 From ZK Account:', zkAccountAddress);
        console.log('📍 To Address:', toAddress);
        console.log('💰 Amount:', amount, 'ETH');

        let tx;

        if (requiresZKProof) {
            // Generate ZK proof for transfer
            console.log('🔒 Generating ZK proof for ETH transfer...');

            const response = await fetch('/api/zkp/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate ZK proof. Please ensure you are logged in with OAuth.');
            }

            const proofData = await response.json();

            console.log('🔍 Raw proof data received:', JSON.stringify(proofData, null, 2));

            if (!proofData.success) {
                throw new Error(proofData.error || 'Failed to generate ZK proof');
            }

            // Format proof for ZK Account V3 with proper structure validation
            const zkProof = {
                a: proofData.proof?.pi_a ? proofData.proof.pi_a.slice(0, 2) : [0, 0],
                b: proofData.proof?.pi_b ? [
                    proofData.proof.pi_b[0].slice(0).reverse(),
                    proofData.proof.pi_b[1].slice(0).reverse()
                ] : [[0, 0], [0, 0]],
                c: proofData.proof?.pi_c ? proofData.proof.pi_c.slice(0, 2) : [0, 0],
                publicSignals: proofData.publicSignals ? proofData.publicSignals.slice(0, 3) : [0, 0, 0]
            };

            console.log('✅ ZK proof generated successfully');
            console.log('🔍 Proof structure:', {
                a: zkProof.a,
                b: zkProof.b,
                c: zkProof.c,
                publicSignals: zkProof.publicSignals
            });
            // Execute with ZK proof
            try {
                const gasEstimate = await zkAccount.execute.estimateGas(zkProof, toAddress, amountWei, '0x');
                console.log('⛽ Gas estimate:', gasEstimate.toString());

                tx = await zkAccount.execute(zkProof, toAddress, amountWei, '0x', {
                    gasLimit: gasEstimate * BigInt(2)
                });
            } catch (estimateError) {
                console.error('❌ Gas estimation failed:', estimateError);

                // Check if error is due to proof already used or other contract revert
                if (estimateError instanceof Error && estimateError.message.includes('proof already used')) {
                    throw new Error('ZK proof has already been used. Please refresh the page and try again.');
                } else if (estimateError instanceof Error && estimateError.message.includes('execution reverted')) {
                    throw new Error('Transaction would fail: ' + estimateError.message);
                } else {
                    // Only fallback to default gas limit for gas estimation issues, not contract errors
                    throw estimateError;
                }
            }
        } else {
            // Execute without proof (if not required)
            const emptyProof = {
                a: [0, 0],
                b: [[0, 0], [0, 0]],
                c: [0, 0],
                publicSignals: [0, 0, 0]
            };

            try {
                const gasEstimate = await zkAccount.execute.estimateGas(emptyProof, toAddress, amountWei, '0x');
                tx = await zkAccount.execute(emptyProof, toAddress, amountWei, '0x', {
                    gasLimit: gasEstimate * BigInt(2)
                });
            } catch (estimateError) {
                if (estimateError instanceof Error && estimateError.message.includes('execution reverted')) {
                    throw new Error('Transaction would fail: ' + estimateError.message);
                }
                tx = await zkAccount.execute(emptyProof, toAddress, amountWei, '0x', {
                    gasLimit: 500000
                });
            }
        }

        // 🚀 IMMEDIATELY return transaction hash
        console.log('✅ ETH transfer transaction sent!');
        console.log('🔗 Transaction hash:', tx.hash);

        return {
            success: true,
            transactionHash: tx.hash,
            newBalance: undefined // Will be updated after confirmation
        };

    } catch (error) {
        console.error('ETH transfer error:', error);

        let errorMessage = 'Failed to transfer ETH: ';

        if (error instanceof Error) {
            if (error.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient funds for transaction. Please ensure your ZK Account has enough ETH.';
            } else if (error.message.includes('user rejected') || error.message.includes('denied')) {
                errorMessage = 'Transaction was rejected by user.';
            } else if (error.message.includes('unauthorized email hash')) {
                errorMessage = 'ZK proof required. Please ensure you are logged in with OAuth and try again.';
            } else if (error.message.includes('proof already used')) {
                errorMessage = 'ZK proof has already been used. Please refresh the page and try again.';
            } else {
                errorMessage += error.message;
            }
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}

// Transfer ERC20 tokens from ZK Account (frontend-only, generic)
export async function transferTokenFromZKAccount(
    privateKey: string,
    walletAddress: string,
    toAddress: string,
    amount: string,
    tokenAddress: string,
    chainId: string
): Promise<TransferResult> {
    try {
        // Ensure contract addresses are loaded
        await loadContractAddresses(chainId);

        // Input validation
        if (!privateKey || privateKey.trim() === '') {
            throw new Error('Private key is required');
        }

        if (!walletAddress || !ethers.isAddress(walletAddress)) {
            throw new Error('Valid wallet address is required');
        }

        if (!toAddress || toAddress.trim() === '') {
            throw new Error('Recipient address is required');
        }

        if (!ethers.isAddress(toAddress)) {
            throw new Error('Invalid recipient address format');
        }

        if (!tokenAddress || !ethers.isAddress(tokenAddress)) {
            throw new Error('Valid token address is required');
        }

        if (!amount || amount.trim() === '' || parseFloat(amount) <= 0) {
            throw new Error('Valid amount greater than 0 is required');
        }

        // Check if sending to same address
        if (walletAddress.toLowerCase() === toAddress.toLowerCase()) {
            throw new Error('Cannot send to the same address');
        }

        const provider = await getProvider(chainId);
        const signer = new ethers.Wallet(privateKey, provider);

        // Verify signer address matches wallet address
        if (signer.address.toLowerCase() !== walletAddress.toLowerCase()) {
            throw new Error('Private key does not match wallet address');
        }

        const factory = new ethers.Contract(ZK_ACCOUNT_FACTORY_V3_ADDRESS, ZK_ACCOUNT_FACTORY_V3_ABI, provider);

        // Get user's ZK accounts
        const userAccounts = await factory.getUserAccounts(walletAddress);
        if (userAccounts.length === 0) {
            throw new Error('No ZK Account found for this wallet');
        }

        const zkAccountAddress = userAccounts[0];
        console.log('🏦 Using ZK Account:', zkAccountAddress);

        // Setup token contract with proper ABI
        const erc20Interface = new ethers.Interface([
            "function transfer(address to, uint256 amount) external returns (bool)",
            "function balanceOf(address account) external view returns (uint256)",
            "function decimals() external view returns (uint8)"
        ]);

        const tokenContract = new ethers.Contract(tokenAddress, erc20Interface, provider);

        // Check token balance in ZK Account
        const tokenBalance = await tokenContract.balanceOf(zkAccountAddress);
        const decimals = await tokenContract.decimals();
        const amountWei = ethers.parseUnits(amount, decimals);
        const tokenBalanceFormatted = ethers.formatUnits(tokenBalance, decimals);

        console.log('🪙 ZK Account Token Balance:', tokenBalanceFormatted);
        console.log('💸 Requested Amount:', amount);

        if (tokenBalance < amountWei) {
            throw new Error(`Insufficient token balance in ZK Account. Available: ${tokenBalanceFormatted}, Requested: ${amount}`);
        }

        // Check if owner wallet has enough ETH for gas fees
        const ownerBalance = await provider.getBalance(walletAddress);
        const ownerBalanceFormatted = ethers.formatEther(ownerBalance);
        const minGasBalance = ethers.parseEther('0.001'); // Minimum 0.001 ETH for gas

        if (ownerBalance < minGasBalance) {
            throw new Error(`Insufficient ETH for gas fees in owner wallet. Available: ${ownerBalanceFormatted} ETH, Need at least: 0.001 ETH`);
        }

        // Prepare transfer data using interface
        const transferData = erc20Interface.encodeFunctionData('transfer', [toAddress, amountWei]);

        // ZK Account V3 ABI for execution
        const zkAccountV3ABI = [
            "function execute(tuple(uint256[2] a, uint256[2][2] b, uint256[2] c, uint256[3] publicSignals) proof, address target, uint256 value, bytes data) external",
            "function getAccountInfo() external view returns (address, address, bool, uint256, uint256, uint256)",
            "function requiresZKProof() external view returns (bool)"
        ];

        const zkAccount = new ethers.Contract(zkAccountAddress, zkAccountV3ABI, signer);

        // Check if ZK proof is required
        const requiresZKProof = await zkAccount.requiresZKProof();
        console.log('🔒 Requires ZK Proof:', requiresZKProof);

        console.log('🚀 Attempting token transfer...');
        console.log('📍 From ZK Account:', zkAccountAddress);
        console.log('📍 To Address:', toAddress);
        console.log('💰 Amount:', amount);
        console.log('🪙 Token Address:', tokenAddress);

        let tx;

        if (requiresZKProof) {
            // Generate ZK proof for transfer
            console.log('🔒 Generating ZK proof for token transfer...');

            const response = await fetch('/api/zkp/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate ZK proof. Please ensure you are logged in with OAuth.');
            }

            const proofData = await response.json();

            console.log('🔍 Raw proof data received:', JSON.stringify(proofData, null, 2));

            if (!proofData.success) {
                throw new Error(proofData.error || 'Failed to generate ZK proof');
            }

            // Format proof for ZK Account V3 with proper structure validation
            const zkProof = {
                a: proofData.proof?.pi_a ? proofData.proof.pi_a.slice(0, 2) : [0, 0],
                b: proofData.proof?.pi_b ? [
                    proofData.proof.pi_b[0].slice(0).reverse(),
                    proofData.proof.pi_b[1].slice(0).reverse()
                ] : [[0, 0], [0, 0]],
                c: proofData.proof?.pi_c ? proofData.proof.pi_c.slice(0, 2) : [0, 0],
                publicSignals: proofData.publicSignals ? proofData.publicSignals.slice(0, 3) : [0, 0, 0]
            };

            console.log('✅ ZK proof generated successfully');
            console.log('🔍 Proof structure:', {
                a: zkProof.a,
                b: zkProof.b,
                c: zkProof.c,
                publicSignals: zkProof.publicSignals
            });
            // Execute with ZK proof
            try {
                const gasEstimate = await zkAccount.execute.estimateGas(zkProof, tokenAddress, 0, transferData);
                console.log('⛽ Gas estimate:', gasEstimate.toString());

                tx = await zkAccount.execute(zkProof, tokenAddress, 0, transferData, {
                    gasLimit: gasEstimate * BigInt(2)
                });
            } catch (estimateError) {
                console.error('❌ Gas estimation failed:', estimateError);

                // Check if error is due to proof already used or other contract revert
                if (estimateError instanceof Error && estimateError.message.includes('proof already used')) {
                    throw new Error('ZK proof has already been used. Please refresh the page and try again.');
                } else if (estimateError instanceof Error && estimateError.message.includes('execution reverted')) {
                    throw new Error('Transaction would fail: ' + estimateError.message);
                } else {
                    // Only fallback to default gas limit for gas estimation issues, not contract errors
                    throw estimateError;
                }
            }
        } else {
            // Execute without proof (if not required)
            const emptyProof = {
                a: [0, 0],
                b: [[0, 0], [0, 0]],
                c: [0, 0],
                publicSignals: [0, 0, 0]
            };

            try {
                const gasEstimate = await zkAccount.execute.estimateGas(emptyProof, tokenAddress, 0, transferData);
                tx = await zkAccount.execute(emptyProof, tokenAddress, 0, transferData, {
                    gasLimit: gasEstimate * BigInt(2)
                });
            } catch (estimateError) {
                if (estimateError instanceof Error && estimateError.message.includes('execution reverted')) {
                    throw new Error('Transaction would fail: ' + estimateError.message);
                }
                tx = await zkAccount.execute(emptyProof, tokenAddress, 0, transferData, {
                    gasLimit: 500000
                });
            }
        }

        // 🚀 IMMEDIATELY return transaction hash
        console.log('✅ Token transfer transaction sent!');
        console.log('🔗 Transaction hash:', tx.hash);

        return {
            success: true,
            transactionHash: tx.hash,
            newBalance: undefined // Will be updated after confirmation
        };

    } catch (error) {
        console.error('Token transfer error:', error);

        let errorMessage = 'Failed to transfer tokens: ';

        if (error instanceof Error) {
            if (error.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient funds for gas fees. Please ensure your wallet has enough ETH for gas.';
            } else if (error.message.includes('user rejected') || error.message.includes('denied')) {
                errorMessage = 'Transaction was rejected by user.';
            } else if (error.message.includes('unauthorized email hash')) {
                errorMessage = 'ZK proof required. Please ensure you are logged in with OAuth and try again.';
            } else if (error.message.includes('proof already used')) {
                errorMessage = 'ZK proof has already been used. Please refresh the page and try again.';
            } else {
                errorMessage += error.message;
            }
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}
