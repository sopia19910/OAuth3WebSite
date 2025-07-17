import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  UsersIcon, 
  CogIcon, 
  LockClosedIcon, 
  GlobeAltIcon, 
  CheckIcon, 
  ArrowRightIcon, 
  BoltIcon, 
  GlobeAmericasIcon,
  BuildingOfficeIcon 
} from "@heroicons/react/24/outline";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Technology() {
  const coreComponents = [
    {
      icon: <UsersIcon className="w-10 h-10 text-primary" strokeWidth={1} />,
      title: "EOA (Externally Owned Account)",
      description: "Standard Web3 account with full asset control via private key management."
    },
    {
      icon: <CogIcon className="w-10 h-10 text-primary" strokeWidth={1} />,
      title: "CA (Contract Account)",
      description: "Smart contract wallet requiring both Web2 and Web3 authentication."
    },
    {
      icon: <ShieldCheckIcon className="w-10 h-10 text-primary" strokeWidth={1} />,
      title: "ZKP (Zero-Knowledge Proof)",
      description: "Verifies identity without exposing sensitive data on-chain."
    }
  ];

  const securityFlow = [
    {
      step: "1",
      title: "Web2 Login",
      description: "Sign in with Google, Kakao, or Facebook",
      icon: <GlobeAltIcon className="w-8 h-8 text-accent" strokeWidth={1} />
    },
    {
      step: "2",
      title: "Web3 Signature",
      description: "Confirm with your private key",
      icon: <KeyIcon className="w-8 h-8 text-primary" strokeWidth={1} />
    },
    {
      step: "3",
      title: "ZKP Verification",
      description: "Privacy-preserving identity check",
      icon: <ShieldCheckIcon className="w-8 h-8 text-primary" strokeWidth={1} />
    },
    {
      step: "4",
      title: "Execute",
      description: "Transaction completes securely",
      icon: <LockClosedIcon className="w-8 h-8 text-accent" strokeWidth={1} />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">Technology</h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto tech-body leading-relaxed">
              OAuth 3 combines Web2 convenience with Web3 security through smart contracts and Zero-Knowledge Proofs, creating a revolutionary authentication system that delivers both ease of use and enterprise-grade protection.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Core Components */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Core Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreComponents.map((component, index) => (
              <Card key={index} className="bg-card border-border h-full">
                <CardContent className="p-6 text-center flex flex-col h-full">
                  <div className="mb-4 flex justify-center">
                    {component.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{component.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1">{component.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Security Flow */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Security Flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {securityFlow.map((step, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Enhanced Security</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-primary mt-0.5" strokeWidth={2} />
                    <span>Dual authentication prevents single point of failure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-primary mt-0.5" strokeWidth={2} />
                    <span>Zero-Knowledge Proofs protect user privacy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-primary mt-0.5" strokeWidth={2} />
                    <span>Smart contracts enforce security policies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">User Experience</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-primary mt-0.5" strokeWidth={2} />
                    <span>Familiar Web2 login methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-primary mt-0.5" strokeWidth={2} />
                    <span>No complex key management for users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-primary mt-0.5" strokeWidth={2} />
                    <span>Seamless cross-chain compatibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}