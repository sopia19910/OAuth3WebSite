import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheckIcon,
  KeyIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function About() {
  const keyBenefits = [
    {
      title: "Enhanced Security",
      description: "Multi-layered authentication combining Web2 convenience with Web3 cryptographic security."
    },
    {
      title: "User Experience",
      description: "Familiar login methods while maintaining full control over digital assets."
    },
    {
      title: "Privacy First",
      description: "Zero-knowledge proofs ensure personal data never leaves your control."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg tech-grid">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">
              About <span className="clean-logo">OAuth 3</span>
            </h1>
            <p className="text-xl text-muted-foreground tech-body leading-relaxed">
              The next-generation authentication protocol that bridges Web2 convenience with Web3 security.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* What is OAuth 3 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 professional-heading text-center">
            What is OAuth 3?
          </h2>
          <Card className="bg-card shadow-lg">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                OAuth 3 is a hybrid authentication framework that solves the fundamental trade-off between 
                convenience and security. It combines:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <GlobeAltIcon className="w-6 h-6 text-muted-foreground mt-1 flex-shrink-0 [&>path]:stroke-[1.5]" />
                  <div>
                    <h4 className="font-semibold text-foreground">Web2 Login Methods</h4>
                    <p className="text-muted-foreground">Familiar social logins (Google, Facebook) that users already know</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <KeyIcon className="w-6 h-6 text-muted-foreground mt-1 flex-shrink-0 [&>path]:stroke-[1.5]" />
                  <div>
                    <h4 className="font-semibold text-foreground">Web3 Security</h4>
                    <p className="text-muted-foreground">Blockchain-based authentication and decentralized control</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-muted-foreground mt-1 flex-shrink-0 [&>path]:stroke-[1.5]" />
                  <div>
                    <h4 className="font-semibold text-foreground">Zero-Knowledge Proofs</h4>
                    <p className="text-muted-foreground">Privacy-preserving technology that protects user data</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 professional-heading text-center">
            Key Benefits
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {keyBenefits.map((benefit, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 professional-heading text-center">
            How It Works
          </h2>
          <Card className="bg-card shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center flex-1">
                  <GlobeAltIcon className="w-12 h-12 text-primary mx-auto mb-3 [&>path]:stroke-[1.5]" />
                  <h4 className="font-semibold text-foreground">1. Web2 Login</h4>
                  <p className="text-sm text-muted-foreground">Sign in with Google</p>
                </div>
                
                <div className="text-center flex-1">
                  <KeyIcon className="w-12 h-12 text-primary mx-auto mb-3 [&>path]:stroke-[1.5]" />
                  <h4 className="font-semibold text-foreground">2. Web3 Signature</h4>
                  <p className="text-sm text-muted-foreground">Verify with private key</p>
                </div>
                
                <div className="text-center flex-1">
                  <ShieldCheckIcon className="w-12 h-12 text-primary mx-auto mb-3 [&>path]:stroke-[1.5]" />
                  <h4 className="font-semibold text-foreground">3. Secure Access</h4>
                  <p className="text-sm text-muted-foreground">Transaction authorized</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 professional-heading text-center">
            Who Benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card shadow-lg card-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">Individuals</h3>
                <ul className="space-y-2">
                  <li className="text-muted-foreground">• Easy multi-chain asset management</li>
                  <li className="text-muted-foreground">• Familiar login experience</li>
                  <li className="text-muted-foreground">• Full control over assets</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-card shadow-lg card-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3">Enterprises</h3>
                <ul className="space-y-2">
                  <li className="text-muted-foreground">• 90% cost reduction in custody</li>
                  <li className="text-muted-foreground">• Programmable multi-signature</li>
                  <li className="text-muted-foreground">• Transparent governance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Experience the future of authentication with OAuth 3
              </p>
              <Link href="/demo">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold">
                  Try OAuth 3 Demo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
      </div>
      <Footer />
    </div>
  );
}