import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
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
} from "@heroicons/react/24/outline";
import { SiGoogle } from "react-icons/si";
import Navbar from "@/components/navbar";
import QRCode from 'qrcode';
import {
  getWalletFromStorage,
  getWalletBalance,
  getNetworkInfo,
  type WalletInfo,
} from "@/lib/wallet";
import { ethers } from "ethers";
import {
  checkZKAccount,
  waitForTransaction,
  transferETHFromZKAccount,
  transferTokenFromZKAccount,
  type ZKAccountInfo,
  type TransferResult
} from "@/lib/zkAccount";

export default function Dashboard() {

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeMenu, setActiveMenu] = useState<string>("overview");
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
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
  // Load wallet and account data on component mount
  useEffect(() => {
    // Load chains first, then wallet data
    const loadInitialData = async () => {
      await loadChains();
      await loadWalletData();
      await loadTokensFromDB();
    };
    loadInitialData();
  }, []);

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
    
    // Add debouncing to prevent rapid chain switching issues
    const timeoutId = setTimeout(() => {
      refreshAccountData();
    }, 300); // 300ms debounce
    
    // Cleanup function to cancel pending refreshes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [selectedChainId, wallet?.address, chains.length]);

  const loadChains = async () => {
    try {
      const response = await fetch('/api/chains');
      if (response.ok) {
        const data = await response.json();
        setChains(data.chains || []);
        // Find the active chain and set it as selected
        const activeChain = data.chains?.find((chain: any) => chain.isActive);
        if (activeChain) {
          setSelectedChainId(activeChain.id.toString());
          setNetworkName(activeChain.networkName);
        }
      }
    } catch (error) {
      console.error('Failed to load chains:', error);
    }
  };

  const loadTokensFromDB = async () => {
    try {
      const response = await fetch('/api/tokens', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCustomTokens(data.tokens);
        }
      }
    } catch (error) {
      console.error('Failed to load tokens from DB:', error);
    }
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
          const selectedChain = chains.find(chain => chain.id.toString() === selectedChainId);
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
      // Load configuration
      const configResponse = await fetch("/api/config");
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
      const selectedChain = chains.find(chain => chain.id.toString() === selectedChainId);
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
            zkAccountAddress: null,
            currentOwner: null,
            balance: '0',
            tokenBalance: '0',
            taikoBalance: '0',
            requiresZKProof: false,
            emailHash: '0',
            domainHash: '0',
            verifierContract: null,
            accountNonce: '0',
            factoryAddress: null
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
      // Save to database
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: tokenAddress,
          symbol: tokenSymbol.toUpperCase(),
          name: tokenName
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

  const handleSendTransaction = async () => {
    if (!wallet || !zkAccountInfo?.hasZKAccount) {
      setSendError("No wallet or ZK Account found");
      return;
    }

    if (!sendAddress || !sendAmount || parseFloat(sendAmount) <= 0) {
      setSendError("Please fill in all required fields with valid values");
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

      // Step 2: Prepare transfer (50%)
      setSendProgress(50);
      setSendStatus("Preparing transaction...");

      let result: TransferResult;

      if (selectedToken === "ETH") {
        result = await transferETHFromZKAccount(
          wallet.privateKey,
          wallet.address,
          sendAddress,
          sendAmount,
        );
      } else {
        // For all other tokens, use the generic token transfer function
        result = await transferTokenFromZKAccount(
          wallet.privateKey,
          wallet.address,
          sendAddress,
          sendAmount,
          selectedToken // This is the token address for custom tokens
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      Owner ETH (Gas Fee)
                    </Label>
                    <p className="text-sm text-foreground mt-1">
                      {walletBalance} <span className="text-xs text-muted-foreground border border-gray-500 px-1 rounded">ETH</span>
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
                          <ClipboardIcon className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ZKP Smart Contract */}
              <Card className={`bg-card border-border rounded-none ${!zkAccountInfo?.hasZKAccount ? 'border-destructive/50 bg-destructive/5' : ''}`}>
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
                      {zkAccountInfo?.balance || "0"} <span className="text-xs text-muted-foreground border border-gray-500 px-1 rounded">ETH</span>
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">
                      OA3 Token Balance
                    </Label>
                    <p className="text-sm text-foreground mt-1">
                      {zkAccountInfo?.tokenBalance || "0"} <span className="text-xs text-muted-foreground border border-gray-500 px-1 rounded">OA3</span>
                    </p>
                  </div>
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
                          <ClipboardIcon className="w-3 h-3" />
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
                    <svg className="w-5 h-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-destructive">
                      ZKP Contract Account Not Created
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your ZKP Contract Account has not been created on the {networkName} network. 
                      To create your ZKP CA, please go to the <a href="/personalservice" className="underline hover:text-foreground">Personal Service page</a> and complete the ZKP generation process.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "add-token":
        return (
          <div className="grid grid-cols-2 gap-6">
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
                        <XMarkIcon className="w-4 h-4" />
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
                <PlusIcon className="w-5 h-5" />
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
              <ArrowUpIcon className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Send Coin/Token</h2>
            </div>
            <div>
              <Label htmlFor="recipient" className="text-sm font-medium">
                Recipient Address
              </Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
                className="mt-1"
              />
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
                  <SelectValue placeholder="Select a token" />
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
                <Progress value={sendProgress} className="w-full" />

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
                            <ClipboardIcon className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const explorerUrl =
                            config?.explorerUrl ||
                            "https://holesky.etherscan.io";
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
              <ArrowDownIcon className="w-5 h-5" />
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
                    <QrCodeIcon className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Scan this QR code to send tokens to your ZKP Contract Account
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Session Status Bar */}
      <div className="fixed top-16 left-0 right-0 bg-muted/50 backdrop-blur-sm border-b border-border z-[60]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
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
                    const selected = chains.find(chain => chain.id.toString() === value);
                    if (selected) {
                      setNetworkName(selected.networkName);
                      // Switch to Overview when chain changes
                      setActiveMenu("overview");
                      // The useEffect will handle refreshing account data with debouncing
                    }
                  }}
                >
                  <SelectTrigger className="w-32 h-7 text-xs bg-background">
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {chains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id.toString()}>
                        {chain.networkName}
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
                          zkAccountInfo.zkAccountAddress,
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
        </div>
      </div>
      <div className="pt-28 flex">
        {/* Left Sidebar */}
        <div className="w-56 bg-background border-r border-border/50 min-h-screen">
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
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Selected Content */}
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
