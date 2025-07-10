import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Settings, Lock, Check } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: <Lightbulb className="w-12 h-12 text-primary mb-4" />,
      title: "Concept & Necessity",
      description: "Traditional authentication methods face scalability and security challenges. OAuth 3 addresses these limitations by creating a unified protocol that works across both centralized and decentralized environments."
    },
    {
      icon: <Settings className="w-12 h-12 text-primary mb-4" />,
      title: "Core Technical Components",
      description: "Our comprehensive technical stack includes:",
      features: [
        "Account Abstraction Layer",
        "Smart Contract Integration", 
        "Cross-chain Compatibility",
        "Zero-Knowledge Verification"
      ]
    },
    {
      icon: <Lock className="w-12 h-12 text-primary mb-4" />,
      title: "Multi-layered Security",
      description: "Our security architecture implements multiple validation layers, cryptographic proofs, and decentralized verification mechanisms to ensure maximum protection against various attack vectors."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">About OAuth 3</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            OAuth 3 represents a paradigm shift in authentication, seamlessly integrating Web2 user experience with Web3 security infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  {feature.icon}
                  <h3 className="text-2xl font-semibold text-foreground mb-4">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                {feature.features && (
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
