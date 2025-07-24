import logoImage from "@assets/image_1752117480535.png";
import { FaXTwitter, FaGithub, FaYoutube, FaMedium } from "react-icons/fa6";

export default function Footer() {
  const footerSections = [
    {
      title: "Technology",
      links: [
        "Account Abstraction",
        "Smart Contracts",
        "Zero-Knowledge Proofs"
      ]
    },
    {
      title: "Resources",
      links: [
        "Documentation",
        "API Reference",
        "GitHub"
      ]
    },
    {
      title: "Company",
      links: [
        "About",
        "Contact",
        "Privacy Policy"
      ]
    }
  ];

  return (
    <footer className="bg-background border-t border-border text-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logoImage} alt="OAuth 3 Logo" className="h-8 w-8" />
              <h3 className="text-2xl font-bold text-primary clean-logo">OAuth 3</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Next-generation hybrid authentication protocol bridging Web2 and Web3.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://x.com/oauth3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on X"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/oauth-3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="View our GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/@oauth3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Subscribe to our YouTube"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
              <a 
                href="https://medium.com/@oauth3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Read our Medium blog"
              >
                <FaMedium className="h-5 w-5" />
              </a>
            </div>
          </div>
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p className="mb-2">Nexus Revolution Corp. | 18 Yongeview Ave, Richmond Hill, ON L4C 7A4, Canada</p>
          <p>Corp. No: 1088083-3 | BN: 745497487RC0001 | © 2025 All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
