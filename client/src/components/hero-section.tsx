import { Button } from "@/components/ui/button";
import { Shield, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="pt-16 gradient-bg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              OAuth 3: The Future of{" "}
              <span className="text-[hsl(35,100%,50%)]">Hybrid Authentication</span>
            </h1>
            <p className="text-xl text-blue-100">
              Combining the intuitive convenience of Web2 with the robust security of Web3. 
              Experience next-generation authentication that bridges traditional and blockchain ecosystems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-[hsl(35,100%,50%)] hover:bg-[hsl(35,100%,45%)] text-white px-8 py-3 font-semibold"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[hsl(217,91%,60%)] px-8 py-3 font-semibold"
              >
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="animate-float">
              <div className="w-80 h-80 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <Shield className="w-32 h-32 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
