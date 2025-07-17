import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCardIcon, 
  PaperAirplaneIcon, 
  QrCodeIcon,
  PlusIcon,
  ClipboardIcon,
  WalletIcon,
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";
import { SiGoogle } from "react-icons/si";
import Navbar from "@/components/navbar";

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState<string>("overview");
  const [sendAmount, setSendAmount] = useState("");
  const [sendAddress, setSendAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");

  const userEmail = "demo.user@gmail.com";
  const publicAddress = "0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b";
  const zkpContract = "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b";

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert(`Failed to copy ${label}`);
    }
  };

  const renderMainContent = () => {
    switch (activeMenu) {
      case "overview":
        return (
          <div className="space-y-6">
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
                    <Label className="text-sm font-medium text-muted-foreground">Provider</Label>
                    <p className="text-sm text-foreground mt-1">Google OAuth 2.0</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Authentication Status</Label>
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
                    <Label className="text-sm font-medium text-muted-foreground">ETH Balance</Label>
                    <p className="text-sm text-foreground mt-1">1.23 ETH</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Network</Label>
                    <p className="text-sm text-foreground mt-1">Ethereum Mainnet</p>
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
                    <Label className="text-sm font-medium text-muted-foreground">ZKP Status</Label>
                    <p className="text-sm text-green-500 mt-1">✓ Active</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Link Status</Label>
                    <p className="text-sm text-green-500 mt-1">✓ OAuth & Web3 Linked</p>
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
                  <Label htmlFor="token-address" className="text-sm font-medium">Token Contract Address</Label>
                  <Input
                    id="token-address"
                    placeholder="0x..."
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="token-symbol" className="text-sm font-medium">Token Symbol</Label>
                  <Input
                    id="token-symbol"
                    placeholder="e.g., USDC"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="token-name" className="text-sm font-medium">Token Name</Label>
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
                  <Label htmlFor="recipient" className="text-sm font-medium">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="token-select" className="text-sm font-medium">Select Token</Label>
                  <Select value={selectedToken} onValueChange={setSelectedToken}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                      <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                      <SelectItem value="USDT">USDT - Tether</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Send Transaction
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
                  <Label className="text-sm font-medium">Your Wallet Address</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                    <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                      {publicAddress}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(publicAddress, 'Wallet Address')}
                      className="p-1 h-auto hover:bg-background"
                    >
                      <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
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
      
      <div className="pt-16 flex">
        {/* Left Sidebar */}
        <div className="w-56 bg-background border-r border-border/50 min-h-screen">
          <div className="p-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wide">Menu</h2>
            <div className="border-b border-border/30 mb-6"></div>
            
            {/* Account Information Section */}
            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Account Info</div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Email Address</div>
                  <div className="text-xs text-foreground font-mono break-all">
                    demo.user@gmail.com
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Public Address</div>
                  <div className="text-xs text-foreground font-mono break-all">
                    0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Contract Address</div>
                  <div className="text-xs text-foreground font-mono break-all">
                    0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
                  </div>
                </div>
              </div>
            </div>
            
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
            
            {/* Additional Section */}
            <div className="mt-6 pt-6 border-t border-border/30">
              <div className="text-sm text-foreground">
                aaaa
              </div>
            </div>
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
                  {activeMenu === "overview" && "Account information and status overview"}
                  {activeMenu === "add-token" && "Add new tokens to your wallet"}
                  {activeMenu === "send" && "Send coins or tokens to other addresses"}
                  {activeMenu === "receive" && "Receive coins or tokens from others"}
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

          {/* Hero Section - Account Information */}
          <div className="mb-8 p-6 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                  <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                    demo.user@gmail.com
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('demo.user@gmail.com', 'Email')}
                    className="p-1 h-auto hover:bg-background"
                  >
                    <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Public Address</Label>
                <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                  <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                    0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b', 'Public Address')}
                    className="p-1 h-auto hover:bg-background"
                  >
                    <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Contract Address</Label>
                <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                  <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                    0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard('0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', 'Contract Address')}
                    className="p-1 h-auto hover:bg-background"
                  >
                    <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                  </Button>
                </div>
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