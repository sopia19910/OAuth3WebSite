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
      {/* What is OAuth 3 */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">What is OAuth 3?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              OAuth 3 seamlessly integrates traditional Web2 convenience with Web3 security through a sophisticated hybrid architecture
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="w-6 h-6 text-gray-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Enhanced Security</h3>
                  <p className="text-muted-foreground">
                    Combining the best of Web2 and Web3 authentication methods for maximum protection
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <KeyIcon className="w-6 h-6 text-gray-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Easy Access</h3>
                  <p className="text-muted-foreground">
                    Login with familiar Web2 accounts, no complex key management required
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GlobeAltIcon className="w-6 h-6 text-gray-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Web3 Benefits</h3>
                  <p className="text-muted-foreground">
                    Full control over digital assets with decentralized security features
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <Link href="/about">
                  <Button size="sm" variant="outline" className="border-gray-400 text-gray-600 text-xs hover:bg-gray-100 hover:border-gray-500 hover:text-gray-700 hover:opacity-20 transition-all">
                    Learn More
                    <ArrowRightIcon className="ml-2 w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-card/50 backdrop-blur border-border/50 overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-4 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        O3
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Hybrid Authentication</h3>
                    <p className="text-muted-foreground">
                      The next generation authentication protocol that bridges Web2 and Web3
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* Core Technology */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Core Technology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              OAuth 3 merges Web2 convenience with Web3 security via smart contracts and Zero-Knowledge Proofs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group">
              <div className="relative h-full bg-gradient-to-br from-card to-card/50 backdrop-blur border border-border/50 rounded-2xl p-8 hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                    <UsersIcon className="w-8 h-8 text-gray-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">EOA</h3>
                  <p className="text-sm font-medium mb-3 text-primary">Externally Owned Account</p>
                  <p className="text-muted-foreground">
                    Standard Web3 account with full asset control through private key management
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="relative h-full bg-gradient-to-br from-card to-card/50 backdrop-blur border border-border/50 rounded-2xl p-8 hover:shadow-2xl hover:border-accent/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                    <CogIcon className="w-8 h-8 text-gray-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">CA</h3>
                  <p className="text-sm font-medium mb-3 text-accent">Contract Account</p>
                  <p className="text-muted-foreground">
                    Smart contract wallet requiring both Web2 and Web3 authentication
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="relative h-full bg-gradient-to-br from-card to-card/50 backdrop-blur border border-border/50 rounded-2xl p-8 hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheckIcon className="w-8 h-8 text-gray-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">ZKP</h3>
                  <p className="text-sm font-medium mb-3 text-primary">Zero-Knowledge Proof</p>
                  <p className="text-muted-foreground">
                    Privacy-preserving identity verification without exposing data
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/technology">
              <Button size="sm" variant="outline" className="border-gray-400 text-gray-600 text-xs hover:bg-gray-100 hover:border-gray-500 hover:text-gray-700 hover:opacity-20 transition-all duration-300">
                Learn More
                <ArrowRightIcon className="ml-2 w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Services & Solutions */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Services & Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              OAuth 3 provides customized authentication solutions for both individual users and enterprise organizations
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-3xl blur-2xl" />
              <div className="relative h-full bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:border-primary/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <UsersIcon className="w-7 h-7 text-gray-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Individual Users</h3>
                    <p className="text-primary font-medium">Web3 wallet that feels like Web2</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <p className="text-muted-foreground">Access blockchain accounts via Google, Kakao, Facebook, or email</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <p className="text-muted-foreground">Multi-chain support across major networks</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                    <p className="text-muted-foreground">Zero-knowledge privacy protection</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border/50">
                  <Link href="/demo">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Try Demo
                      <ArrowRightIcon className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-3xl blur-2xl" />
              <div className="relative h-full bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:border-accent/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <BuildingOfficeIcon className="w-7 h-7 text-gray-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Enterprise</h3>
                    <p className="text-accent font-medium">Secure asset management</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    </div>
                    <p className="text-muted-foreground">Smart contract automation with programmable rules</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    </div>
                    <p className="text-muted-foreground">Multi-signature approvals and governance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                    </div>
                    <p className="text-muted-foreground">90%+ reduction in custodial expenses</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border/50">
                  <Button className="w-full" variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/services">
              <Button size="lg" variant="ghost" className="text-muted-foreground hover:text-foreground">
                View All Services
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
