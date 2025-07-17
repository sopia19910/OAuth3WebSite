import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  GlobeAltIcon,
  WalletIcon,
  DocumentIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  ClipboardIcon
} from "@heroicons/react/24/outline";
import { SiGoogle } from "react-icons/si";
import Navbar from "@/components/navbar";

type DemoStep = "login" | "web3-setup" | "balance" | "zkp-generation" | "zkp-display" | "complete";

export default function Demo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>("login");
  const [web3Option, setWeb3Option] = useState("new");
  const [privateKey, setPrivateKey] = useState("");
  const [zkpProgress, setZkpProgress] = useState(0);

  const handleGoogleLogin = () => {
    setCurrentStep("web3-setup");
  };

  const handleWeb3Setup = () => {
    setCurrentStep("balance");
  };

  const handleRequestGasFee = () => {
    setCurrentStep("zkp-generation");
    // Simulate ZKP generation progress
    const interval = setInterval(() => {
      setZkpProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentStep("zkp-display"), 500);
          return 100;
        }
        return prev + 25;
      });
    }, 800);
  };

  const handleViewZKP = () => {
    setCurrentStep("complete");
  };

  const handleGoToDashboard = () => {
    // This would typically navigate to a dashboard
    alert("Demo completed! In a real implementation, this would redirect to the OAuth 3 dashboard.");
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert(`Failed to copy ${label}`);
    }
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
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
              size="lg"
            >
              <SiGoogle className="w-5 h-5 mr-2" />
              Login with Google
            </Button>
          </div>
        );

      case "web3-setup":
        return (
          <div className="flex flex-col items-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Connect your Web3 account</h2>
            
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
                  placeholder="Enter your private key"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            <Button 
              onClick={handleWeb3Setup}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
            >
              Next
            </Button>
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
                    <Label className="text-sm font-medium text-muted-foreground">Private Address</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                      <p className="text-sm text-foreground font-mono break-all flex-1 mr-2">
                        0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'Private Address')}
                        className="p-1 h-auto hover:bg-background"
                      >
                        <ClipboardIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" strokeWidth={1} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Balance Info */}
              <div className="bg-card rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Balance Information</h3>
                <div className="text-center">
                  <h4 className="text-md font-medium text-foreground mb-2">ETH Balance</h4>
                  <p className="text-muted-foreground">0.000000000000000000 ETH</p>
                </div>
              </div>
              
              <div className="text-center py-4">
                <p className="text-destructive text-sm">
                  ETH balance is insufficient. Gas fee required.
                </p>
              </div>
            </div>

            <Button 
              onClick={handleRequestGasFee}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
            >
              Request Gas Fee
            </Button>
          </div>
        );

      case "zkp-generation":
        return (
          <div className="flex flex-col items-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Generating ZKP to link OAuth and Web3 accounts
            </h2>
            
            <div className="w-full mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">{zkpProgress}%</span>
              </div>
              <Progress value={zkpProgress} className="w-full" />
            </div>

            <Button 
              onClick={handleViewZKP}
              disabled={zkpProgress < 100}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg disabled:opacity-50"
            >
              View Generated ZKP
            </Button>
          </div>
        );

      case "zkp-display":
        return (
          <div className="flex flex-col max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Display Items</h2>
            
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">ZK Account Address</span>
                    <span className="text-sm text-foreground md:col-span-2 font-mono break-all">
                      0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">Owner (EOA)</span>
                    <span className="text-sm text-foreground md:col-span-2 font-mono break-all">
                      0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">ETH Balance</span>
                    <span className="text-sm text-foreground md:col-span-2">1.23 ETH</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">Requires ZK Proof</span>
                    <span className="text-sm text-foreground md:col-span-2">Yes</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">Email Hash (Poseidon)</span>
                    <span className="text-sm text-foreground md:col-span-2 font-mono break-all">
                      0xabcdef1234567890abcdef1234567890
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    <span className="text-sm font-medium text-muted-foreground">Domain Hash (Poseidon)</span>
                    <span className="text-sm text-foreground md:col-span-2 font-mono break-all">
                      0x0987654321fedcba0987654321fedcba
                    </span>
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
      <div className="pt-16 min-h-screen flex items-center justify-center gradient-bg">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}