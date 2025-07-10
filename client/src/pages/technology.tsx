import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Key, Users, Settings, Lock, Globe, Check, ArrowRight, Zap, Network, Building2 } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Technology() {
  const coreComponents = [
    {
      icon: <Users className="w-16 h-16 text-primary mb-6" />,
      title: "EOA (Externally Owned Account)",
      description: "This is a standard Web3 blockchain account, managed by a user's private key. It ensures full ownership and control of assets and identity.",
      features: [
        "Full asset ownership and control",
        "Standard Web3 blockchain account",
        "Private key management",
        "Direct blockchain interaction"
      ]
    },
    {
      icon: <Settings className="w-16 h-16 text-accent mb-6" />,
      title: "CA (Contract Account)",
      description: "A programmable smart contract wallet that authorizes transactions only when both Web2 and Web3 authentications are satisfied. It acts as a decentralized two-factor authentication (2FA) mechanism.",
      features: [
        "Programmable smart contract wallet",
        "Dual authentication requirement",
        "Decentralized 2FA mechanism",
        "Transaction authorization control"
      ]
    },
    {
      icon: <Shield className="w-16 h-16 text-primary mb-6" />,
      title: "ZKP (Zero-Knowledge Proof)",
      description: "ZKP allows the system to confirm login success without disclosing sensitive user data on-chain. It enables secure, private verification of identity credentials.",
      features: [
        "Private identity verification",
        "No sensitive data on-chain",
        "Secure credential confirmation",
        "Enhanced privacy protection"
      ]
    }
  ];

  const comparisonFeatures = [
    { feature: "Authentication Type", traditional: "Multiple private keys", oauth3: "Web2 login + Web3 signature" },
    { feature: "User Experience", traditional: "Complex", oauth3: "Simple and intuitive" },
    { feature: "Key Recovery", traditional: "Manual and limited", oauth3: "Platform-assisted options available" },
    { feature: "Privacy", traditional: "Strong", oauth3: "Enhanced with ZKP" },
    { feature: "Cross-Chain Compatibility", traditional: "Limited", oauth3: "Fully supported" }
  ];

  const supportedChains = [
    { name: "Ethereum", status: "Supported" },
    { name: "BNB Chain", status: "Supported" },
    { name: "Solana", status: "Supported" },
    { name: "Avalanche", status: "Supported" },
    { name: "Tron", status: "Supported" }
  ];

  const securitySteps = [
    {
      step: "1",
      title: "Web2 Authentication",
      description: "User logs in with familiar Web2 account (Google, Kakao, Facebook)",
      icon: <Globe className="w-12 h-12 text-accent" />
    },
    {
      step: "2",
      title: "Web3 Signature",
      description: "Transaction signed with private Web3 key for cryptographic verification",
      icon: <Key className="w-12 h-12 text-primary" />
    },
    {
      step: "3",
      title: "ZKP Verification",
      description: "Zero-Knowledge Proof confirms identity without revealing personal data",
      icon: <Shield className="w-12 h-12 text-primary" />
    },
    {
      step: "4",
      title: "Transaction Execution",
      description: "Smart contract executes transaction only when all conditions are met",
      icon: <Lock className="w-12 h-12 text-accent" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">
              <span className="clean-logo">OAuth 3</span> Technology
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto tech-body leading-relaxed">
              OAuth 3 represents a new standard in digital authentication, merging the user-friendliness of Web2 with the security and decentralization of Web3. By leveraging smart contracts, blockchain-based identities, and Zero-Knowledge Proof (ZKP), OAuth 3 creates a hybrid system that delivers both strong protection and seamless user experience.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Hybrid Architecture Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Hybrid Authentication Architecture</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 integrates Web2-style social logins with cryptographic signatures from Web3 wallets, adding an additional layer of privacy through ZKP technology.
            </p>
          </div>

          <Card className="bg-card shadow-lg card-hover">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Network className="w-24 h-24 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-4">Balanced Security & Usability</h3>
                <p className="text-muted-foreground text-lg">
                  This hybrid approach balances ease of use with the highest levels of security and privacy, ensuring that identity is verified without revealing personal data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Components Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Core Components</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 is powered by three main technological elements that work together to provide secure, private, and user-friendly authentication.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreComponents.map((component, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    {component.icon}
                    <h3 className="text-xl font-semibold text-foreground mb-4">{component.title}</h3>
                    <p className="text-muted-foreground mb-6">{component.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {component.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Multi-Layered Security Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Multi-Layered Security</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 introduces a dual-authentication mechanism executed entirely on the blockchain. A transaction can only be completed when both Web2 and Web3 authentications are satisfied.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securitySteps.map((step, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold text-lg">{step.step}</span>
                    </div>
                    {step.icon}
                    <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-card shadow-lg card-hover">
              <CardContent className="p-8">
                <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-4">Enhanced Protection</h3>
                <p className="text-muted-foreground">
                  This eliminates the risk posed by the compromise of either credential alone. The result is a system that offers protection against phishing, key theft, and server breaches.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Key Advantages Over Existing Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 stands out by combining security and usability, allowing even non-technical users to safely access Web3 applications.
            </p>
          </div>

          <Card className="bg-card shadow-lg card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                      <th className="text-left p-4 font-semibold text-foreground">Traditional Web3 Multisig</th>
                      <th className="text-left p-4 font-semibold text-primary">OAuth 3 Hybrid 2FA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-4 font-medium text-foreground">{row.feature}</td>
                        <td className="p-4 text-muted-foreground">{row.traditional}</td>
                        <td className="p-4 text-primary font-semibold">{row.oauth3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cross-Chain Interoperability */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Cross-Chain Interoperability</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 is compatible with major blockchain networks and leverages technologies like account abstraction to ensure unified and simplified cross-chain transactions.
            </p>
          </div>

          <Card className="bg-card shadow-lg card-hover">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6">Supported Blockchains</h3>
                  <div className="space-y-4">
                    {supportedChains.map((chain, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-foreground font-medium">{chain.name}</span>
                        <span className="text-primary font-semibold">{chain.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <Network className="w-32 h-32 text-primary mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Unified Experience</h3>
                  <p className="text-muted-foreground">
                    Users can perform transactions across different blockchains in a unified and simplified way, removing the complexity of managing multiple wallets and interfaces.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Architecture */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Enterprise-Ready Architecture</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              For organizations, OAuth 3 offers programmable fund control, secure multi-signature processes, and transparent governance through smart contracts.
            </p>
          </div>

          <Card className="bg-card shadow-lg card-hover">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Cost Reduction</h3>
                  <p className="text-muted-foreground">
                    Significantly reduces costs compared to traditional custodial services while maintaining enterprise-grade security.
                  </p>
                </div>
                <div className="text-center">
                  <Settings className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Enhanced Efficiency</h3>
                  <p className="text-muted-foreground">
                    Enhances operational efficiency and security through programmable smart contracts and transparent governance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6 professional-heading">Ready to Experience OAuth 3?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body mb-8">
            Discover how OAuth 3 can transform your authentication experience with unparalleled security, privacy, and ease of use.
          </p>
          
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold">
            <Zap className="mr-2 h-5 w-5" />
            Explore OAuth 3 Demo
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}