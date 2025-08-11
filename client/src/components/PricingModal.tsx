import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

export function PricingModal({ isOpen, onClose, onSelectPlan }: PricingModalProps) {
  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$3",
      period: "/ month",
      features: [
        "1 ZKP account",
        "1 Email-wallet pair",
        "Asset custody rewards: Not included (trial)",
        "Dashboard: Basic metrics (balance/transaction history)",
        "1,000 API calls per month",
        "Support: Email support (48 hours on business days)"
      ],
      buttonText: "Get Started",
      recommended: false
    },
    {
      id: "team",
      name: "Team",
      price: "$100",
      period: "/ month",
      features: [
        "Up to 15 ZKP accounts",
        "Up to 15 Email-wallet pairs",
        "Asset custody rewards: Included",
        "Dashboard: Extended metrics (per-chain/per-account reward reports)",
        "100,000 API calls per month",
        "Security: 2FA + ZKP authentication log access",
        "Support: Priority email & chat (24 hours on business days)"
      ],
      buttonText: "Upgrade to Team",
      recommended: true
    },
    {
      id: "scale",
      name: "Scale",
      price: "$300",
      period: "/ month",
      features: [
        "Up to 50 ZKP accounts",
        "Up to 50 Email-wallet pairs",
        "Asset custody rewards: Included",
        "Dashboard: Advanced (cross-chain aggregation, CSV export, webhooks)",
        "500,000 API calls per month",
        "Security: All features + IP allowlist, extended audit log retention",
        "Support: Dedicated manager (priority response)"
      ],
      buttonText: "Scale Up",
      recommended: false
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.recommended ? 'border-purple-500 shadow-lg' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.recommended 
                      ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                  onClick={() => onSelectPlan(plan.id)}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}