import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building, Smartphone, Key, Shield, Network, Users, TrendingUp } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: <User className="w-20 h-20 text-primary mb-4" />,
      title: "Individual User Services",
      features: [
        {
          icon: <Smartphone className="w-5 h-5 text-primary" />,
          title: "Personal Wallet Integration",
          description: "Seamless connection between your existing wallets and OAuth 3 enabled applications."
        },
        {
          icon: <Key className="w-5 h-5 text-primary" />,
          title: "Universal Authentication",
          description: "Single sign-on across Web2 and Web3 platforms with enhanced security."
        },
        {
          icon: <Shield className="w-5 h-5 text-primary" />,
          title: "Privacy Protection",
          description: "Zero-knowledge proofs ensure your data remains private while enabling verification."
        }
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const
    },
    {
      icon: <Building className="w-20 h-20 text-primary mb-4" />,
      title: "Corporate User Services",
      features: [
        {
          icon: <Network className="w-5 h-5 text-primary" />,
          title: "Enterprise Integration",
          description: "Comprehensive API suite for integrating OAuth 3 into existing enterprise systems."
        },
        {
          icon: <Users className="w-5 h-5 text-primary" />,
          title: "Multi-tenant Management",
          description: "Scalable user management with role-based access control and audit trails."
        },
        {
          icon: <TrendingUp className="w-5 h-5 text-primary" />,
          title: "Analytics & Reporting",
          description: "Detailed insights into authentication patterns and security metrics."
        }
      ],
      buttonText: "Contact Sales",
      buttonVariant: "secondary" as const
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            OAuth 3 serves both individual users and enterprises with tailored authentication solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <Card key={index} className="bg-card shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  {service.icon}
                  <h3 className="text-2xl font-semibold text-foreground">{service.title}</h3>
                </div>
                <div className="space-y-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-4">
                      {feature.icon}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button 
                    className={`px-6 py-3 font-semibold ${
                      service.buttonVariant === 'default' 
                        ? 'bg-primary hover:bg-primary/90 text-white' 
                        : 'bg-accent hover:bg-accent/90 text-white'
                    }`}
                  >
                    {service.buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
