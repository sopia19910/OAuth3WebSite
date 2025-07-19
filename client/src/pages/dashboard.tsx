import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@heroicons/react/24/outline";
import { SiGoogle } from "react-icons/si";
import Navbar from "@/components/navbar";
import {
  getWalletFromStorage,
  getWalletBalance,
  getNetworkInfo,
  type WalletInfo,
} from "@/lib/wallet";
import {
  checkZKAccount,
  waitForTransaction,
  transferETHFromZKAccount,
  transferOA3FromZKAccount,
  type ZKAccountInfo,
  type TransferResult
} from "@/lib/zkAccount";

export default function Dashboard() {

  const [, setLocation] = useLocation();
  const [activeMenu, setActiveMenu] = useState<string>("overview");
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");

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
  // Load wallet and account data on component mount
  useEffect(() => {
    loadWalletData();
  }, []);

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
          setLocation("/demo");
          return;
        }

        // Valid session - continue with loading
        console.log("✅ Valid OAuth session for:", userData.user.email);
        setUserEmail(userData.user.email);
        localStorage.setItem("oauth3_user_email", userData.user.email);
      } catch (error) {
        console.error("Failed to validate OAuth session:", error);
        alert("Failed to validate session. Please login again.");
        setLocation("/demo");
        return;
      }

      // Get wallet from storage
      const savedWallet = getWalletFromStorage();
      if (savedWallet) {
        setWallet(savedWallet);

        // Get wallet balance
        const balance = await getWalletBalance(savedWallet.address);
        setWalletBalance(balance.formatted);

        // Check for ZK Account
        const zkInfo = await checkZKAccount(savedWallet.address);
        setZkAccountInfo(zkInfo);
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
    if (!wallet) return;

    setIsRefreshing(true);
    try {
      // Refresh wallet balance
      const balance = await getWalletBalance(wallet.address);
      setWalletBalance(balance.formatted);

      // Refresh ZK Account info
      const zkInfo = await checkZKAccount(wallet.address);
      setZkAccountInfo(zkInfo);
      console.log('✅ Account data refreshed');
    } catch (error) {
      console.error("Failed to refresh account data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert(`Failed to copy ${label}`);
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
        result = await transferOA3FromZKAccount(
          wallet.privateKey,
          wallet.address,
          sendAddress,
          sendAmount,
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
                  className="flex items-center gap-2"
                >
                  <ArrowPathIcon
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Web2 OAuth Account */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <SiGoogle className="w-5 h-5 text-blue-500" />
                    Web2 OAuth Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Provider
                    </Label>
                    <p className="text-sm text-foreground mt-1">
                      Google OAuth 2.0
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Authentication Status
                    </Label>
                    <p className="text-sm text-green-500 mt-1">✓ Verified</p>
                  </div>
                </CardContent>
              </Card>

              {/* Web3 Account */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <WalletIcon className="w-5 h-5 text-purple-500" />
                    Web3 Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Owner ETH (Gas Fee)
                    </Label>
                    <p className="text-sm text-foreground mt-1">
                      {walletBalance} ETH
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Network
                    </Label>
                    <p className="text-sm text-foreground mt-1">
                      {networkName}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Address
                    </Label>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs font-mono text-foreground">
                        {wallet?.address
                          ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
                          : "No wallet"}
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
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CogIcon className="w-5 h-5 text-cyan-500" />
                    ZKP Smart Contract (CA)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      ETH Balance
                    </Label>
                    <p className="text-sm text-foreground mt-1 font-semibold">
                      {zkAccountInfo?.balance || "0"} ETH
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      OA3 Token Balance
                    </Label>
                    <p className="text-sm text-foreground mt-1 font-semibold">
                      {zkAccountInfo?.tokenBalance || "0"} OA3
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      ZKP Status
                    </Label>
                    <p className="text-sm text-green-500 mt-1">
                      {zkAccountInfo?.hasZKAccount
                        ? "✓ Active"
                        : "⚠️ Not Created"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Contract Address
                    </Label>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs font-mono text-foreground">
                        {zkAccountInfo?.zkAccountAddress
                          ? `${zkAccountInfo.zkAccountAddress.slice(0, 6)}...${zkAccountInfo.zkAccountAddress.slice(-4)}`
                          : "Not available"}
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
          </div>
        );

      case "add-token":
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusIcon className="w-5 h-5" />
                  Add Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Add Token
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case "send":
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpIcon className="w-5 h-5" />
                  Send Coin/Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                      <SelectItem value="OA3">OA3 - OAuth3 Token</SelectItem>
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
              </CardContent>
            </Card>
          </div>
        );

      case "receive":
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownIcon className="w-5 h-5" />
                  Receive Coin/Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">
                    Your Wallet Address
                  </Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                    <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                      {zkAccountInfo?.zkAccountAddress ||
                        wallet?.address ||
                        "No address available"}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          zkAccountInfo?.zkAccountAddress ||
                            wallet?.address ||
                            "",
                          "Wallet Address",
                        )
                      }
                      className="p-1 h-auto hover:bg-background"
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
                    <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                      <QrCodeIcon className="w-24 h-24 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Scan this QR code to send tokens to your wallet
                  </p>
                </div>
              </CardContent>
            </Card>
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
      <div className="fixed top-16 left-0 right-0 bg-muted/50 backdrop-blur-sm border-b border-border z-40">
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
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Network:</span>
                <span className="font-medium text-foreground">
                  {networkName}
                </span>
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
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:border-destructive/20"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
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
                onClick={() => setActiveMenu("add-token")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeMenu === "add-token"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Add Token
              </button>
              <button
                onClick={() => setActiveMenu("send")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeMenu === "send"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                Send
              </button>
              <button
                onClick={() => setActiveMenu("receive")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeMenu === "receive"
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
          {/* Current Selection Header */}
          <div className="mb-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {activeMenu === "overview" && "Dashboard Overview"}
                  {activeMenu === "add-token" && "Add Token"}
                  {activeMenu === "send" && "Send Coin/Token"}
                  {activeMenu === "receive" && "Receive Coin/Token"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeMenu === "overview" &&
                    "Account information and status overview"}
                  {activeMenu === "add-token" &&
                    "Add new tokens to your wallet"}
                  {activeMenu === "send" &&
                    "Send coins or tokens to other addresses"}
                  {activeMenu === "receive" &&
                    "Receive coins or tokens from others"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Current Section:</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                  {activeMenu === "overview" && "Overview"}
                  {activeMenu === "add-token" && "Add Token"}
                  {activeMenu === "send" && "Send"}
                  {activeMenu === "receive" && "Receive"}
                </span>
              </div>
            </div>
          </div>
          {/* Selected Content */}
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
