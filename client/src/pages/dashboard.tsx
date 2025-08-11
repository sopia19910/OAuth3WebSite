import {useState, useEffect} from "react";
import {useLocation} from "wouter";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Progress} from "@/components/ui/progress";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {
    CreditCardIcon,
    PaperAirplaneIcon,
    QrCodeIcon,
    PlusIcon,
    ClipboardIcon,
    WalletIcon,
    CogIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowPathIcon,
    XMarkIcon,
    Bars3Icon,
} from "@heroicons/react/24/outline";
import {SiGoogle} from "react-icons/si";
import Navbar from "@/components/navbar";
import QRCode from 'qrcode';
import { PricingModal } from "@/components/PricingModal";
import ethereumLogo from "@assets/image_1752985874370.png";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
    getWalletFromStorage,
    getWalletBalance,
    getNetworkInfo,
    getTokenBalance,
    type WalletInfo,
} from "@/lib/wallet";
import {ethers} from "ethers";
import {
    checkZKAccount,
    waitForTransaction,
    transferETHFromZKAccount,
    transferTokenFromZKAccount,
    type ZKAccountInfo,
    type TransferResult
} from "@/lib/zkAccount";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertProjectSchema, type InsertProject, type Chain } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Copy, Eye, EyeOff, RefreshCw, ExternalLink, Code, Zap, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {

    const [, setLocation] = useLocation();
    const {toast} = useToast();
    const [activeMenu, setActiveMenu] = useState<string>("overview");
    const [sendAmount, setSendAmount] = useState("");
    const [sendAddress, setSendAddress] = useState("");
    const [receiverType, setReceiverType] = useState("wallet"); // "wallet" or "gmail"
    const [resolvedWalletAddress, setResolvedWalletAddress] = useState("");
    const [isResolvingEmail, setIsResolvingEmail] = useState(false);
    const [emailResolveError, setEmailResolveError] = useState("");
    const [selectedToken, setSelectedToken] = useState("ETH");
    const [tokenAddress, setTokenAddress] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [customTokens, setCustomTokens] = useState<Array<{
        id?: number;
        address: string;
        symbol: string;
        name: string;
        userEmail?: string;
        createdAt?: Date | string;
    }>>([]);

    // Wallet and account state
    const [wallet, setWallet] = useState<WalletInfo | null>(null);
    const [walletBalance, setWalletBalance] = useState("0.0");
    const [zkAccountInfo, setZkAccountInfo] = useState<ZKAccountInfo | null>(
        null,
    );
    const [networkName, setNetworkName] = useState("Loading...");
    const [userEmail, setUserEmail] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Token balances state
    const [tokenBalances, setTokenBalances] = useState<Record<string, { balance: string; formatted: string }>>({});

    // Send transaction state
    const [isSending, setIsSending] = useState(false);
    const [sendProgress, setSendProgress] = useState(0);
    const [sendStatus, setSendStatus] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const [sendError, setSendError] = useState("");

    // Refresh state
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Logout state
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Configuration state
    const [config, setConfig] = useState<any>(null);

    // QR Code state
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

    // Chain state
    const [chains, setChains] = useState<any[]>([]);
    const [selectedChainId, setSelectedChainId] = useState<string>("");
    const [zkAccountsOnChains, setZkAccountsOnChains] = useState<Record<string, boolean>>({});
    
    // API Application state
    const [apiStep, setApiStep] = useState<"form" | "success">("form");
    const [projectResult, setProjectResult] = useState<any>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [createSandbox, setCreateSandbox] = useState(true);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    
    // API Application form
    const apiForm = useForm<InsertProject>({
        resolver: zodResolver(insertProjectSchema),
        defaultValues: {
            name: "",
            description: "",
            owner: "",
            purpose: "web",
            callbackDomains: [],
            ipWhitelist: [],
            defaultChainId: 1,
            gasSponsorEnabled: false,
            gasDailyLimit: "0",
            dailyTransferLimit: 100,
            dailyAmountLimit: "1000",
            allowedChains: [1],
            webhookUrl: "",
        },
    });
    
    // API Application mutations
    const createProjectMutation = useMutation({
        mutationFn: async (data: InsertProject & { acceptedTerms: boolean; createSandbox: boolean }) => {
            return await apiRequest("/api/projects", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: (data) => {
            setProjectResult(data);
            setApiStep("success");
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({
                title: "Project Created Successfully",
                description: "Your API key has been generated. Make sure to copy it now!",
            });
        },
        onError: (error) => {
            toast({
                title: "Error Creating Project",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const regenerateKeyMutation = useMutation({
        mutationFn: async (projectId: string) => {
            return await apiRequest(`/api/projects/${projectId}/regenerate-key`, {
                method: "POST",
            });
        },
        onSuccess: (data) => {
            setProjectResult({ ...projectResult, apiKey: data.apiKey });
            toast({
                title: "API Key Regenerated",
                description: "New API key generated successfully",
            });
        },
    });

    const onApiFormSubmit = (data: InsertProject) => {
        if (!acceptedTerms) {
            toast({
                title: "Terms Required",
                description: "Please accept the terms and conditions",
                variant: "destructive",
            });
            return;
        }

        // Open pricing modal instead of directly creating project
        setShowPricingModal(true);
    };

    const handlePlanSelection = (plan: string) => {
        setSelectedPlan(plan);
        setShowPricingModal(false);
        
        // Get the form data and submit with selected plan
        const formData = apiForm.getValues();
        
        // Set API calls limit based on plan
        const apiCallsLimit = plan === 'starter' ? 1000 : plan === 'team' ? 100000 : 500000;
        
        createProjectMutation.mutate({
            ...formData,
            selectedPlan: plan,
            apiCallsLimit: apiCallsLimit,
            acceptedTerms,
            createSandbox,
        });
        
        // Store the selected plan for future reference
        localStorage.setItem(`project_${formData.name}_plan`, plan);
        
        toast({
            title: "Plan Selected",
            description: `You selected the ${plan} plan. Your project will be reviewed by our team.`,
        });
    };
    
    // Load wallet and account data on component mount
    useEffect(() => {
        // Load chains first, then wallet data
        const loadInitialData = async () => {
            await loadChains();
            // Don't load wallet data here - let it be triggered by selectedChainId change
        };
        loadInitialData();
    }, []);

    // Load wallet data when chains are loaded and selectedChainId is set
    useEffect(() => {
        if (selectedChainId && chains.length > 0) {
            console.log('🔄 Loading wallet data for chain:', selectedChainId);
            loadWalletData();
            loadTokensFromDB();
        }
    }, [selectedChainId, chains.length]);

    // Check for ZK Accounts on all chains when wallet is loaded
    useEffect(() => {
        if (wallet && chains.length > 0) {
            checkZKAccountsOnAllChains();
        }
    }, [wallet, chains]);

    // Generate QR code when zkAccountInfo changes
    useEffect(() => {
        if (zkAccountInfo?.zkAccountAddress) {
            QRCode.toDataURL(zkAccountInfo.zkAccountAddress, {
                width: 192,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })
                .then((url) => {
                    setQrCodeDataUrl(url);
                })
                .catch((err) => {
                    console.error('Error generating QR code:', err);
                });
        }
    }, [zkAccountInfo]);

    // Refresh balance when selected chain changes with debouncing
    useEffect(() => {
        if (!wallet || !selectedChainId || chains.length === 0) return;

        // Reset selected token to ETH when chain changes
        setSelectedToken('ETH');
        
        // Add debouncing to prevent rapid chain switching issues
        const timeoutId = setTimeout(async () => {
            // Reload configuration for the new chain
            try {
                const configUrl = selectedChainId ? `/api/config?chainId=${selectedChainId}` : "/api/config";
                const configResponse = await fetch(configUrl);
                const configData = await configResponse.json();
                if (configData.success) {
                    setConfig(configData);
                }
            } catch (error) {
                console.error("Failed to load config for chain:", selectedChainId, error);
            }
            
            refreshAccountData();
            loadTokensFromDB(); // Also reload tokens for the new chain
        }, 300); // 300ms debounce

        // Cleanup function to cancel pending refreshes
        return () => {
            clearTimeout(timeoutId);
        };
    }, [selectedChainId, wallet?.address, chains.length]);
    
    // Load token balances when zkAccount, tokens or chain changes
    useEffect(() => {
        if (!wallet || !zkAccountInfo?.zkAccountAddress || customTokens.length === 0 || !selectedChainId || chains.length === 0) return;
        
        const selectedChain = chains.find(chain => chain.chainId.toString() === selectedChainId);
        if (selectedChain) {
            loadTokenBalances(customTokens, selectedChain.chainId.toString());
        }
    }, [zkAccountInfo?.zkAccountAddress, customTokens, selectedChainId]);

    const loadChains = async () => {
        try {
            const response = await fetch('/api/chains');
            if (response.ok) {
                const data = await response.json();
                setChains(data.chains || []);
                // Find the active chain and set it as selected
                const activeChain = data.chains?.find((chain: any) => chain.isActive);
                if (activeChain) {
                    setSelectedChainId(activeChain.chainId.toString());
                    setNetworkName(activeChain.networkName);
                }
            }
        } catch (error) {
            console.error('Failed to load chains:', error);
        }
    };

    const checkZKAccountsOnAllChains = async () => {
        if (!wallet) return;
        
        const zkAccounts: Record<string, boolean> = {};
        
        // Check each chain in parallel
        const checkPromises = chains.map(async (chain) => {
            try {
                const zkInfo = await checkZKAccount(wallet.address, chain.chainId.toString());
                return { chainId: chain.chainId.toString(), hasZKAccount: zkInfo.hasZKAccount };
            } catch (error) {
                console.error(`Failed to check ZK account on ${chain.networkName}:`, error);
                return { chainId: chain.chainId.toString(), hasZKAccount: false };
            }
        });
        
        const results = await Promise.all(checkPromises);
        
        // Update state with results
        results.forEach(result => {
            zkAccounts[result.chainId] = result.hasZKAccount;
        });
        
        setZkAccountsOnChains(zkAccounts);
        
        // If current chain doesn't have ZK Account but another does, suggest switching
        const currentHasZKAccount = zkAccounts[selectedChainId];
        const chainWithZKAccount = Object.entries(zkAccounts).find(([_, hasZK]) => hasZK);
        
        if (!currentHasZKAccount && chainWithZKAccount) {
            const chainId = chainWithZKAccount[0];
            const chain = chains.find(c => c.chainId.toString() === chainId);
            if (chain) {
                console.log(`💡 ZK Account found on ${chain.networkName}. Consider switching to that chain.`);
            }
        }
    };

    const loadTokensFromDB = async () => {
        if (!selectedChainId || chains.length === 0) return;
        
        try {
            // Get the actual chain ID (not database ID)
            const selectedChain = chains.find(chain => chain.chainId.toString() === selectedChainId);
            if (!selectedChain) return;

            const response = await fetch(`/api/tokens?chainId=${selectedChain.chainId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCustomTokens(data.tokens);
                    // Load balances for the tokens
                    if (wallet && zkAccountInfo?.zkAccountAddress) {
                        loadTokenBalances(data.tokens, selectedChain.chainId.toString());
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load tokens from DB:', error);
        }
    };
    
    const loadTokenBalances = async (tokens: typeof customTokens, chainId: string) => {
        if (!wallet || !zkAccountInfo?.zkAccountAddress) return;
        
        const balances: Record<string, { balance: string; formatted: string }> = {};
        
        // Load balances for all tokens in parallel using ZK Account address
        const balancePromises = tokens.map(async (token) => {
            try {
                // Use ZK Account address instead of wallet address
                const result = await getTokenBalance(token.address, zkAccountInfo.zkAccountAddress!, chainId);
                return { address: token.address, balance: result.balance, formatted: result.formatted };
            } catch (error) {
                console.error(`Failed to get balance for ${token.symbol}:`, error);
                return { address: token.address, balance: '0', formatted: '0' };
            }
        });
        
        const results = await Promise.all(balancePromises);
        
        // Update state with all balances
        results.forEach(result => {
            balances[result.address] = { balance: result.balance, formatted: result.formatted };
        });
        
        setTokenBalances(balances);
    };

    const loadWalletData = async () => {
        try {
            // First check if OAuth session is valid
            console.log("🔍 Checking OAuth session validity...");
            try {
                const userResponse = await fetch("/api/auth/me");
                const userData = await userResponse.json();

                if (!userData.success || !userData.user?.email) {
                    console.log(
                        "❌ Invalid or expired OAuth session. Redirecting to demo...",
                    );
                    alert("Session expired or invalid. Please login again.");
                    setLocation("/personalservice");
                    return;
                }

                // Valid session - continue with loading
                console.log("✅ Valid OAuth session for:", userData.user.email);
                setUserEmail(userData.user.email);
                localStorage.setItem("oauth3_user_email", userData.user.email);
            } catch (error) {
                console.error("Failed to validate OAuth session:", error);
                alert("Failed to validate session. Please login again.");
                setLocation("/personalservice");
                return;
            }

            // Get wallet from storage
            const savedWallet = getWalletFromStorage();
            if (savedWallet) {
                setWallet(savedWallet);

                // Get wallet balance using active chain if available
                if (selectedChainId && chains.length > 0) {
                    const selectedChain = chains.find(chain => chain.chainId.toString() === selectedChainId);
                    if (selectedChain) {
                        const provider = new ethers.JsonRpcProvider(selectedChain.rpcUrl);
                        const balance = await getWalletBalance(savedWallet.address, provider);
                        setWalletBalance(balance.formatted);
                    } else {
                        const balance = await getWalletBalance(savedWallet.address);
                        setWalletBalance(balance.formatted);
                    }
                } else {
                    const balance = await getWalletBalance(savedWallet.address);
                    setWalletBalance(balance.formatted);
                }

                // Check for ZK Account on the selected chain (only if chain is selected)
                if (selectedChainId) {
                    const zkInfo = await checkZKAccount(savedWallet.address, selectedChainId);
                    setZkAccountInfo(zkInfo);
                }
            }

            // Get network info and config
            const networkInfo = await getNetworkInfo();
            setNetworkName(networkInfo.name === 'unknown' ? 'Holesky Testnet' : networkInfo.name);
            // Load configuration for selected chain
            const configUrl = selectedChainId ? `/api/config?chainId=${selectedChainId}` : "/api/config";
            const configResponse = await fetch(configUrl);
            const configData = await configResponse.json();
            if (configData.success) {
                setConfig(configData);
            }
        } catch (error) {
            console.error("Failed to load wallet data:", error);
        }
    };

    const refreshAccountData = async () => {
        if (!wallet || isRefreshing) return; // Prevent multiple concurrent refreshes

        setIsRefreshing(true);
        try {
            // Get the selected chain
            const selectedChain = chains.find(chain => chain.chainId.toString() === selectedChainId);
            if (!selectedChain) {
                console.error("Selected chain not found");
                return;
            }

            // Create provider for the selected chain
            const provider = new ethers.JsonRpcProvider(selectedChain.rpcUrl);

            // Run balance and ZK account checks in parallel for better performance
            try {
                const [balance, zkInfo] = await Promise.all([
                    getWalletBalance(wallet.address, provider),
                    checkZKAccount(wallet.address, selectedChainId)
                ]);

                // Update states only after both operations complete
                setWalletBalance(balance.formatted);
                setZkAccountInfo(zkInfo);

                console.log(`✅ Account data refreshed for ${selectedChain.networkName}`);
                console.log(`💰 Balance: ${balance.formatted} ETH`);
                console.log(`🔐 ZK Account: ${zkInfo.hasZKAccount ? 'Yes' : 'No'}`);
                
                // Also reload tokens for the selected chain and their balances
                await loadTokensFromDB();
            } catch (err) {
                console.error("Error during parallel fetch:", err);
                // Try sequential fetch as fallback
                const balance = await getWalletBalance(wallet.address, provider);
                setWalletBalance(balance.formatted);

                try {
                    const zkInfo = await checkZKAccount(wallet.address, selectedChainId);
                    setZkAccountInfo(zkInfo);
                } catch (zkError) {
                    console.error("Failed to check ZK account:", zkError);
                    // Set default ZK info if check fails
                    setZkAccountInfo({
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
                    });
                }
            }
        } catch (error) {
            console.error("Failed to refresh account data:", error);
            toast({
                title: "Failed to refresh",
                description: "Could not refresh account data. Please try again.",
                variant: "destructive",
                duration: 2000,
            });
        } finally {
            setIsRefreshing(false);
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: "Copied!",
                description: `${label} copied to clipboard`,
                duration: 2000,
            });
        } catch (err) {
            console.error("Failed to copy: ", err);
            toast({
                title: "Failed to copy",
                description: `Could not copy ${label}`,
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    const handleAddToken = async () => {
        // Validate inputs
        if (!tokenAddress || !tokenSymbol || !tokenName) {
            toast({
                title: "Missing Information",
                description: "Please fill in all token details",
                variant: "destructive",
                duration: 2000,
            });
            return;
        }

        // Validate Ethereum address format
        if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
            toast({
                title: "Invalid Address",
                description: "Please enter a valid Ethereum address",
                variant: "destructive",
                duration: 2000,
            });
            return;
        }

        // Check if token already exists
        const tokenExists = customTokens.some(token =>
            token.address.toLowerCase() === tokenAddress.toLowerCase()
        );

        if (tokenExists) {
            toast({
                title: "Token Already Added",
                description: `${tokenSymbol} is already in your token list`,
                variant: "destructive",
                duration: 2000,
            });
            return;
        }

        try {
            // Get the actual chain ID (not database ID)
            const selectedChain = chains.find(chain => chain.chainId.toString() === selectedChainId);
            if (!selectedChain) {
                toast({
                    title: "No Chain Selected",
                    description: "Please select a chain first",
                    variant: "destructive",
                    duration: 2000,
                });
                return;
            }

            // Save to database
            const response = await fetch('/api/tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: tokenAddress,
                    symbol: tokenSymbol.toUpperCase(),
                    name: tokenName,
                    chainId: selectedChain.chainId
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                toast({
                    title: "Failed to Add Token",
                    description: data.error || "Unable to save token",
                    variant: "destructive",
                    duration: 2000,
                });
                return;
            }

            // Update local state
            setCustomTokens([...customTokens, data.token]);

            // Clear form
            setTokenAddress("");
            setTokenSymbol("");
            setTokenName("");

            toast({
                title: "Token Added",
                description: `${tokenSymbol.toUpperCase()} has been added to your token list`,
                duration: 2000,
            });
        } catch (error) {
            console.error("Failed to add token:", error);
            toast({
                title: "Error",
                description: "Failed to add token. Please try again.",
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            console.log('🚪 Logging out...');
            // Call logout API
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                console.log("✅ Logout successful");

                // Clear local storage
                localStorage.removeItem("oauth3_user_email");
                localStorage.removeItem("oauth3_wallet");
                // Redirect to home page
                setLocation("/");
            } else {
                console.error("❌ Logout failed:", data.error);
                alert("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("❌ Logout error:", error);
            alert("Failed to logout. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Helper function to generate email hash using keccak256(abi.encodePacked(email))
    const generateEmailHash = (email: string): string => {
        // Using ethers.utils.solidityKeccak256 to mimic abi.encodePacked behavior
        return ethers.keccak256(ethers.toUtf8Bytes(email));
    };

    // Helper function to validate inputs based on receiver type
    const validateRecipientInput = (input: string, type: string): boolean => {
        if (type === "wallet") {
            // Validate Ethereum address format
            return ethers.isAddress(input);
        } else if (type === "gmail") {
            // Validate Gmail address format
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            return gmailRegex.test(input);
        }
        return false;
    };

    // Function to resolve gmail address to wallet address using OAuth naming service
    const resolveGmailToWallet = async (email: string): Promise<string> => {
        if (!config) {
            throw new Error("Configuration not loaded");
        }

        console.log('🔧 Full config object:', config);
        const emailHash = generateEmailHash(email);
        console.log('📧 Email hash generated:', emailHash);
        
        // Get OAuth naming service contract address from config
        const oauthNamingServiceAddress = config.oauthNamingService;
        console.log('🏭 OAuth naming service address from config:', oauthNamingServiceAddress);
        if (!oauthNamingServiceAddress) {
            throw new Error("OAuth naming service not configured for this network");
        }

        // Create ethers provider and contract instance
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);
        const oauthNamingServiceABI = [
            "function getZkAccountByEmail(bytes32 emailHash) external view returns (address)"
        ];
        const oauthNamingContract = new ethers.Contract(
            oauthNamingServiceAddress,
            oauthNamingServiceABI,
            provider
        );

        // Call getZkAccountByEmail
        const walletAddress = await oauthNamingContract.getZkAccountByEmail(emailHash);
        
        if (walletAddress === ethers.ZeroAddress) {
            throw new Error(`No ZK Account found for email: ${email}`);
        }

        console.log('✅ Gmail resolved to wallet:', walletAddress);
        return walletAddress;
    };

    // Function to handle email input and resolve wallet address in real-time
    const handleEmailInput = async (email: string) => {
        setSendAddress(email);
        setResolvedWalletAddress("");
        setEmailResolveError("");

        if (!email || !validateRecipientInput(email, "gmail")) {
            return;
        }

        setIsResolvingEmail(true);
        try {
            const walletAddress = await resolveGmailToWallet(email);
            setResolvedWalletAddress(walletAddress);
        } catch (error) {
            console.error('Error resolving email:', error);
            setEmailResolveError(error instanceof Error ? error.message : 'Failed to resolve email');
        } finally {
            setIsResolvingEmail(false);
        }
    };

    // Reset resolved address when receiver type changes
    const handleReceiverTypeChange = (type: string) => {
        setReceiverType(type);
        setResolvedWalletAddress("");
        setEmailResolveError("");
        setSendAddress("");
    };

    const handleSendTransaction = async () => {
        if (!wallet || !zkAccountInfo?.hasZKAccount) {
            setSendError("No wallet or ZK Account found");
            return;
        }

        if (!sendAddress || !sendAmount || parseFloat(sendAmount) <= 0) {
            setSendError("Please fill in all required fields with valid values");
            return;
        }

        // Validate recipient input based on receiver type
        if (!validateRecipientInput(sendAddress, receiverType)) {
            setSendError(
                receiverType === "wallet" 
                    ? "Please enter a valid Ethereum wallet address" 
                    : "Please enter a valid Gmail address"
            );
            return;
        }

        setIsSending(true);
        setSendProgress(0);
        setSendStatus("Initializing transaction...");
        setSendError("");
        setTransactionHash("");
        try {
            // Step 1: Validate inputs (25%)
            setSendProgress(25);
            setSendStatus("Validating transaction details...");

            // Step 2: Use resolved address or resolve if needed (30%)
            let recipientAddress = sendAddress;
            if (receiverType === "gmail") {
                if (resolvedWalletAddress) {
                    // Use already resolved address
                    recipientAddress = resolvedWalletAddress;
                } else {
                    // Resolve if not already done
                    setSendProgress(30);
                    setSendStatus("Resolving Gmail to wallet address...");
                    recipientAddress = await resolveGmailToWallet(sendAddress);
                }
            }

            // Step 3: Prepare transfer (50%)
            setSendProgress(50);
            setSendStatus("Preparing transaction...");

            let result: TransferResult;

            if (selectedToken === "ETH") {
                result = await transferETHFromZKAccount(
                    wallet.privateKey,
                    wallet.address,
                    recipientAddress,
                    sendAmount,
                    selectedChainId
                );
            } else {
                // For all other tokens, use the generic token transfer function
                result = await transferTokenFromZKAccount(
                    wallet.privateKey,
                    wallet.address,
                    recipientAddress,
                    sendAmount,
                    selectedToken,
                    selectedChainId
                );
            }

            if (!result.success) {
                throw new Error(result.error || "Transfer failed");
            }

            // Step 3: Transaction sent (75%) - Show hash immediately
            setSendProgress(75);
            if (result.transactionHash) {
                setTransactionHash(result.transactionHash);
                setSendStatus(`Transaction sent! Hash: ${result.transactionHash.slice(0, 10)}...`);

                // Step 4: Wait for confirmation (100%) - Run in background
                setSendStatus('Waiting for transaction confirmation...');

                // Wait for confirmation without blocking the UI
                waitForTransaction(result.transactionHash).then((receipt) => {
                    if (receipt) {
                        setSendProgress(100);
                        setSendStatus('Transaction confirmed successfully!');

                        // Refresh account data
                        setTimeout(() => {
                            refreshAccountData();
                        }, 2000);

                        // Clear form
                        setTimeout(() => {
                            setSendAmount('');
                            setSendAddress('');
                            setIsSending(false);
                            setSendProgress(0);
                            setSendStatus('');
                            setTransactionHash('');
                        }, 5000);
                    } else {
                        setSendProgress(100);
                        setSendStatus('Transaction sent but confirmation timed out. Check explorer for status.');

                        // Still clear form after timeout
                        setTimeout(() => {
                            setSendAmount('');
                            setSendAddress('');
                            setIsSending(false);
                            setSendProgress(0);
                            setSendStatus('');
                            setTransactionHash('');
                        }, 5000);
                    }
                }).catch((error) => {
                    console.error('Error waiting for transaction:', error);
                    setSendProgress(100);
                    setSendStatus('Transaction sent but confirmation failed. Check explorer for status.');
                });

                // Set to 100% immediately so user sees the hash
                setSendProgress(100);
            } else {
                // No transaction hash (probably failed before sending)
                throw new Error(result.error || "Transaction failed to send");
            }
        } catch (error) {
            console.error("Send transaction error:", error);
            setSendError(
                error instanceof Error ? error.message : "Unknown error occurred",
            );
            setSendStatus("");
            setTimeout(() => {
                setIsSending(false);
                setSendProgress(0);
            }, 3000);
        }
    };

    const renderMainContent = () => {
        switch (activeMenu) {
            case "overview":
                return (
                    <div className="space-y-6">
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-foreground">
                                    Account Overview
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={refreshAccountData}
                                    disabled={isRefreshing}
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted/10 border border-gray-500 w-7 h-7 p-0 flex items-center justify-center"
                                >
                                    <ArrowPathIcon
                                        className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                                    />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                            {/* Web2 OAuth Account */}
                            <Card className="bg-card border-border rounded-none">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">
                                        Web2 OAuth Account
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Provider
                                        </Label>
                                        <p className="text-sm text-foreground mt-1">
                                            Google OAuth 2.0
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Authentication Status
                                        </Label>
                                        <p className="text-sm text-green-500 mt-1">✓ Verified</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Web3 Account */}
                            <Card className="bg-card border-border rounded-none">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">
                                        Web3 Account
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            ETH Balance
                                        </Label>
                                        <p className="text-sm text-foreground mt-1">
                                            {walletBalance} <span
                                            className="text-xs text-muted-foreground border border-gray-500 px-1 rounded">ETH</span>
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Network
                                        </Label>
                                        <p className="text-sm text-foreground mt-1">
                                            {networkName}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Address
                                        </Label>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs font-mono text-foreground break-all">
                                                {wallet?.address || "No wallet"}
                                            </p>
                                            {wallet?.address && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        copyToClipboard(wallet.address, "Owner Address")
                                                    }
                                                    className="p-0.5 h-auto hover:bg-muted/50"
                                                >
                                                    <ClipboardIcon className="w-3 h-3"/>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ZKP Smart Contract */}
                            <Card
                                className={`bg-card border-border rounded-none ${!zkAccountInfo?.hasZKAccount ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">
                                        ZKP Smart Contract (CA)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            ETH Balance
                                        </Label>
                                        <p className="text-sm text-foreground mt-1">
                                            {zkAccountInfo?.balance || "0"} <span
                                            className="text-xs text-muted-foreground border border-gray-500 px-1 rounded">ETH</span>
                                        </p>
                                    </div>
                                    
                                    {/* Token Balances from ZK Account */}
                                    {customTokens.length > 0 && zkAccountInfo?.hasZKAccount && (
                                        <div>
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Token Balances
                                            </Label>
                                            <div className="mt-1 space-y-1">
                                                {customTokens.map((token) => (
                                                    <p key={token.address} className="text-sm text-foreground">
                                                        {tokenBalances[token.address]?.formatted || '0'} <span
                                                        className="text-xs text-muted-foreground border border-gray-500 px-1 rounded">{token.symbol}</span>
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            ZKP Status
                                        </Label>
                                        <p className="text-sm text-green-500 mt-1">
                                            {zkAccountInfo?.hasZKAccount
                                                ? "✓ Active"
                                                : "⚠️ Not Created"}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Contract Address
                                        </Label>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs font-mono text-foreground break-all">
                                                {zkAccountInfo?.zkAccountAddress || "Not available"}
                                            </p>
                                            {zkAccountInfo?.zkAccountAddress && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            zkAccountInfo.zkAccountAddress!,
                                                            "ZK Contract Address",
                                                        )
                                                    }
                                                    className="p-0.5 h-auto hover:bg-muted/50"
                                                >
                                                    <ClipboardIcon className="w-3 h-3"/>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ZKP CA Creation Warning */}
                        {!zkAccountInfo?.hasZKAccount && (
                            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-destructive" viewBox="0 0 20 20"
                                             fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-destructive">
                                            ZKP Contract Account Not Created
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Your ZKP Contract Account has not been created on the {networkName} network.
                                            {Object.entries(zkAccountsOnChains).filter(([chainId, hasZK]) => hasZK && chainId !== selectedChainId).length > 0 && (
                                                <span className="block mt-2 text-xs text-primary">
                                                    💡 You have ZKP accounts on: {Object.entries(zkAccountsOnChains)
                                                        .filter(([chainId, hasZK]) => hasZK && chainId !== selectedChainId)
                                                        .map(([chainId]) => {
                                                            const chain = chains.find(c => c.id.toString() === chainId);
                                                            return chain?.networkName || 'Unknown';
                                                        })
                                                        .join(', ')}
                                                </span>
                                            )}
                                            To create your ZKP CA on this network, please go to the <a
                                            href={`/personalservice?from=dashboard&chainId=${selectedChainId}`}
                                            className="underline hover:text-foreground">Personal Service page</a> and
                                            complete the ZKP generation process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "add-token":
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Left Column - Added Tokens List */}
                        <div className="space-y-4">
                            <h2 className="text-base font-semibold">Added Tokens</h2>
                            {customTokens.length > 0 ? (
                                <div className="space-y-2">
                                    {customTokens.map((token) => (
                                        <div
                                            key={token.id || token.address}
                                            className="flex items-center justify-between p-3 border border-border rounded bg-card/50"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{token.symbol}</p>
                                                <p className="text-xs text-muted-foreground">{token.name}</p>
                                                <p className="text-xs text-muted-foreground font-mono mt-1">
                                                    {token.address}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={async () => {
                                                    try {
                                                        const response = await fetch(`/api/tokens/${token.id}`, {
                                                            method: 'DELETE',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            }
                                                        });

                                                        const data = await response.json();

                                                        if (response.ok && data.success) {
                                                            // Update local state
                                                            const updatedTokens = customTokens.filter(
                                                                t => t.id !== token.id
                                                            );
                                                            setCustomTokens(updatedTokens);

                                                            toast({
                                                                title: "Token Removed",
                                                                description: `${token.symbol} has been removed`,
                                                                duration: 2000,
                                                            });
                                                        } else {
                                                            toast({
                                                                title: "Failed to Remove Token",
                                                                description: data.error || "Unable to remove token",
                                                                variant: "destructive",
                                                                duration: 2000,
                                                            });
                                                        }
                                                    } catch (error) {
                                                        console.error("Failed to remove token:", error);
                                                        toast({
                                                            title: "Error",
                                                            description: "Failed to remove token. Please try again.",
                                                            variant: "destructive",
                                                            duration: 2000,
                                                        });
                                                    }
                                                }}
                                                className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:border-destructive/20 border border-gray-500 w-7 h-7 p-0 flex items-center justify-center"
                                            >
                                                <XMarkIcon className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 border border-border rounded bg-card/50 text-center">
                                    <p className="text-sm text-muted-foreground">No tokens added yet</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Add Token Form */}
                        <div className="space-y-6">
                            <h2 className="text-base font-semibold flex items-center gap-2">
                                <PlusIcon className="w-5 h-5"/>
                                Add Token
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="token-address"
                                        className="text-sm font-medium"
                                    >
                                        Token Contract Address
                                    </Label>
                                    <Input
                                        id="token-address"
                                        placeholder="0x..."
                                        value={tokenAddress}
                                        onChange={(e) => setTokenAddress(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="token-symbol" className="text-sm font-medium">
                                        Token Symbol
                                    </Label>
                                    <Input
                                        id="token-symbol"
                                        placeholder="e.g., USDC"
                                        value={tokenSymbol}
                                        onChange={(e) => setTokenSymbol(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="token-name" className="text-sm font-medium">
                                        Token Name
                                    </Label>
                                    <Input
                                        id="token-name"
                                        placeholder="e.g., USD Coin"
                                        value={tokenName}
                                        onChange={(e) => setTokenName(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90"
                                    onClick={handleAddToken}
                                >
                                    Add Token
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case "send":
                return (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ArrowUpIcon className="w-5 h-5"/>
                            <h2 className="text-lg font-semibold">Send Coin/Token</h2>
                        </div>
                        <div>
                            <Label className="text-sm font-medium mb-3 block">
                                Receiver Type
                            </Label>
                            <RadioGroup value={receiverType} onValueChange={handleReceiverTypeChange} className="flex gap-6 mb-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="wallet" id="wallet" />
                                    <Label htmlFor="wallet" className="cursor-pointer">Wallet Address</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="gmail" id="gmail" />
                                    <Label htmlFor="gmail" className="cursor-pointer">Gmail Address</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div>
                            <Label htmlFor="recipient" className="text-sm font-medium">
                                {receiverType === "wallet" ? "Recipient Wallet Address" : "Recipient Gmail Address"}
                            </Label>
                            <Input
                                id="recipient"
                                placeholder={receiverType === "wallet" ? "0x..." : "example@gmail.com"}
                                value={sendAddress}
                                onChange={(e) => {
                                    if (receiverType === "gmail") {
                                        handleEmailInput(e.target.value);
                                    } else {
                                        setSendAddress(e.target.value);
                                    }
                                }}
                                className="mt-1"
                                type={receiverType === "gmail" ? "email" : "text"}
                            />
                            {receiverType === "gmail" && (
                                <div className="mt-2">
                                    {isResolvingEmail && (
                                        <div className="text-sm text-blue-600 flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                            Resolving email to wallet address...
                                        </div>
                                    )}
                                    {resolvedWalletAddress && (
                                        <div className="text-sm text-green-600">
                                            ✅ Resolved to: <span className="font-mono">{resolvedWalletAddress}</span>
                                        </div>
                                    )}
                                    {emailResolveError && (
                                        <div className="text-sm text-red-600">
                                            ⚠️ {emailResolveError}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="token-select" className="text-sm font-medium">
                                Select Token
                            </Label>
                            <Select
                                value={selectedToken}
                                onValueChange={setSelectedToken}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select a token"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                                    {customTokens.map((token) => (
                                        <SelectItem key={token.id || token.address} value={token.address}>
                                            {token.symbol} - {token.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="amount" className="text-sm font-medium">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0.00"
                                value={sendAmount}
                                onChange={(e) => setSendAmount(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        {isSending && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">
                    {sendProgress}%
                  </span>
                                </div>
                                <Progress value={sendProgress} className="w-full"/>

                                <div className="text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        {sendStatus}
                                    </p>
                                    {transactionHash && (
                                        <div className="space-y-2">
                                            <div className="p-3 bg-muted rounded-lg">
                                                <p className="text-xs text-muted-foreground mb-1">
                                                    Transaction Hash:
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-mono text-foreground break-all flex-1 mr-2">
                                                        {transactionHash}
                                                    </p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                transactionHash,
                                                                "Transaction Hash",
                                                            )
                                                        }
                                                        className="p-1 h-auto hover:bg-background"
                                                    >
                                                        <ClipboardIcon className="w-3 h-3"/>
                                                    </Button>
                                                </div>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const selectedChain = chains.find(chain => chain.chainId.toString() === selectedChainId);
                                                    const explorerUrl = selectedChain?.explorerUrl || "https://etherscan.io";
                                                    window.open(
                                                        `${explorerUrl}/tx/${transactionHash}`,
                                                        "_blank",
                                                    );
                                                }}
                                                className="w-full"
                                            >
                                                View on Explorer
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {sendError && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive">{sendError}</p>
                            </div>
                        )}

                        <Button
                            onClick={handleSendTransaction}
                            disabled={isSending || !zkAccountInfo?.hasZKAccount}
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isSending
                                ? "Sending..."
                                : !zkAccountInfo?.hasZKAccount
                                    ? "No ZK Account Found"
                                    : "Send Transaction"}
                        </Button>
                    </div>
                );

            case "receive":
                return (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ArrowDownIcon className="w-5 h-5"/>
                            <h2 className="text-lg font-semibold">Receive Coin/Token</h2>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">
                                ZKP Contract Account Address
                            </Label>
                            <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                                <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                                    {zkAccountInfo?.zkAccountAddress || "No ZKP account available"}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            zkAccountInfo?.zkAccountAddress || "",
                                            "ZKP Contract Account Address",
                                        )
                                    }
                                    className="p-1 h-auto hover:bg-background"
                                    disabled={!zkAccountInfo?.zkAccountAddress}
                                >
                                    <ClipboardIcon
                                        className="w-4 h-4 text-muted-foreground hover:text-foreground"
                                        strokeWidth={1}
                                    />
                                </Button>
                            </div>
                        </div>
                        <div className="text-center">
                            <Label className="text-sm font-medium">QR Code</Label>
                            <div className="mt-2 flex justify-center">
                                {zkAccountInfo?.zkAccountAddress && qrCodeDataUrl ? (
                                    <img
                                        src={qrCodeDataUrl}
                                        alt="ZKP Account QR Code"
                                        className="w-48 h-48 rounded-lg"
                                    />
                                ) : (
                                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                                        <QrCodeIcon className="w-24 h-24 text-muted-foreground"/>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Scan this QR code to send tokens to your ZKP Contract Account
                            </p>
                        </div>
                    </div>
                );

            case "api-application":
                return (
                    <div className="space-y-6">
                        {apiStep === "form" ? (
                            <>
                                {/* Hero Section */}
                                <div className="text-center mb-8">
                                    <h1 className="text-4xl font-bold mb-4">OAuth3 Account & Transfer API</h1>
                                    <p className="text-lg text-muted-foreground">
                                        Integrate secure account management and token transfers with our powerful API
                                    </p>
                                </div>

                                {/* Form */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create New API Project</CardTitle>
                                        <CardDescription>
                                            Fill in the details to get your API key and start building
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            console.log("Form submit event triggered");
                                            console.log("Form is valid:", apiForm.formState.isValid);
                                            console.log("Form errors:", apiForm.formState.errors);
                                            console.log("Form values:", apiForm.getValues());
                                            apiForm.handleSubmit(onApiFormSubmit)(e);
                                        }} className="space-y-6">
                                            <div className="grid gap-6">
                                                <div>
                                                    <Label htmlFor="name">Project Name *</Label>
                                                    <Input
                                                        id="name"
                                                        placeholder="e.g., My DeFi App"
                                                        {...apiForm.register("name")}
                                                        className="mt-1"
                                                    />
                                                    {apiForm.formState.errors.name && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            {apiForm.formState.errors.name.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="description">Description *</Label>
                                                    <Textarea
                                                        id="description"
                                                        placeholder="Describe what your project does..."
                                                        rows={3}
                                                        {...apiForm.register("description")}
                                                        className="mt-1"
                                                    />
                                                    {apiForm.formState.errors.description && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            {apiForm.formState.errors.description.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="owner">Owner Email *</Label>
                                                    <Input
                                                        id="owner"
                                                        type="email"
                                                        placeholder="e.g., admin@example.com"
                                                        {...apiForm.register("owner")}
                                                        className="mt-1"
                                                    />
                                                    {apiForm.formState.errors.owner && (
                                                        <p className="text-sm text-destructive mt-1">
                                                            {apiForm.formState.errors.owner.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <Label htmlFor="purpose">Purpose *</Label>
                                                    <Select
                                                        value={apiForm.watch("purpose")}
                                                        onValueChange={(value) => apiForm.setValue("purpose", value as any)}
                                                    >
                                                        <SelectTrigger className="mt-1">
                                                            <SelectValue placeholder="Select purpose" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="web">Web Application</SelectItem>
                                                            <SelectItem value="mobile">Mobile Application</SelectItem>
                                                            <SelectItem value="server">Server/API Service</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="createSandbox"
                                                        checked={createSandbox}
                                                        onCheckedChange={(checked) => setCreateSandbox(checked as boolean)}
                                                    />
                                                    <Label htmlFor="createSandbox" className="cursor-pointer">
                                                        Create sandbox environment for testing
                                                    </Label>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id="terms"
                                                        checked={acceptedTerms}
                                                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                                                    />
                                                    <Label htmlFor="terms" className="cursor-pointer">
                                                        I accept the terms and conditions
                                                    </Label>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={createProjectMutation.isPending}
                                            >
                                                {createProjectMutation.isPending ? "Creating Project..." : "Create Project & Get API Key"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <>
                                <Card className="mb-8">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-2xl">
                                                    {projectResult?.approvalStatus === 'pending' ? '⏳ Project Pending Approval' : '🎉 Project Approved!'}
                                                </CardTitle>
                                                <CardDescription className="mt-2">
                                                    {projectResult?.approvalStatus === 'pending' 
                                                        ? 'Your project is under review. You will be notified once it is approved.'
                                                        : 'Your API key has been generated. Make sure to copy it now - you won\'t be able to see it again!'}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline" className={
                                                projectResult?.approvalStatus === 'pending' 
                                                    ? "text-yellow-600 border-yellow-600" 
                                                    : "text-green-600 border-green-600"
                                            }>
                                                {projectResult?.approvalStatus === 'pending' ? 'Pending' : 'Approved'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Project ID</Label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <code className="flex-1 bg-muted p-2 rounded text-sm">
                                                        {projectResult?.id}
                                                    </code>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => copyToClipboard(projectResult?.id || "", "Project ID")}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <Label>API Key</Label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <code className="flex-1 bg-muted p-2 rounded text-sm font-mono">
                                                        {showApiKey ? projectResult?.apiKey : "••••••••••••••••••••••••••••••••"}
                                                    </code>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setShowApiKey(!showApiKey)}
                                                    >
                                                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => copyToClipboard(projectResult?.apiKey || "", "API Key")}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <Alert className="mt-2">
                                                    <AlertDescription>
                                                        Keep your API key secure and never share it publicly. You can regenerate it if compromised.
                                                    </AlertDescription>
                                                </Alert>
                                            </div>

                                            {createSandbox && (
                                                <div>
                                                    <Label>Sandbox API Key</Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <code className="flex-1 bg-muted p-2 rounded text-sm font-mono">
                                                            {projectResult?.sandboxApiKey}
                                                        </code>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => copyToClipboard(projectResult?.sandboxApiKey || "", "Sandbox API Key")}
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => regenerateKeyMutation.mutate(projectResult?.id)}
                                                disabled={regenerateKeyMutation.isPending}
                                            >
                                                <RefreshCw className="h-4 w-4 mr-2" />
                                                {regenerateKeyMutation.isPending ? "Regenerating..." : "Regenerate Key"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setApiStep("form");
                                                    apiForm.reset();
                                                    setAcceptedTerms(false);
                                                    setCreateSandbox(true);
                                                }}
                                            >
                                                Create Another Project
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* API Usage Metrics - Only show for approved projects */}
                                {projectResult?.approvalStatus === 'approved' && (
                                    <Card className="mb-8">
                                        <CardHeader>
                                            <CardTitle>API Usage Analytics</CardTitle>
                                            <CardDescription>
                                                Monitor your API usage and performance metrics
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Usage Summary */}
                                            <div className="grid gap-4 md:grid-cols-3">
                                                <Card>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-sm font-medium">API Calls Used</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-2xl font-bold">
                                                            {projectResult?.apiCallsUsed || 0}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            of {projectResult?.apiCallsLimit || 1000} limit
                                                        </p>
                                                        <Progress 
                                                            value={(projectResult?.apiCallsUsed || 0) / (projectResult?.apiCallsLimit || 1000) * 100} 
                                                            className="mt-2"
                                                        />
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-2xl font-bold">99.8%</div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Last 7 days
                                                        </p>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="text-2xl font-bold">145ms</div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Last 24 hours
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Usage Chart */}
                                            <div>
                                                <h3 className="text-sm font-medium mb-4">API Calls Over Time</h3>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <AreaChart data={[
                                                        { date: 'Mon', calls: 120 },
                                                        { date: 'Tue', calls: 150 },
                                                        { date: 'Wed', calls: 180 },
                                                        { date: 'Thu', calls: 140 },
                                                        { date: 'Fri', calls: 210 },
                                                        { date: 'Sat', calls: 95 },
                                                        { date: 'Sun', calls: 80 },
                                                    ]}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Area 
                                                            type="monotone" 
                                                            dataKey="calls" 
                                                            stroke="#8b5cf6" 
                                                            fill="#8b5cf6" 
                                                            fillOpacity={0.2}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Plan Details */}
                                            <div className="border-t pt-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium">Current Plan</p>
                                                        <p className="text-2xl font-bold capitalize">
                                                            {projectResult?.selectedPlan || 'Starter'}
                                                        </p>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        Upgrade Plan
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Tabs defaultValue="quickstart" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                                        <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
                                        <TabsTrigger value="examples">Code Examples</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="quickstart" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Getting Started</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold mb-2">1. Authentication</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Include your API key in the request headers:
                                                    </p>
                                                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                                        {`headers: {
  'X-API-Key': 'your-api-key-here',
  'Content-Type': 'application/json'
}`}
                                                    </pre>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">2. Base URL</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        All API requests should be made to:
                                                    </p>
                                                    <pre className="bg-muted p-3 rounded text-xs">
                                                        {`https://api.oauth3.io/v1`}
                                                    </pre>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="endpoints" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Available Endpoints</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <Badge className="mt-1">POST</Badge>
                                                        <div className="flex-1">
                                                            <code className="text-sm">/accounts/create</code>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Create a new ZK account for a user
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <Badge className="mt-1">GET</Badge>
                                                        <div className="flex-1">
                                                            <code className="text-sm">/accounts/:address</code>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Get account details and balance
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <Badge className="mt-1">POST</Badge>
                                                        <div className="flex-1">
                                                            <code className="text-sm">/transfers/send</code>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Send tokens from a ZK account
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="examples" className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Code Examples</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Create Account</h4>
                                                        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                                            {`const response = await fetch('https://api.oauth3.io/v1/accounts/create', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    chainId: 1
  })
});

const account = await response.json();`}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            {/* Session Status Bar */}
            <div className="fixed top-16 left-0 right-0 bg-muted/50 backdrop-blur-sm border-b border-border z-[60]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between h-12">
                        <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Current Session:
              </span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-foreground">
                  {userEmail}
                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:border-destructive/20 border border-gray-500 text-xs py-1 h-7 ml-2"
                                >
                                    {isLoggingOut ? "Disconnecting..." : "Disconnect"}
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Chain Network:</span>
                                <Select
                                    value={selectedChainId}
                                    disabled={isRefreshing}
                                    onValueChange={(value) => {
                                        setSelectedChainId(value);
                                        const selected = chains.find(chain => chain.chainId.toString() === value);
                                        if (selected) {
                                            setNetworkName(selected.networkName);
                                            // Switch to Overview when chain changes
                                            setActiveMenu("overview");
                                            // The useEffect will handle refreshing account data with debouncing
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-32 h-7 text-xs bg-background">
                                        <SelectValue placeholder="Select network"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {chains.map((chain) => (
                                            <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                                                <div className="flex items-center gap-2">
                                                    {chain.networkImage && (
                                                        <img
                                                            src={ethereumLogo}
                                                            alt={chain.networkName}
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                    )}
                                                    <span>{chain.networkName}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Owner:</span>
                                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs text-foreground">
                    {wallet?.address
                        ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
                        : "No wallet"}
                  </span>
                                    {wallet?.address && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                copyToClipboard(wallet.address, "Owner Address")
                                            }
                                            className="p-0.5 h-auto hover:bg-muted/50"
                                        >
                                            <ClipboardIcon
                                                className="w-3 h-3 text-muted-foreground hover:text-foreground"
                                                strokeWidth={1}
                                            />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  ZKP Contract Account:
                </span>
                                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs text-foreground">
                    {zkAccountInfo?.zkAccountAddress
                        ? `${zkAccountInfo.zkAccountAddress.slice(0, 6)}...${zkAccountInfo.zkAccountAddress.slice(-4)}`
                        : "Not created"}
                  </span>
                                    {zkAccountInfo?.zkAccountAddress && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                copyToClipboard(
                                                    zkAccountInfo.zkAccountAddress || "",
                                                    "ZKP Contract Address",
                                                )
                                            }
                                            className="p-0.5 h-auto hover:bg-muted/50"
                                        >
                                            <ClipboardIcon
                                                className="w-3 h-3 text-muted-foreground hover:text-foreground"
                                                strokeWidth={1}
                                            />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden py-2">
                        <div className="flex items-center justify-between mb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-1"
                            >
                                <Bars3Icon className="w-6 h-6"/>
                            </Button>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                  {userEmail}
                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:border-destructive/20 border border-gray-500 text-xs py-1 h-7"
                                >
                                    {isLoggingOut ? "..." : "Disconnect"}
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Network:</span>
                                <Select
                                    value={selectedChainId}
                                    disabled={isRefreshing}
                                    onValueChange={(value) => {
                                        setSelectedChainId(value);
                                        const selected = chains.find(chain => chain.chainId.toString() === value);
                                        if (selected) {
                                            setNetworkName(selected.networkName);
                                            setActiveMenu("overview");
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-32 h-6 text-xs bg-background">
                                        <SelectValue placeholder="Select network"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {chains.map((chain) => (
                                            <SelectItem key={chain.chainId} value={chain.chainId.toString()}>
                                                <div className="flex items-center gap-2">
                                                    {chain.networkImage && (
                                                        <img
                                                            src={ethereumLogo}
                                                            alt={chain.networkName}
                                                            className="w-4 h-4 object-contain"
                                                        />
                                                    )}
                                                    <span>{chain.networkName}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Owner:</span>
                                    <span className="font-mono text-xs text-foreground">
                    {wallet?.address
                        ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
                        : "No wallet"}
                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">ZKP:</span>
                                    <span className="font-mono text-xs text-foreground">
                    {zkAccountInfo?.zkAccountAddress
                        ? `${zkAccountInfo.zkAccountAddress.slice(0, 6)}...${zkAccountInfo.zkAccountAddress.slice(-4)}`
                        : "Not created"}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-32 md:pt-28 flex relative">
                {/* Left Sidebar - Desktop */}
                <div className="hidden md:block w-56 bg-background border-r border-border/50 min-h-screen">
                    <div className="p-6">
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveMenu("overview")}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeMenu === "overview"
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => !zkAccountInfo?.hasZKAccount ? null : setActiveMenu("add-token")}
                                disabled={!zkAccountInfo?.hasZKAccount}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    !zkAccountInfo?.hasZKAccount
                                        ? "text-gray-400"
                                        : activeMenu === "add-token"
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                Add Token
                            </button>
                            <button
                                onClick={() => !zkAccountInfo?.hasZKAccount ? null : setActiveMenu("send")}
                                disabled={!zkAccountInfo?.hasZKAccount}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    !zkAccountInfo?.hasZKAccount
                                        ? "text-gray-400"
                                        : activeMenu === "send"
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                Send
                            </button>
                            <button
                                onClick={() => !zkAccountInfo?.hasZKAccount ? null : setActiveMenu("receive")}
                                disabled={!zkAccountInfo?.hasZKAccount}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    !zkAccountInfo?.hasZKAccount
                                        ? "text-gray-400"
                                        : activeMenu === "receive"
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                Receive
                            </button>
                            <div className="border-t border-border/50 my-2"></div>
                            <button
                                onClick={() => setActiveMenu("api-application")}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeMenu === "api-application"
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                API Application
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Mobile Sidebar */}
                <div
                    className={`md:hidden fixed inset-0 z-[70] bg-background transition-transform duration-300 ease-in-out pt-32 ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Menu</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1"
                            >
                                <XMarkIcon className="w-6 h-6"/>
                            </Button>
                        </div>
                        <nav className="space-y-2">
                            <button
                                onClick={() => {
                                    setActiveMenu("overview");
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors ${
                                    activeMenu === "overview"
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => {
                                    if (zkAccountInfo?.hasZKAccount) {
                                        setActiveMenu("add-token");
                                        setIsMobileMenuOpen(false);
                                    }
                                }}
                                disabled={!zkAccountInfo?.hasZKAccount}
                                className={`w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors ${
                                    !zkAccountInfo?.hasZKAccount
                                        ? "text-gray-400"
                                        : activeMenu === "add-token"
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                Add Token
                            </button>
                            <button
                                onClick={() => {
                                    if (zkAccountInfo?.hasZKAccount) {
                                        setActiveMenu("send");
                                        setIsMobileMenuOpen(false);
                                    }
                                }}
                                disabled={!zkAccountInfo?.hasZKAccount}
                                className={`w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors ${
                                    !zkAccountInfo?.hasZKAccount
                                        ? "text-gray-400"
                                        : activeMenu === "send"
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                Send
                            </button>
                            <button
                                onClick={() => {
                                    if (zkAccountInfo?.hasZKAccount) {
                                        setActiveMenu("receive");
                                        setIsMobileMenuOpen(false);
                                    }
                                }}
                                disabled={!zkAccountInfo?.hasZKAccount}
                                className={`w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors ${
                                    !zkAccountInfo?.hasZKAccount
                                        ? "text-gray-400"
                                        : activeMenu === "receive"
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                Receive
                            </button>
                            <div className="border-t border-border/50 my-2"></div>
                            <button
                                onClick={() => {
                                    setActiveMenu("api-application");
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors ${
                                    activeMenu === "api-application"
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                            >
                                API Application
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-8">
                    {/* Selected Content */}
                    {renderMainContent()}
                </div>
            </div>
            
            {/* Pricing Modal */}
            <PricingModal 
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
                onSelectPlan={handlePlanSelection}
            />
        </div>
    );
}
