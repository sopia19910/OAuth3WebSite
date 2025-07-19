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
      <section className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">
              The Future of Authentication
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              OAuth 3 seamlessly integrates traditional Web2 convenience with Web3 security through a sophisticated hybrid architecture
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <Card className="relative bg-card/50 backdrop-blur border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheckIcon className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Enhanced Security</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Combining the best of Web2 and Web3 authentication methods for maximum protection
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <Card className="relative bg-card/50 backdrop-blur border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <KeyIcon className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Easy Access</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Login with familiar Web2 accounts, no complex key management required
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <Card className="relative bg-card/50 backdrop-blur border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <GlobeAltIcon className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Web3 Benefits</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Full control over digital assets with decentralized security features
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-gray-500 text-gray-500 hover:bg-white/10 hover:text-white transition-all duration-300 px-8">
                Learn More
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Technology Summary Section */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">
              Advanced Hybrid Architecture
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              OAuth 3 merges Web2 convenience with Web3 security via smart contracts and Zero-Knowledge Proofs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-r from-accent/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur border border-border/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                  <UsersIcon className="w-10 h-10 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 text-center">EOA</h3>
                <p className="text-xs font-medium text-center mb-3 text-[#fafafa]">Externally Owned Account</p>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Standard Web3 account with full asset control through private key management
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-r from-accent/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur border border-border/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                  <CogIcon className="w-10 h-10 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 text-center">CA</h3>
                <p className="text-xs font-medium text-center mb-3 text-[#fafafa]">Contract Account</p>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Smart contract wallet requiring both Web2 and Web3 authentication
                </p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute -inset-px bg-gradient-to-r from-accent/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur border border-border/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheckIcon className="w-10 h-10 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 text-center">ZKP</h3>
                <p className="text-xs font-medium text-center mb-3 text-[#fafafa]">Zero-Knowledge Proof</p>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Privacy-preserving identity verification without exposing data
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/technology">
              <Button size="lg" variant="outline" className="border-gray-500 text-gray-500 hover:bg-white/10 hover:text-white transition-all duration-300 px-8">
                Learn More
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Services Summary Section */}
      <section className="py-24 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">
              Tailored Solutions for Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              OAuth 3 provides customized authentication solutions for both individual users and enterprise organizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300" />
              <Card className="relative bg-gradient-to-br from-card via-card/95 to-card/90 border-primary/20 overflow-hidden hover:border-primary/40 transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-10 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <UsersIcon className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Individual User Services</h3>
                  <p className="text-lg text-primary mb-6 italic font-medium">"Web3 wallet that feels like Web2"</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <p>Access blockchain accounts via Google, Kakao, Facebook, or email</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <p>Multi-chain support across major networks</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <p>Zero-knowledge privacy protection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300" />
              <Card className="relative bg-gradient-to-br from-card via-card/95 to-card/90 border-accent/20 overflow-hidden hover:border-accent/40 transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-10 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BuildingOfficeIcon className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Enterprise Services</h3>
                  <p className="text-lg text-accent mb-6 italic font-medium">"Secure asset management for organizations"</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                      <p>Smart contract automation with programmable rules</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                      <p>Multi-signature approvals and governance</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                      <p>90%+ reduction in custodial expenses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-gray-500 text-gray-500 hover:bg-white/10 hover:text-white transition-all duration-300 px-8">
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
