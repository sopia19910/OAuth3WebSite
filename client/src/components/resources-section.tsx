import { Card, CardContent } from "@/components/ui/card";
import { FileText, Code, HelpCircle } from "lucide-react";

export default function ResourcesSection() {
  const resources = [
    {
      icon: <FileText className="w-16 h-16 text-[hsl(217,91%,60%)] mb-4" />,
      title: "Technical Whitepapers",
      links: [
        "OAuth 3 Protocol Specification",
        "Security Architecture Overview",
        "Implementation Guidelines",
        "Best Practices Guide"
      ]
    },
    {
      icon: <Code className="w-16 h-16 text-[hsl(217,91%,60%)] mb-4" />,
      title: "API Documentation",
      links: [
        "REST API Reference",
        "SDK Documentation",
        "Integration Examples",
        "Error Handling Guide"
      ]
    },
    {
      icon: <HelpCircle className="w-16 h-16 text-[hsl(217,91%,60%)] mb-4" />,
      title: "FAQ",
      links: [
        "Getting Started",
        "Security Concerns",
        "Integration Support",
        "Pricing & Plans"
      ]
    }
  ];

  return (
    <section id="resources" className="py-20 bg-[hsl(210,40%,96%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[hsl(0,0%,20%)] mb-4">Resources</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access comprehensive documentation, whitepapers, and developer resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <Card key={index} className="bg-white shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  {resource.icon}
                  <h3 className="text-xl font-semibold text-[hsl(0,0%,20%)]">{resource.title}</h3>
                </div>
                <ul className="space-y-3">
                  {resource.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-gray-600 hover:text-[hsl(35,100%,50%)] transition-colors underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
