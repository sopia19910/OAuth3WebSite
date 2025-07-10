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
    <footer className="bg-[hsl(0,0%,20%)] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">OAuth 3</h3>
            <p className="text-gray-300">
              Next-generation hybrid authentication protocol bridging Web2 and Web3.
            </p>
          </div>
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-[hsl(35,100%,50%)] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 OAuth 3. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
