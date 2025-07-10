import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Wallet, Mail, Smartphone } from "lucide-react";

export default function DemoSection() {
  const demoFeatures = [
    "Connect with MetaMask, WalletConnect, or email",
    "Experience gasless transactions",
    "Test cross-platform authentication"
  ];

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[hsl(0,0%,20%)] mb-4">Interactive Demo</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience OAuth 3 in action with our interactive demonstration platform.
          </p>
        </div>

        <Card className="bg-[hsl(210,40%,96%)] border-none">
          <CardContent className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-[hsl(0,0%,20%)]">Try OAuth 3 Authentication</h3>
                <p className="text-gray-600">
                  Test the seamless authentication flow that works across traditional and blockchain applications. No setup required - just connect your wallet or use our demo credentials.
                </p>
                <div className="space-y-4">
                  {demoFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <PlayCircle className="w-5 h-5 text-[hsl(217,91%,60%)]" />
                      <span className="text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white px-8 py-3 font-semibold">
                  Launch Demo
                </Button>
              </div>
              <Card className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Authentication Status</span>
                      <span className="text-green-600 font-semibold">Connected</span>
                    </div>
                    <div className="space-y-3">
                      <Button className="w-full bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,55%)] text-white py-3 font-semibold">
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                      </Button>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 py-3 font-semibold">
                        <Mail className="mr-2 h-4 w-4" />
                        Use Email
                      </Button>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 py-3 font-semibold">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Social Login
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
