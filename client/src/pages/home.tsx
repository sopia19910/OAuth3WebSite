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
  ArrowRightIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* User Dashboard Section */}
      {isAuthenticated && user && (
        <section className="pt-20 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <UserCircleIcon className="w-10 h-10 text-gray-700" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.username}!</h2>
                      <p className="text-gray-600 mt-1">{user.email}</p>
                      {user.isAdmin && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="bg-white hover:bg-gray-100 text-black font-semibold border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={logout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Signing Out...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          <span>Sign Out</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
      
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GlobeAltIcon className="w-6 h-6 text-gray-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Web3 Benefits</h3>
                  <p className="text-muted-foreground">
                    Full control over digital assets with decentralized security features
                  </p>
                </div>
              </div>
              
              
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-card/50 backdrop-blur border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="w-full aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/evXPFNMw3jY?si=AsppHlj3WRgtrOCx&loop=1&playlist=evXPFNMw3jY"
                      title="OAuth 3 Demo Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full object-cover"
                    ></iframe>
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
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <UsersIcon className="w-8 h-8 text-gray-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">EOA</h3>
                  <p className="text-sm font-medium mb-3 text-[#fafafa]">Externally Owned Account</p>
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
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <CogIcon className="w-8 h-8 text-gray-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">CA</h3>
                  <p className="text-sm font-medium mb-3 text-[#fafafa]">Contract Account</p>
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
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheckIcon className="w-8 h-8 text-gray-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">ZKP</h3>
                  <p className="text-sm font-medium mb-3 text-[#fafafa]">Zero-Knowledge Proof</p>
                  <p className="text-muted-foreground">
                    Privacy-preserving identity verification without exposing data
                  </p>
                </div>
              </div>
            </div>
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
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center">
                    <UsersIcon className="w-7 h-7 text-gray-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Individual Users</h3>
                    <p className="font-medium text-[#fafafa]">Web3 wallet that feels like Web2</p>
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
                
                
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-3xl blur-2xl" />
              <div className="relative h-full bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:border-accent/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center">
                    <BuildingOfficeIcon className="w-7 h-7 text-gray-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Enterprise</h3>
                    <p className="font-medium text-[#fafafa]">Secure asset management</p>
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
                
                
              </div>
            </div>
          </div>
          
          
        </div>
      </section>
      <Footer />
    </div>
  );
}
