import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  GlobeAltIcon,
  WalletIcon,
  DocumentIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  ClipboardIcon,
  ArrowPathIcon,
  UserIcon,
  CogIcon,
  BanknotesIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
import { SiGoogle } from "react-icons/si";
import Navbar from "@/components/navbar";
import ethereumLogo from "@assets/image_1752985874370.png";
import { 
  createWallet, 
  importWallet, 
  getWalletBalance, 
  saveWalletToStorage, 
  getWalletFromStorage,
  getNetworkInfo,
  type WalletInfo 
} from "@/lib/wallet";
import { ethers } from "ethers";
import { 
  createZKAccount, 
  checkZKAccount, 
  waitForTransaction,
  type ZKAccountInfo,
  type ZKAccountCreationResult 
} from "@/lib/zkAccount";

type DemoStep = "login" | "web3-setup" | "balance" | "zkp-generation" | "zkp-display" | "complete";

// Step configuration
const stepConfig = [
  {
    id: "login",
    title: "OAuth Login",
    description: "Connect with Google",
    icon: UserIcon,
    color: "text-blue-500"
  },
  {
    id: "web3-setup",
    title: "Web3 Setup",
    description: "Create or import wallet",
    icon: WalletIcon,
    color: "text-purple-500"
  },
  {
    id: "balance",
    title: "Balance Check",
    description: "Verify ETH balance",
    icon: BanknotesIcon,
    color: "text-green-500"
  },
  {
    id: "zkp-generation",
    title: "ZK Account",
    description: "Create ZK smart contract",
    icon: CogIcon,
    color: "text-cyan-500"
  },
  {
    id: "zkp-display",
    title: "ZK Information",
    description: "Review account details",
    icon: LockClosedIcon,
    color: "text-indigo-500"
  },
  {
    id: "complete",
    title: "Complete",
    description: "Ready to use dashboard",
    icon: CheckCircleIcon,
    color: "text-emerald-500"
  }
];

export default function Demo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("login");
  const [web3Option, setWeb3Option] = useState("new");
  const [privateKey, setPrivateKey] = useState("");
  const [zkpProgress, setZkpProgress] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [walletBalance, setWalletBalance] = useState("0.0");
  const [importError, setImportError] = useState("");
  const [networkName, setNetworkName] = useState("Loading...");
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState("");
  const [zkAccountInfo, setZkAccountInfo] = useState<ZKAccountInfo | null>(null);
  const [zkCreationResult, setZkCreationResult] = useState<ZKAccountCreationResult | null>(null);
  const [zkProgress, setZkProgress] = useState(0);
  const [zkStatus, setZkStatus] = useState("");
  const [isRefreshingZkAccount, setIsRefreshingZkAccount] = useState(false);
  
  // Wallet creation/import loading state
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [walletCreationStatus, setWalletCreationStatus] = useState("");
  
  // Chain state
  const [chains, setChains] = useState<any[]>([]);
  const [selectedChainId, setSelectedChainId] = useState<string>("");
  const [urlChainId, setUrlChainId] = useState<string | null>(null);

  // Check for OAuth callback parameters and existing session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const oauthSuccess = params.get('oauth');
        const email = params.get('email');
        const fromDashboard = params.get('from') === 'dashboard';
        const chainId = params.get('chainId');
        const isFreshStart = params.get('fresh') === 'true';
        
        // Handle OAuth callback
        if (oauthSuccess === 'success' && email) {
          setUserEmail(email);
          setCurrentStep("web3-setup");
          // Clear the URL parameters
          window.history.replaceState({}, document.title, '/personalservice');
        } else if (oauthSuccess === 'error') {
          const message = params.get('message') || 'Authentication failed';
          toast({
            title: "Authentication Error",
            description: message,
            variant: "destructive",
            duration: 3000,
          });
          window.history.replaceState({}, document.title, '/personalservice');
        } else if (!isFreshStart) {
          // Check for existing OAuth session only if not a fresh start
          try {
            const authResponse = await fetch('/api/auth/me');
            const authData = await authResponse.json();
            
            if (authData.success && authData.user && authData.user.email) {
              console.log('✅ Found existing OAuth session:', authData.user.email);
              setUserEmail(authData.user.email);
              
              // Check for existing wallet in storage
              const savedWallet = getWalletFromStorage();
              if (savedWallet) {
                setWallet(savedWallet);
                console.log('✅ Found existing wallet:', savedWallet.address);
                
                // If user has both OAuth session and wallet, skip to balance step
                setCurrentStep("balance");
                
                // If coming from dashboard with specific chain, save it
                if (fromDashboard && chainId) {
                  setUrlChainId(chainId);
                  console.log('📌 Chain ID from dashboard:', chainId);
                  // Clear any existing ZK Account info when coming from dashboard
                  setZkAccountInfo(null);
                }
              } else {
                // Has OAuth but no wallet, go to web3 setup
                setCurrentStep("web3-setup");
              }
            }
          } catch (error) {
            console.error('Error checking auth session:', error);
          }
        }

        // Check for existing wallet in storage (even without OAuth)
        const savedWallet = getWalletFromStorage();
        if (savedWallet && !wallet) {
          setWallet(savedWallet);
        }

        // Get network info
        const info = await getNetworkInfo();
        setNetworkName(info.name === 'unknown' ? 'Holesky Testnet' : info.name);
        
        // Clear URL parameters
        if (fromDashboard || isFreshStart) {
          window.history.replaceState({}, document.title, '/personalservice');
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };
    
    initializeSession();
  }, []);

  // Fetch available chains
  useEffect(() => {
    const fetchChains = async () => {
      try {
        const response = await fetch('/api/chains');
        const data = await response.json();
        if (data.success && data.chains) {
          setChains(data.chains);
          
          // If we have a chain ID from URL (dashboard), use it
          if (urlChainId) {
            const targetChain = data.chains.find((chain: any) => chain.id.toString() === urlChainId);
            if (targetChain) {
              setSelectedChainId(targetChain.chainId.toString());
              setNetworkName(targetChain.networkName);
              console.log('🎯 Using chain from dashboard:', targetChain.networkName);
              // Clear ZK Account info when setting chain from URL
              setZkAccountInfo(null);
            }
          } else {
            // Otherwise, set the active chain as selected by default
            const activeChain = data.chains.find((chain: any) => chain.isActive);
            if (activeChain) {
              setSelectedChainId(activeChain.chainId.toString());
              setNetworkName(activeChain.networkName);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching chains:', error);
      }
    };
    fetchChains();
  }, [urlChainId]);

  // Auto-refresh balance when wallet or chain changes
  useEffect(() => {
    if (wallet && selectedChainId && chains.length > 0) {
      // Create promise and handle errors properly
      const fetchBalance = async () => {
        setIsRefreshingBalance(true);
        setBalanceError("");
        try {
          // Find the selected chain
          const selectedChain = chains.find(chain => chain.chainId.toString() === selectedChainId);
          if (selectedChain) {
            const provider = new ethers.JsonRpcProvider(selectedChain.rpcUrl);
            const balance = await getWalletBalance(wallet.address, provider);
            setWalletBalance(balance.formatted);
            setBalanceError("");
            
            // Only check ZK Account if we're in the balance step
            // This prevents double API calls when navigating from dashboard
            if (userEmail && currentStep === "balance" && !isRefreshingZkAccount) {
              console.log('🔍 Single ZK Account check on chain:', selectedChain.networkName);
              // Clear previous ZK Account info before checking new chain
              setZkAccountInfo(null);
              
              try {
                const zkInfo = await checkZKAccount(wallet.address, selectedChainId);
                if (zkInfo.hasZKAccount) {
                  setZkAccountInfo(zkInfo);
                  console.log('✅ Found ZK Account on this chain:', zkInfo.zkAccountAddress);
                  
                  // Only redirect if not coming from dashboard
                  if (!urlChainId) {
                    toast({
                      title: "ZK Account Found",
                      description: "You already have a ZK Account on this network. Redirecting to dashboard...",
                      duration: 2000,
                    });
                    setTimeout(() => {
                      setLocation("/dashboard");
                    }, 2000);
                  }
                } else {
                  console.log('❌ No ZK Account on this chain');
                }
              } catch (error) {
                console.error('Error checking ZK Account:', error);
                setZkAccountInfo(null);
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch balance:', error);
          setBalanceError('Failed to fetch balance. Please check your network connection.');
          setWalletBalance("0.0");
        } finally {
          setIsRefreshingBalance(false);
        }
      };
      
      // Call with proper error handling
      fetchBalance().catch(err => {
        console.error('Balance fetch error:', err);
      });
    }
  }, [wallet, selectedChainId, chains, userEmail, currentStep, urlChainId]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/google');
      const data = await response.json();
      
      if (data.success && data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        alert('Failed to initiate Google login');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Failed to initiate Google login');
      setIsLoading(false);
    }
  };

  const handleWeb3Setup = async () => {
    setIsCreatingWallet(true);
    setWalletCreationStatus("Initializing wallet...");
    
    try {
      let walletInfo: WalletInfo;
      
      if (web3Option === "new") {
        // Create new wallet
        setWalletCreationStatus("Creating new wallet...");
        walletInfo = createWallet();
        console.log('🔑 New wallet created:', walletInfo.address);
      } else {
        // Import existing wallet
        if (!privateKey) {
          setImportError("Private key is required");
          setIsCreatingWallet(false);
          return;
        }
        
        setWalletCreationStatus("Importing wallet...");
        try {
          walletInfo = importWallet(privateKey);
          console.log('🔑 Wallet imported:', walletInfo.address);
        } catch (error) {
          setImportError("Invalid private key format");
          setIsCreatingWallet(false);
          return;
        }
      }
      
      // Save wallet to storage
      setWalletCreationStatus("Saving wallet...");
      setWallet(walletInfo);
      saveWalletToStorage(walletInfo);
      
      // Get wallet balance
      setWalletCreationStatus("Fetching balance...");
      try {
        if (selectedChainId) {
          const selectedChain = chains.find(chain => chain.id.toString() === selectedChainId);
          if (selectedChain) {
            const provider = new ethers.JsonRpcProvider(selectedChain.rpcUrl);
            const balance = await getWalletBalance(walletInfo.address, provider);
            setWalletBalance(balance.formatted);
            setBalanceError("");
          }
        } else {
          const balance = await getWalletBalance(walletInfo.address);
          setWalletBalance(balance.formatted);
          setBalanceError("");
        }
      } catch (error) {
        console.error('Failed to fetch initial balance:', error);
        setBalanceError('Failed to fetch balance. You can try refreshing later.');
        setWalletBalance("0.0");
      }

      // Check for existing ZK Account
      if (userEmail && selectedChainId) {
        setWalletCreationStatus("Checking for existing ZK Account...");
        try {
          const existingAccount = await checkZKAccount(walletInfo.address, selectedChainId);
          if (existingAccount.hasZKAccount) {
            setZkAccountInfo(existingAccount);
            console.log('✅ Found existing ZK Account during wallet setup:', existingAccount.zkAccountAddress);
            
            // If wallet has ZK Account, skip to dashboard
            setWalletCreationStatus("ZK Account found! Redirecting to dashboard...");
            await new Promise(resolve => setTimeout(resolve, 1500)); // Brief pause to show message
            
            console.log('🚀 Wallet has existing ZK Account, redirecting to dashboard');
            setLocation("/dashboard");
            return;
          }
        } catch (error) {
          console.warn('Failed to check ZK account during wallet setup:', error);
        }
      }
      
      setWalletCreationStatus("Setup complete!");
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause to show completion
      
      setCurrentStep("balance");
    } catch (error) {
      console.error('Wallet setup error:', error);
      alert('Failed to setup wallet');
    } finally {
      setIsCreatingWallet(false);
      setWalletCreationStatus("");
    }
  };

  const refreshBalance = async () => {
    if (!wallet || !selectedChainId) return;
    
    setIsRefreshingBalance(true);
    setBalanceError("");
    try {
      // Find the selected chain
      const selectedChain = chains.find(chain => chain.id.toString() === selectedChainId);
      if (selectedChain) {
        console.log('🌐 Refreshing balance on chain:', selectedChain.networkName);
        console.log('🔗 Using RPC URL:', selectedChain.rpcUrl);
        const provider = new ethers.JsonRpcProvider(selectedChain.rpcUrl);
        const balance = await getWalletBalance(wallet.address, provider);
        setWalletBalance(balance.formatted);
        setBalanceError("");
        console.log('✅ Balance refreshed:', balance.formatted, 'ETH');
      } else {
        throw new Error('No chain selected');
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      setBalanceError('Failed to fetch balance. Please check your network connection and try again.');
      setWalletBalance("0.0");
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  const refreshZkAccountInfo = async () => {
    if (!wallet) return;
    
    setIsRefreshingZkAccount(true);
    try {
      const refreshedInfo = await checkZKAccount(wallet.address, selectedChainId);
      setZkAccountInfo(refreshedInfo);
      console.log('✅ ZK Account info refreshed:', {
        ethBalance: refreshedInfo.balance,
        oa3Balance: refreshedInfo.tokenBalance
      });
    } catch (error) {
      console.error('Failed to refresh ZK account info:', error);
    } finally {
      setIsRefreshingZkAccount(false);
    }
  };

  const handleRequestGasFee = async () => {
    if (!wallet || !userEmail) {
      alert('Missing wallet or user email');
      return;
    }

    setCurrentStep("zkp-generation");
    setZkProgress(0);
    setZkStatus("Initializing ZK Account creation...");

    try {
      // Step 1: Check if ZK account already exists (25%)
      setZkProgress(25);
      setZkStatus("Checking for existing ZK Account...");
      
      const existingAccount = await checkZKAccount(wallet.address, selectedChainId);
      if (existingAccount.hasZKAccount) {
        setZkAccountInfo(existingAccount);
        setZkProgress(100);
        setZkStatus("ZK Account already exists! Loading account details...");
        console.log('✅ Found existing ZK Account:', existingAccount.zkAccountAddress);
        console.log('💰 ETH Balance:', existingAccount.balance);
        console.log('🪙 OA3 Token Balance:', existingAccount.tokenBalance);
        setTimeout(() => setCurrentStep("zkp-display"), 1000);
        return;
      }

      // Step 2: Create ZK Account transaction (50%)
      setZkProgress(50);
      setZkStatus("Creating ZK Account transaction...");
      
      const result = await createZKAccount(wallet.privateKey, wallet.address, userEmail, selectedChainId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create ZK Account');
      }

      setZkCreationResult(result);
      
      // Step 3: Transaction sent (75%)
      setZkProgress(75);
      setZkStatus(`Transaction sent! Hash: ${result.transactionHash?.slice(0, 10)}...`);

      // Step 4: Wait for confirmation (100%)
      if (result.transactionHash) {
        setZkStatus("Waiting for transaction confirmation...");
        
        // Wait for transaction with timeout
        const receipt = await waitForTransaction(result.transactionHash, selectedChainId);
        
        if (receipt) {
          setZkProgress(100);
          setZkStatus("ZK Account created successfully!");
          
          // Fetch the created account info
          const accountInfo = await checkZKAccount(wallet.address, selectedChainId);
          setZkAccountInfo(accountInfo);
        } else {
          setZkProgress(100);
          setZkStatus("Transaction sent but confirmation timed out. Check explorer for status.");
        }
      }
      
      setTimeout(() => setCurrentStep("zkp-display"), 1500);

    } catch (error) {
      console.error('ZK Account creation error:', error);
      setZkStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => {
        alert('Failed to create ZK Account: ' + (error instanceof Error ? error.message : 'Unknown error'));
        setCurrentStep("balance");
      }, 3000);
    }
  };

  const handleViewZKP = () => {
    setCurrentStep("complete");
  };

  const handleGoToDashboard = () => {
    setLocation("/dashboard");
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
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy",
        description: `Could not copy ${label}`,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Get current step index
  const getCurrentStepIndex = () => {
    return stepConfig.findIndex(step => step.id === currentStep);
  };

  // Check if step is completed
  const isStepCompleted = (stepId: string) => {
    const stepIndex = stepConfig.findIndex(step => step.id === stepId);
    const currentIndex = getCurrentStepIndex();
    return stepIndex < currentIndex;
  };

  // Check if step is current
  const isCurrentStep = (stepId: string) => {
    return stepId === currentStep;
  };

  // Render step progress indicator
  const renderStepProgress = () => {
    return (
      <div className="w-full max-w-5xl mx-auto mb-8">
        <div className="flex items-start justify-between relative">
          {/* Background connection line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted" />
          
          {/* Progress line */}
          <div 
            className="absolute top-6 left-6 h-0.5 bg-green-500 transition-all duration-1000 ease-in-out"
            style={{ 
              width: `${(getCurrentStepIndex() / (stepConfig.length - 1)) * 100}%`,
              maxWidth: 'calc(100% - 3rem)'
            }}
          />
          
          {stepConfig.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = isStepCompleted(step.id);
            const isCurrent = isCurrentStep(step.id);
            
            return (
              <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                {/* Step circle */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out transform
                  ${isCompleted 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110' 
                    : isCurrent 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 animate-pulse scale-110' 
                      : 'bg-muted text-muted-foreground border-2 border-muted scale-100'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <IconComponent className="w-6 h-6" />
                  )}
                </div>
                
                {/* Step number */}
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-1 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-100 text-green-600' 
                    : isCurrent 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {index + 1}
                </div>
                
                {/* Step info */}
                <div className="mt-2 text-center max-w-24">
                  <h4 className={`text-sm font-medium transition-colors duration-300 ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case "login":
        return (
          <div className="flex flex-col items-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-2">Connect your account</h2>
            <p className="text-muted-foreground text-center mb-8">
              Connect your account to continue with OAuth 3 authentication
            </p>
            <Button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg disabled:opacity-50"
              size="lg"
            >
              {isLoading ? (
                <>Redirecting to Google...</>
              ) : (
                <>
                  <SiGoogle className="w-5 h-5 mr-2" />
                  Login with Google
                </>
              )}
            </Button>
          </div>
        );

      case "web3-setup":
        return (
          <div className="flex flex-col items-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Connect your Web3 account</h2>
            
            {/* Google Account Info */}
            <div className="w-full bg-card rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Connected Google Account</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                  {userEmail}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(userEmail, 'Email')}
                  className="p-1 h-auto hover:bg-muted"
                >
                  <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                </Button>
              </div>
            </div>
            
            <RadioGroup value={web3Option} onValueChange={setWeb3Option} className="w-full mb-6">
              <div className="flex items-center space-x-4 border rounded-lg p-4">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="flex-1 cursor-pointer">
                  Create New Web3 Account
                </Label>
              </div>
              <div className="flex items-center space-x-4 border rounded-lg p-4">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="flex-1 cursor-pointer">
                  Use Existing Web3 Account
                </Label>
              </div>
            </RadioGroup>

            {web3Option === "existing" && (
              <div className="w-full mb-6">
                <Label htmlFor="privateKey" className="text-sm font-medium mb-2 block">
                  Private Key
                </Label>
                <Input
                  id="privateKey"
                  type="password"
                  placeholder="Enter your private key (with or without 0x prefix)"
                  value={privateKey}
                  onChange={(e) => {
                    setPrivateKey(e.target.value);
                    setImportError(""); // Clear error on input change
                  }}
                  className={`w-full ${importError ? 'border-destructive' : ''}`}
                />
                {importError && (
                  <p className="text-sm text-destructive mt-2">{importError}</p>
                )}
              </div>
            )}

            <Button 
              onClick={handleWeb3Setup}
              disabled={isCreatingWallet}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {isCreatingWallet ? 'Processing...' : 'Next'}
            </Button>
            
            {/* Loading overlay */}
            {isCreatingWallet && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-card rounded-lg p-8 max-w-sm w-full mx-4 shadow-lg">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <h3 className="text-lg font-semibold text-foreground">Setting up your wallet</h3>
                    <p className="text-sm text-muted-foreground text-center">{walletCreationStatus}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "balance":
        return (
          <div className="flex flex-col items-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Web3 Account & Balance Information</h2>
            
            <div className="w-full space-y-6">
              {/* Web3 Account Info */}
              <div className="bg-card rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Web3 Account Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Public Address</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                      <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                        {wallet?.address || '0x...'}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet?.address || '', 'Public Address')}
                        className="p-1 h-auto hover:bg-background"
                      >
                        <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Private Key</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                      <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                        {wallet?.privateKey ? '••••••••••••••••••••••••••••••••' : 'No key available'}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (wallet?.privateKey) {
                            copyToClipboard(wallet.privateKey, 'Private Key');
                            toast({
                              title: "⚠️ Private key copied!",
                              description: "Keep it secure and never share it with anyone.",
                              variant: "destructive",
                              duration: 2000,
                            });
                          }
                        }}
                        className="p-1 h-auto hover:bg-background"
                        title="Copy private key (be careful!)"
                      >
                        <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ⚠️ Never share your private key. Store it securely.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Balance Info */}
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Balance Information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshBalance}
                    disabled={isRefreshingBalance}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/10 border border-gray-500 w-7 h-7 p-0 flex items-center justify-center"
                  >
                    <ArrowPathIcon className={`w-4 h-4 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                <div className="text-center space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Network</h4>
                    <Select value={selectedChainId} onValueChange={(value) => {
                      setSelectedChainId(value);
                      const chain = chains.find(c => c.chainId.toString() === value);
                      if (chain) {
                        setNetworkName(chain.networkName);
                      }
                      // Clear ZK Account info when chain changes
                      setZkAccountInfo(null);
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a network" />
                      </SelectTrigger>
                      <SelectContent>
                        {chains.map((chain) => (
                          <SelectItem key={chain.id} value={chain.chainId.toString()}>
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
                  <div>
                    <h4 className="text-md font-medium text-foreground mb-2">ETH Balance</h4>
                    {balanceError ? (
                      <div className="space-y-2">
                        <p className="text-destructive text-sm">⚠️ {balanceError}</p>
                        <p className="text-muted-foreground text-xs">Click refresh to try again</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xl">{walletBalance} ETH</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center py-4 space-y-3">
                {balanceError ? (
                  <p className="text-destructive text-sm">
                    ⚠️ Cannot check balance. Please fix the connection issue and refresh.
                  </p>
                ) : parseFloat(walletBalance) === 0 ? (
                  <div className="space-y-2">
                    <p className="text-destructive text-sm">
                      ETH balance is insufficient. Gas fee required.
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Send some ETH to your wallet address and click refresh to continue.
                    </p>
                  </div>
                ) : (
                  <p className="text-green-600 text-sm">
                    ✅ Sufficient balance available for ZK Account operations.
                  </p>
                )}
                
                {zkAccountInfo?.hasZKAccount && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm font-medium">
                      🎉 ZK Account Already Exists!
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      Address: {zkAccountInfo.zkAccountAddress?.slice(0, 10)}...
                    </p>
                    <p className="text-green-600 text-xs">
                      OA3 Balance: {zkAccountInfo.tokenBalance || '0'} OA3
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleRequestGasFee}
              disabled={!!balanceError || parseFloat(walletBalance) === 0}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {balanceError 
                ? 'Connection Error - Cannot Create ZK Account' 
                : parseFloat(walletBalance) === 0 
                  ? 'Insufficient Balance - Cannot Create ZK Account' 
                  : zkAccountInfo?.hasZKAccount
                    ? 'View Existing ZK Account'
                    : 'Create ZK Account Contract'
              }
            </Button>
          </div>
        );

      case "zkp-generation":
        return (
          <div className="flex flex-col items-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Creating ZK Account Contract
            </h2>
            
            <div className="w-full mb-8 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">{zkProgress}%</span>
              </div>
              <Progress value={zkProgress} className="w-full" />
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">{zkStatus}</p>
                
                {zkCreationResult?.transactionHash && (
                  <div className="space-y-2">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Transaction Hash:</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono text-foreground break-all flex-1 mr-2">
                          {zkCreationResult.transactionHash}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(zkCreationResult.transactionHash || '', 'Transaction Hash')}
                          className="p-1 h-auto hover:bg-background"
                        >
                          <ClipboardIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {zkCreationResult.explorerUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(zkCreationResult.explorerUrl, '_blank')}
                        className="w-full"
                      >
                        View on Explorer
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleViewZKP}
              disabled={zkProgress < 100}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {zkProgress < 100 ? 'Creating...' : 'View ZK Account'}
            </Button>
          </div>
        );

      case "zkp-display":
        return (
          <div className="flex flex-col max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">ZK Account Information</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshZkAccountInfo}
                disabled={isRefreshingZkAccount}
                className="flex items-center gap-2"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isRefreshingZkAccount ? 'animate-spin' : ''}`} />
                Refresh Balances
              </Button>
            </div>
            
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                {zkAccountInfo?.hasZKAccount 
                  ? 'ZK Account contract has been successfully created to link your Web2 OAuth account with your Web3 wallet.'
                  : 'ZK Account contract creation is in progress. Below are the generated account details and cryptographic information.'
                }
              </p>
            </div>
            
            {/* Email Information */}
            <div className="mb-6 w-full bg-card rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Connected Email Account</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                  {userEmail}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(userEmail, 'Email')}
                  className="p-1 h-auto hover:bg-muted"
                >
                  <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                </Button>
              </div>
            </div>
            
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">ZK Contract Account</span>
                      <p className="text-xs text-muted-foreground">Smart contract address for ZK operations</p>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                      <span className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                        {zkAccountInfo?.zkAccountAddress || zkCreationResult?.zkAccountAddress || '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(zkAccountInfo?.zkAccountAddress || zkCreationResult?.zkAccountAddress || '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', 'ZK Contract Account')}
                        className="p-1 h-auto hover:bg-muted"
                      >
                        <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Owner (EOA)</span>
                      <p className="text-xs text-muted-foreground">Externally Owned Account address</p>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                      <span className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                        {wallet?.address || '0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet?.address || '0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b', 'Owner (EOA)')}
                        className="p-1 h-auto hover:bg-muted"
                      >
                        <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">ETH Balance</span>
                      <p className="text-xs text-muted-foreground">Current Ethereum balance</p>
                    </div>
                    <span className="text-sm text-foreground md:col-span-2">{zkAccountInfo?.balance || '0'} ETH</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">OA3 Token Balance</span>
                      <p className="text-xs text-muted-foreground">OAuth3 token balance in ZK Account</p>
                    </div>
                    <span className="text-sm text-foreground md:col-span-2">{zkAccountInfo?.tokenBalance || '0'} OA3</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Requires ZK Proof</span>
                      <p className="text-xs text-muted-foreground">Zero-Knowledge verification required</p>
                    </div>
                    <span className="text-sm text-foreground md:col-span-2">Yes</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Email Hash (Poseidon)</span>
                      <p className="text-xs text-muted-foreground">Cryptographic hash of {userEmail}</p>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                      <span className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                        {zkAccountInfo?.emailHash || zkCreationResult?.emailHash || '0xabcdef1234567890abcdef1234567890abcdef1234567890'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(zkAccountInfo?.emailHash || zkCreationResult?.emailHash || '0xabcdef1234567890abcdef1234567890abcdef1234567890', 'Email Hash')}
                        className="p-1 h-auto hover:bg-muted"
                      >
                        <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Domain Hash (Poseidon)</span>
                      <p className="text-xs text-muted-foreground">Cryptographic hash of {userEmail ? userEmail.split('@')[1] : 'gmail.com'}</p>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between">
                      <span className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                        {zkAccountInfo?.domainHash || zkCreationResult?.domainHash || '0x0987654321fedcba0987654321fedcba0987654321fedcba'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(zkAccountInfo?.domainHash || zkCreationResult?.domainHash || '0x0987654321fedcba0987654321fedcba0987654321fedcba', 'Domain Hash')}
                        className="p-1 h-auto hover:bg-muted"
                      >
                        <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleViewZKP}
                className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
              >
                Confirm
              </Button>
            </div>
          </div>
        );

      case "complete":
        return (
          <div className="flex flex-col items-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Account Connections</h2>
            
            <div className="w-full space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <GlobeAltIcon className="w-5 h-5 text-muted-foreground" strokeWidth={1} />
                </div>
                <span className="text-foreground">Web2 OAuth Account</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <WalletIcon className="w-5 h-5 text-muted-foreground" strokeWidth={1} />
                </div>
                <span className="text-foreground">Web3 Account</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-card rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  <DocumentIcon className="w-5 h-5 text-muted-foreground" strokeWidth={1} />
                </div>
                <span className="text-foreground">ZKP Smart Contract Information (CA)</span>
              </div>
            </div>
            
            <p className="text-center text-muted-foreground mb-8">
              All account connections and ZKP generation are completed.
            </p>

            <Button 
              onClick={handleGoToDashboard}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Demo Content - Full Height */}
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gradient-bg">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Step Progress Indicator - Hidden */}
          {/* <div className="mb-12">
            {renderStepProgress()}
          </div> */}
          
          {/* Current Step Content */}
          <div className="w-full max-w-4xl mx-auto">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}
