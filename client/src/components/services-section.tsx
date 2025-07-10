import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building, Smartphone, Key, Shield, Network, Users, TrendingUp } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: <User className="w-20 h-20 text-[hsl(217,91%,60%)] mb-4" />,
      title: "Individual User Services",
      features: [
        {
          icon: <Smartphone className="w-5 h-5 text-[hsl(217,91%,60%)]" />,
          title: "Personal Wallet Integration",
          description: "Seamless connection between your existing wallets and OAuth 3 enabled applications."
        },
        {
          icon: <Key className="w-5 h-5 text-[hsl(217,91%,60%)]" />,
          title: "Universal Authentication",
          description: "Single sign-on across Web2 and Web3 platforms with enhanced security."
        },
        {
          icon: <Shield className="w-5 h-5 text-[hsl(217,91%,60%)]" />,
          title: "Privacy Protection",
          description: "Zero-knowledge proofs ensure your data remains private while enabling verification."
        }
      ],
      buttonText: "Get Started",
      buttonVariant: "default" as const
    },
    {
      icon: <Building className="w-20 h-20 text-[hsl(217,91%,60%)] mb-4" />,
      title: "Corporate User Services",
      features: [
        {
          icon: <Network className="w-5 h-5 text-[hsl(217,91%,60%)]" />,
          title: "Enterprise Integration",
          description: "Comprehensive API suite for integrating OAuth 3 into existing enterprise systems."
        },
        {
          icon: <Users className="w-5 h-5 text-[hsl(217,91%,60%)]" />,
          title: "Multi-tenant Management",
          description: "Scalable user management with role-based access control and audit trails."
        },
        {
          icon: <TrendingUp className="w-5 h-5 text-[hsl(217,91%,60%)]" />,
          title: "Analytics & Reporting",
          description: "Detailed insights into authentication patterns and security metrics."
        }
      ],
      buttonText: "Contact Sales",
      buttonVariant: "secondary" as const
    }
  ];

  return (
    <section id="services" className="py-20 bg-[hsl(210,40%,96%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[hsl(0,0%,20%)] mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            OAuth 3 serves both individual users and enterprises with tailored authentication solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  {service.icon}
                  <h3 className="text-2xl font-semibold text-[hsl(0,0%,20%)]">{service.title}</h3>
                </div>
                <div className="space-y-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-4">
                      {feature.icon}
                      <div>
                        <h4 className="font-semibold text-[hsl(0,0%,20%)] mb-2">{feature.title}</h4>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button 
                    className={`px-6 py-3 font-semibold ${
                      service.buttonVariant === 'default' 
                        ? 'bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white' 
                        : 'bg-[hsl(35,100%,50%)] hover:bg-[hsl(35,100%,45%)] text-white'
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
