import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Cpu, EyeOff, ArrowRight } from "lucide-react";

export default function TechnologySection() {
  const technologies = [
    {
      icon: <UserCheck className="w-16 h-16 text-primary" />,
      title: "Account Abstraction (ERC-4337)",
      description: "ERC-4337 enables smart contract wallets without protocol changes, allowing users to interact with blockchain applications using familiar Web2 interfaces while maintaining Web3 security guarantees.",
      features: [
        "Gasless transactions for end users",
        "Social recovery mechanisms",
        "Batch transaction processing"
      ],
      isReversed: false
    },
    {
      icon: <Cpu className="w-16 h-16 text-primary" />,
      title: "Smart Contract Automation",
      description: "Automated smart contracts handle authentication flows, permission management, and secure token exchange without requiring manual intervention or centralized authorities.",
      features: [
        "Automated permission validation",
        "Self-executing security protocols",
        "Decentralized access control"
      ],
      isReversed: true
    },
    {
      icon: <EyeOff className="w-16 h-16 text-primary" />,
      title: "Zero-Knowledge Proof (ZKP)",
      description: "ZKP technology allows users to prove their identity and permissions without revealing sensitive information, ensuring privacy while maintaining verifiable security.",
      features: [
        "Privacy-preserving authentication",
        "Verifiable credentials without exposure",
        "Selective disclosure capabilities"
      ],
      isReversed: false
    }
  ];

  return (
    <section id="technology" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Core Technologies</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            OAuth 3 leverages cutting-edge blockchain and cryptographic technologies to deliver unparalleled security and user experience.
          </p>
        </div>

        <div className="space-y-16">
          {technologies.map((tech, index) => (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${tech.isReversed ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`space-y-6 ${tech.isReversed ? 'lg:order-2' : ''}`}>
                <div className="flex items-center space-x-4">
                  {tech.icon}
                  <h3 className="text-3xl font-semibold text-foreground">{tech.title}</h3>
                </div>
                <p className="text-muted-foreground text-lg">{tech.description}</p>
                <ul className="space-y-2">
                  {tech.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-muted-foreground">
                      <ArrowRight className="w-4 h-4 text-accent mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${tech.isReversed ? 'lg:order-1' : ''}`}>
                <Card className="bg-card border-border card-hover">
                  <CardContent className="p-8">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="w-24 h-24 text-primary opacity-70">
                        {tech.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
