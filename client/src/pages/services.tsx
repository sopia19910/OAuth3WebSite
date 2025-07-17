import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ShieldCheckIcon, 
  KeyIcon, 
  GlobeAltIcon, 
  CheckIcon, 
  ArrowRightIcon, 
  BoltIcon, 
  GlobeAmericasIcon, 
  LockClosedIcon, 
  CurrencyDollarIcon, 
  CogIcon 
} from "@heroicons/react/24/outline";
import { Check } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ethereumLogo from "@assets/image_1752123792166.png";
import avalancheLogo from "@assets/image_1752123808428.png";
import binanceLogo from "@assets/image_1752124480119.png";
import solanaLogo from "@assets/image_1752123844961.png";
import tronLogo from "@assets/image_1752123864401.png";

export default function Services() {
  const individualFeatures = [
    {
      icon: <GlobeAltIcon className="w-12 h-12 text-primary mb-4" strokeWidth={1} />,
      title: "Familiar Web2 Login",
      description: "Access blockchain accounts using Google, Kakao, Facebook, and email—no seed phrases required."
    },
    {
      icon: <GlobeAmericasIcon className="w-12 h-12 text-accent mb-4" strokeWidth={1} />,
      title: "Multi-Chain Support",
      description: "Control assets across Ethereum, Solana, BNB Chain, Avalanche, and Tron with a single interface."
    },
    {
      icon: <ShieldCheckIcon className="w-12 h-12 text-primary mb-4" strokeWidth={1} />,
      title: "Zero-Knowledge Privacy",
      description: "Verify identity without exposing personal information using advanced ZKP technology."
    },
    {
      icon: <CogIcon className="w-12 h-12 text-accent mb-4" strokeWidth={1} />,
      title: "Account Abstraction",
      description: "Automated gas fee payments and transaction bundling for seamless user experience."
    }
  ];

  const enterpriseFeatures = [
    {
      icon: <BuildingOfficeIcon className="w-12 h-12 text-primary mb-4" strokeWidth={1} />,
      title: "Smart Contract Automation",
      description: "Automate fund disbursement rules with programmable multi-signature approvals."
    },
    {
      icon: <UsersIcon className="w-12 h-12 text-accent mb-4" strokeWidth={1} />,
      title: "Multisig Governance",
      description: "Support complex internal governance structures with customizable approval workflows."
    },
    {
      icon: <GlobeAmericasIcon className="w-12 h-12 text-primary mb-4" strokeWidth={1} />,
      title: "Cross-Chain Management",
      description: "Unified asset management across multiple blockchain networks in one interface."
    },
    {
      icon: <CurrencyDollarIcon className="w-12 h-12 text-accent mb-4" strokeWidth={1} />,
      title: "Cost Reduction",
      description: "Over 90% reduction in custodial expenses compared to traditional third-party solutions."
    }
  ];

  const blockchainSupport = [
    {
      name: "Ethereum",
      strength: "Largest DeFi ecosystem",
      useCases: ["DeFi", "NFTs", "dApps"],
      color: "text-blue-400",
      logo: ethereumLogo
    },
    {
      name: "BNB Chain",
      strength: "Low fees, fast confirmation",
      useCases: ["DEXs", "Gaming", "DeFi"],
      color: "text-yellow-400",
      logo: binanceLogo
    },
    {
      name: "Solana",
      strength: "Ultra-fast transaction speeds",
      useCases: ["NFTs", "Web3 apps"],
      color: "text-purple-400",
      logo: solanaLogo
    },
    {
      name: "Avalanche",
      strength: "Subnet architecture",
      useCases: ["Enterprise", "DeFi"],
      color: "text-red-400",
      logo: avalancheLogo
    },
    {
      name: "Tron",
      strength: "High throughput, media focus",
      useCases: ["Content platforms", "Payments"],
      color: "text-green-400",
      logo: tronLogo
    }
  ];

  const serviceComparison = [
    { category: "Target Users", individual: "General consumers", enterprise: "Token foundations, Web3 companies" },
    { category: "Login Method", individual: "Google, Kakao, Facebook, email", enterprise: "Custom email domain + ZKP" },
    { category: "Blockchain Support", individual: "Ethereum, Solana, Avalanche, BNB, Tron", enterprise: "Broad cross-chain compatibility" },
    { category: "Main Features", individual: "Easy wallet access, no seed phrase required", enterprise: "Smart contract automation, multisig control" },
    { category: "Privacy Protection", individual: "ZKP-based identity verification", enterprise: "ZKP-enhanced governance" },
    { category: "Key Benefits", individual: "Ease of use, security, privacy", enterprise: "Reduced cost, transparency, decentralization" }
  ];

  const userBenefits = [
    "Significantly reduced entry barriers for Web3 adoption",
    "Seamless experience similar to using a traditional fintech app",
    "Secure asset management without compromising privacy or control"
  ];

  const enterpriseAdvantages = [
    "Over 90% cost reduction in custodial expenses",
    "Enhanced security and operational transparency",
    "Scalable infrastructure for multi-chain token strategies"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">Services</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto tech-body leading-relaxed">
              OAuth 3 is more than just a secure authentication protocol—it's a complete service ecosystem designed for both individuals and enterprises. By combining Web2-style convenience with Web3-level security and privacy, OAuth 3 delivers customized solutions that simplify blockchain access, improve digital asset management, and empower ecosystem participants through innovative incentive models.
            </p>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Services Overview - Left Right Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Individual User Services - Left */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Individual User Services</h2>
            <p className="text-lg text-primary mb-4">"Web3 wallet that feels like Web2"</p>
            <p className="text-sm text-muted-foreground mb-8">
              Access blockchain accounts using familiar Web2 social logins. No seed phrases or complex key management required.
            </p>
            
            <div className="space-y-4">
              {individualFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-primary" strokeWidth={2} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Services - Right */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Enterprise Services</h2>
            <p className="text-lg text-primary mb-4">"Secure asset management for organizations"</p>
            <p className="text-sm text-muted-foreground mb-8">
              All-in-one solution for token foundations to manage digital assets without expensive third-party custodians.
            </p>
            
            <div className="space-y-4">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-accent" strokeWidth={2} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blockchain Ecosystem Support */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Blockchain Ecosystem Support</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 supports five major blockchain networks, each optimized for specific use cases. OAuth 3 is designed to unify the user experience across these chains, allowing frictionless interaction within a multi-chain world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blockchainSupport.map((blockchain, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={blockchain.logo} 
                        alt={`${blockchain.name} logo`} 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{blockchain.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{blockchain.strength}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">Main Use Cases:</h4>
                    <div className="flex flex-wrap gap-2">
                      {blockchain.useCases.map((useCase, useCaseIndex) => (
                        <span key={useCaseIndex} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Unified Service Architecture */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Unified Service Architecture</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              A comprehensive comparison of OAuth 3's individual and enterprise service offerings.
            </p>
          </div>

          <Card className="bg-card shadow-lg card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Category</th>
                      <th className="text-left p-4 font-semibold text-primary">Individual Services</th>
                      <th className="text-left p-4 font-semibold text-accent">Enterprise Services</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceComparison.map((row, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-4 font-medium text-foreground">{row.category}</td>
                        <td className="p-4 text-muted-foreground">{row.individual}</td>
                        <td className="p-4 text-muted-foreground">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Foundation */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Technical Foundation</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 services are built on cutting-edge blockchain technologies that ensure security, privacy, and seamless user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="text-center">
                  <CogIcon className="w-16 h-16 text-primary mx-auto mb-4" strokeWidth={1} />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Account Abstraction (ERC-4337)</h3>
                  <p className="text-muted-foreground">
                    Automates gas fee payments and bundles multi-step transactions into a single action for enhanced user experience.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="text-center">
                  <ShieldCheckIcon className="w-16 h-16 text-accent mx-auto mb-4" strokeWidth={1} />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Zero-Knowledge Proof (ZKP)</h3>
                  <p className="text-muted-foreground">
                    Ensures privacy by verifying user identity without exposing personal information on the blockchain.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="text-center">
                  <LockClosedIcon className="w-16 h-16 text-primary mx-auto mb-4" strokeWidth={1} />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Smart Contract 2FA</h3>
                  <p className="text-muted-foreground">
                    Dual-layer security using both Web2 login and Web3 key signature for maximum protection.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6 professional-heading">Ready to Transform Your Digital Experience?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body mb-8">
            Whether you're an individual looking for seamless Web3 access or an enterprise seeking cost-efficient asset management, OAuth 3 has the perfect solution for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold">
              <UsersIcon className="mr-2 h-5 w-5" strokeWidth={1} />
              Get Started - Individual
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-3 font-semibold">
              <BuildingOfficeIcon className="mr-2 h-5 w-5" strokeWidth={1} />
              Contact Sales - Enterprise
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}