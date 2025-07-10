import { Button } from "@/components/ui/button";
import { Shield, Play } from "lucide-react";
import logoImage from "@assets/image_1752117480535.png";
import googleLogo from "@assets/image_1752137026323.png";
import globalNetworkImage from "@assets/image_1752137747093.png";

export default function HeroSection() {
  return (
    <section id="home" className="pt-16 text-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight clean-title">
              <span className="clean-logo">OAuth 3</span><br />
              The Future of{" "}
              <span className="text-primary">Hybrid Authentication</span>
            </h1>
            <p className="text-lg text-foreground/80 tech-body">
              Combining the intuitive convenience of Web2 with the robust security of Web3. 
              Experience next-generation authentication that bridges traditional and blockchain ecosystems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold animate-pulse-glow"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 font-semibold"
              >
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </div>
          </div>
          <div className="flex justify-center relative">
            <div className="animate-float">
              <div className="w-80 h-80 rounded-full flex items-center justify-center relative overflow-hidden border border-primary/30 animate-pulse-glow bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm">
                <img src={globalNetworkImage} alt="Global Network" className="w-72 h-72 opacity-90 object-cover rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={logoImage} alt="OAuth 3 Logo" className="w-24 h-24 opacity-95 z-10 filter drop-shadow-lg" />
                </div>
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-10 left-10 w-12 h-12 rounded-full animate-particle opacity-60 flex items-center justify-center bg-white/10 backdrop-blur-sm" style={{animationDelay: '0s'}}>
              <img src={googleLogo} alt="Google" className="w-8 h-8 opacity-90" />
            </div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-accent rounded-full animate-particle opacity-40" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-16 left-20 w-10 h-10 rounded-full animate-particle opacity-50 flex items-center justify-center bg-white/10 backdrop-blur-sm" style={{animationDelay: '2s'}}>
              <img src={googleLogo} alt="Google" className="w-6 h-6 opacity-80" />
            </div>
            <div className="absolute bottom-32 right-16 w-5 h-5 bg-accent rounded-full animate-particle opacity-30" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1/2 left-0 w-8 h-8 rounded-full animate-particle opacity-40 flex items-center justify-center bg-white/10 backdrop-blur-sm" style={{animationDelay: '3s'}}>
              <img src={googleLogo} alt="Google" className="w-5 h-5 opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
