import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Zap, Globe, ArrowRight, Users, Lock, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
          <span className="text-2xl font-bold text-white">OAuth 3</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Documentation
          </Button>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/50">
            Next-Generation Authentication
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            OAuth <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">3.0</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            The hybrid authentication protocol merging Web2 convenience with Web3 security. 
            Experience seamless, secure authentication for the decentralized web.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Zero-Knowledge Security</CardTitle>
              <CardDescription className="text-gray-300">
                Advanced cryptographic proofs ensure your data remains private while maintaining verifiable authentication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <Zap className="w-12 h-12 text-cyan-400 mb-4" />
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-gray-300">
                Optimized protocols deliver sub-second authentication without compromising security or user experience.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <Globe className="w-12 h-12 text-indigo-400 mb-4" />
              <CardTitle className="text-white">Multi-Chain Support</CardTitle>
              <CardDescription className="text-gray-300">
                Seamlessly authenticate across multiple blockchain networks with unified credential management.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Why Choose OAuth 3?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <Users className="w-8 h-8 text-purple-400 mb-4" />
                <CardTitle className="text-white">For Developers</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Simple API integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Comprehensive documentation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    SDKs for popular frameworks
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    24/7 developer support
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <Lock className="w-8 h-8 text-cyan-400 mb-4" />
                <CardTitle className="text-white">For Users</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Privacy-first authentication
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Cross-platform compatibility
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    No personal data storage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    Seamless user experience
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Ready to Get Started?</CardTitle>
              <CardDescription className="text-gray-300">
                Join thousands of developers building the future of authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0"
              >
                Sign In to Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded"></div>
              <span className="text-white font-semibold">OAuth 3</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 OAuth 3. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}