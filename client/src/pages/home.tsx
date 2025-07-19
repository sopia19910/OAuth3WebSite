import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ShieldCheckIcon, 
  KeyIcon, 
  GlobeAltIcon,
  UsersIcon,
  CogIcon,
  BuildingOfficeIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* About OAuth 3 Summary Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">About OAuth 3</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              OAuth 3 integrates traditional Web2 convenience with Web3 security through a sophisticated hybrid architecture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <ShieldCheckIcon className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-lg font-semibold text-foreground mb-2">Enhanced Security</h3>
              <p className="text-muted-foreground">Combining the best of Web2 and Web3 authentication methods</p>
            </div>
            <div className="text-center">
              <KeyIcon className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-lg font-semibold text-foreground mb-2">Easy Access</h3>
              <p className="text-muted-foreground">Login with familiar Web2 accounts, no complex key management</p>
            </div>
            <div className="text-center">
              <GlobeAltIcon className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-lg font-semibold text-foreground mb-2">Web3 Benefits</h3>
              <p className="text-muted-foreground">Full control over digital assets with decentralized security</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/about">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Learn More
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Technology Summary Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Technology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              OAuth 3 merges Web2 convenience with Web3 security via smart contracts and Zero-Knowledge Proofs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <UsersIcon className="w-12 h-12 text-accent mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-lg font-semibold text-foreground mb-2">EOA</h3>
              <p className="text-sm text-muted-foreground">Standard Web3 account with full asset control</p>
            </div>
            <div className="text-center">
              <CogIcon className="w-12 h-12 text-accent mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-lg font-semibold text-foreground mb-2">CA</h3>
              <p className="text-sm text-muted-foreground">Smart contract wallet requiring dual authentication</p>
            </div>
            <div className="text-center">
              <ShieldCheckIcon className="w-12 h-12 text-accent mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-lg font-semibold text-foreground mb-2">ZKP</h3>
              <p className="text-sm text-muted-foreground">Privacy-preserving identity verification</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/technology">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Learn More
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Services Summary Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              OAuth 3 provides tailored solutions for both individual users and enterprise organizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardContent className="p-8">
                <UsersIcon className="w-10 h-10 text-primary mb-4" strokeWidth={1} />
                <h3 className="text-xl font-semibold text-foreground mb-2">Individual User Services</h3>
                <p className="text-primary italic mb-4">"Web3 wallet that feels like Web2"</p>
                <p className="text-sm text-muted-foreground">
                  Access blockchain accounts via Google, Kakao, Facebook, or email with multi-chain support
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-accent/20">
              <CardContent className="p-8">
                <BuildingOfficeIcon className="w-10 h-10 text-accent mb-4" strokeWidth={1} />
                <h3 className="text-xl font-semibold text-foreground mb-2">Enterprise Services</h3>
                <p className="text-accent italic mb-4">"Secure asset management for organizations"</p>
                <p className="text-sm text-muted-foreground">
                  Smart contract automation with multi-signature approvals and cross-chain management
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Link href="/services">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Learn More
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
