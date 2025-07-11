import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Settings, Lock, Check, Users, Building2, Coins, Shield, Key, Globe, ArrowRight, Zap } from "lucide-react";

export default function AboutSection() {
  const problemSolutions = [
    {
      icon: <Globe className="w-8 h-8 text-accent mb-4" />,
      title: "Web2 Authentication",
      problems: ["Centralized control", "Privacy concerns", "Single points of failure"],
      color: "text-accent"
    },
    {
      icon: <Key className="w-8 h-8 text-primary mb-4" />,
      title: "Web3 Authentication", 
      problems: ["Complex user experience", "Risk of key loss", "Inaccessible to average users"],
      color: "text-primary"
    }
  ];

  const coreComponents = [
    {
      icon: <Users className="w-12 h-12 text-primary mb-4" />,
      title: "EOA (Externally Owned Account)",
      description: "A blockchain account managed by a user's private key—providing full asset ownership and control."
    },
    {
      icon: <Settings className="w-12 h-12 text-accent mb-4" />,
      title: "CA (Contract Account)",
      description: "A smart contract wallet that only authorizes transactions if both Web2 login and Web3 private key signatures are validated."
    },
    {
      icon: <Shield className="w-12 h-12 text-primary mb-4" />,
      title: "ZKP (Zero-Knowledge Proof)",
      description: "Ensures that login credentials are never exposed on-chain while still proving authentication occurred."
    }
  ];

  const applications = [
    {
      icon: <Users className="w-16 h-16 text-primary mb-6" />,
      title: "For Individuals",
      description: "Easy-to-use interface where users can manage assets across multiple blockchains using familiar Web2 logins.",
      features: [
        "Cross-chain asset management",
        "Familiar Web2 login experience", 
        "Account abstraction for seamless UX",
        "Gas fee handling behind the scenes"
      ]
    },
    {
      icon: <Building2 className="w-16 h-16 text-accent mb-6" />,
      title: "For Enterprises",
      description: "Reduces crypto asset custody costs by 90% while enabling secure, rule-based asset management.",
      features: [
        "Programmable multi-signature approvals",
        "Cross-chain support",
        "Transparent governance",
        "Scalable custody solutions"
      ]
    }
  ];

  const comparisonFeatures = [
    { feature: "Authentication Type", oauth2: "Centralized", web3: "Decentralized", oauth3: "Hybrid" },
    { feature: "Security Level", oauth2: "Medium", web3: "High", oauth3: "Very High" },
    { feature: "User Experience", oauth2: "Simple", web3: "Complex", oauth3: "Balanced" },
    { feature: "Data Ownership", oauth2: "Platform", web3: "User", oauth3: "User" },
    { feature: "Privacy", oauth2: "Limited", web3: "Strong", oauth3: "Enhanced (via ZKP)" },
    { feature: "Interoperability", oauth2: "High", web3: "Low", oauth3: "High" }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-foreground mb-6 professional-heading">About OAuth 3</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto tech-body leading-relaxed">
            OAuth 3 represents a revolutionary leap in digital authentication, blending the convenience of Web2 login methods with the decentralized security of Web3. As the next-generation hybrid authentication protocol, OAuth 3 addresses the fundamental shortcomings of both centralized and decentralized systems.
          </p>
        </div>

        {/* Problem Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 professional-heading">The Problem: Web2 vs. Web3</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              The trade-off between convenience (Web2) and security/ownership (Web3) has been a persistent dilemma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {problemSolutions.map((solution, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    {solution.icon}
                    <h4 className="text-xl font-semibold text-foreground mb-4">{solution.title}</h4>
                  </div>
                  <ul className="space-y-3">
                    {solution.problems.map((problem, problemIndex) => (
                      <li key={problemIndex} className="flex items-center text-muted-foreground">
                        <div className={`w-2 h-2 rounded-full ${solution.color.replace('text-', 'bg-')} mr-3`}></div>
                        {problem}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Solution Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 professional-heading">The Solution: What is OAuth 3?</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 is a hybrid authentication framework that combines the ease-of-use of Web2 social logins, the robust security of blockchain-based Web3 identity, and the privacy-enhancing capabilities of Zero-Knowledge Proof technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreComponents.map((component, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    {component.icon}
                    <h4 className="text-xl font-semibold text-foreground mb-4">{component.title}</h4>
                  </div>
                  <p className="text-muted-foreground text-center">{component.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Architecture */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 professional-heading">Security Architecture</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 introduces multi-layered security requiring both Web2 login authentication AND Web3 private key signatures to authorize blockchain transactions.
            </p>
          </div>

          <Card className="bg-card shadow-lg card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-accent mx-auto mb-4" strokeWidth={1.5} />
                  <h4 className="text-lg font-semibold text-foreground mb-2">Web2 Login</h4>
                  <p className="text-muted-foreground">Google, Kakao, etc.</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">+</div>
                </div>
                <div className="text-center">
                  <Key className="w-16 h-16 text-primary mx-auto mb-4" strokeWidth={1.5} />
                  <h4 className="text-lg font-semibold text-foreground mb-2">Web3 Signature</h4>
                  <p className="text-muted-foreground">Private key validation</p>
                </div>
                <div className="text-center">
                  <ArrowRight className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <Shield className="w-16 h-16 text-primary mx-auto mb-4" strokeWidth={1.5} />
                  <h4 className="text-lg font-semibold text-foreground mb-2">Secure Transaction</h4>
                  <p className="text-muted-foreground">Smart contract verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 professional-heading">OAuth 3 vs Traditional Models</h3>
          </div>

          <Card className="bg-card shadow-lg card-hover overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                      <th className="text-left p-4 font-semibold text-foreground">OAuth 2.0 (Web2)</th>
                      <th className="text-left p-4 font-semibold text-foreground">Web3-only</th>
                      <th className="text-left p-4 font-semibold text-primary">OAuth 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="p-4 font-medium text-foreground">{row.feature}</td>
                        <td className="p-4 text-muted-foreground">{row.oauth2}</td>
                        <td className="p-4 text-muted-foreground">{row.web3}</td>
                        <td className="p-4 text-primary font-semibold">{row.oauth3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 professional-heading">Real-World Applications</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {applications.map((app, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    {app.icon}
                    <h4 className="text-2xl font-semibold text-foreground mb-4">{app.title}</h4>
                    <p className="text-muted-foreground">{app.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {app.features.map((feature, featureIndex) => (
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

        {/* Ecosystem Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4 professional-heading">Incentivized Ecosystem</h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              OAuth 3 is more than just a technology—it's a sustainable ecosystem driven by a robust tokenomics model.
            </p>
          </div>

          <Card className="bg-card shadow-lg card-hover">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <Coins className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-foreground mb-4">User Incentives</h4>
                  <p className="text-muted-foreground">
                    Individuals who store assets in OAuth 3 wallets earn OA3 tokens as passive rewards—similar to yield farming but for authentication.
                  </p>
                </div>
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-foreground mb-4">Enterprise Rewards</h4>
                  <p className="text-muted-foreground">
                    Monthly fees paid by organizations are pooled and redistributed to users as cross-chain rewards, governed democratically by OA3 token holders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Future Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6 professional-heading">The Future of Authentication</h3>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto tech-body mb-8">
            OAuth 3 is not just a new protocol—it's a paradigm shift in how we secure identity and data online. By harmonizing the strengths of Web2 and Web3, OAuth 3 provides a practical and powerful framework for the future of digital identity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center justify-center space-x-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">Convenience without compromising sovereignty</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">Security without sacrificing usability</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-foreground">Privacy without losing interoperability</span>
            </div>
          </div>

          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold">
            <Zap className="mr-2 h-5 w-5" />
            Get Started with OAuth 3
          </Button>
        </div>
      </div>
    </section>
  );
}
