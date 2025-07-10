import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Link } from "wouter";

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/resources">
              <Button variant="ghost" className="mb-4 text-primary hover:text-primary/80">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resources
              </Button>
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">OAuth 3 Whitepaper</h1>
                <p className="text-lg text-foreground/70">
                  The Future of Hybrid Authentication: Bridging Web2 Convenience with Web3 Security
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Whitepaper Content */}
          <Card className="glass-card border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-invert max-w-none">
                
                {/* Section 1: Introduction */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">1. Introduction</h2>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      In today's digital landscape, users frequently navigate a maze of account creations, logins, and security layers to access various online services. This process has become increasingly complex, forcing users to choose between convenience and security — a longstanding dilemma in internet authentication.
                    </p>
                    <p>
                      OAuth 2.0, the standard protocol of Web2 social login systems (e.g., Google, Facebook), revolutionized access by enabling users to sign in with familiar third-party accounts. However, this convenience comes at a cost: centralized control, loss of data sovereignty, and single points of failure (SPoF). Users entrust their digital identities to major platforms, leaving them vulnerable to policy shifts, data breaches, and service outages beyond their control.
                    </p>
                    <p>
                      Web3, on the other hand, offers a new paradigm of decentralized authentication. By leveraging blockchain and private key ownership, users are granted complete control over their assets and identity. Yet, Web3 systems remain largely inaccessible to the average user due to high entry barriers, complex key management, and poor user experience involving transaction fees and latency.
                    </p>
                    <p>
                      <strong className="text-primary">OAuth 3 emerges as a groundbreaking hybrid authentication framework</strong>, designed to bridge the gap between the simplicity of Web2 and the robust security of Web3. Combining blockchain-powered smart contracts, multi-factor authentication, and Zero-Knowledge Proof (ZKP) privacy technology, OAuth 3 enables a new standard of digital trust infrastructure—secure, user-friendly, and decentralized.
                    </p>
                    <p>
                      This whitepaper outlines the architecture, service models, incentive mechanisms, token economy, and ecosystem strategy behind OAuth 3, demonstrating how it redefines digital identity for the next generation of the internet.
                    </p>
                  </div>
                </section>

                {/* Section 2: Problem Statement */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">2. Problem Statement</h2>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      The digital identity landscape is currently defined by two dominant paradigms—Web2 centralized authentication and Web3 decentralized authentication—each with its own critical shortcomings. To understand the necessity of OAuth 3, we must first examine the fundamental limitations inherent in both systems.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">2.1 Limitations of Web2 Authentication (OAuth 2.0)</h3>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Centralized Risk Exposure</h4>
                    <p>
                      OAuth 2.0 allows users to log in via third-party accounts (e.g., Google, Facebook), significantly simplifying the onboarding process for web services. However, this convenience relies on centralized identity providers that control and store sensitive user credentials. If a provider is compromised, millions of downstream services and users are simultaneously exposed. This creates a classic single point of failure that contradicts the very principle of resilient internet architecture.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Lack of Data Sovereignty</h4>
                    <p>
                      In centralized systems, users do not truly own or control their identity data. They are subject to platform policies, opaque data usage terms, and potential surveillance. This violates the growing demand for self-sovereign identity in the digital era, where individuals seek greater agency over their personal information.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">2.2 Limitations of Web3 Authentication</h3>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">High Entry Barrier</h4>
                    <p>
                      Web3 offers full ownership and control via private keys, but this shifts the responsibility of key security entirely to the user. Losing a private key often results in irrecoverable loss of digital assets or identity, a risk many users are not prepared or willing to take. The technical complexity involved in wallet setup, seed phrase management, and transaction handling further discourages mass adoption.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Subpar User Experience</h4>
                    <p>
                      Web3 platforms require users to pay transaction (gas) fees, often in volatile native tokens, and suffer from slower processing times compared to Web2 systems. For mainstream users accustomed to seamless, instant interactions, these factors contribute to a frustrating and unfamiliar user experience.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">2.3 The Core Dilemma</h3>
                    <p>Ultimately, users are forced into a trade-off between convenience and control:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li><strong>Web2</strong> offers ease of use but demands trust in centralized authorities.</li>
                      <li><strong>Web3</strong> offers autonomy and security but burdens users with complexity and risk.</li>
                    </ul>
                    <p className="mt-4">
                      This dichotomy creates a deadlock in the evolution of digital identity, where neither model fully satisfies both security and usability. The growing frequency and severity of Web3 security breaches—amounting to over $2.36 billion in losses in 2024 alone—underscore the urgent need for a new paradigm.
                    </p>
                    <p className="mt-4">
                      <strong className="text-primary">OAuth 3 is designed to break this deadlock</strong> by integrating the strengths of both systems, while addressing their weaknesses through hybrid architecture, smart contract automation, and privacy-enhancing technologies.
                    </p>
                  </div>
                </section>

                {/* Section 3: Overview & Vision */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">3. Overview & Vision</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">3.1 What is OAuth 3?</h3>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      OAuth 3 is a next-generation hybrid authentication protocol that fuses the usability of Web2 with the security and decentralization of Web3. It is designed to address the long-standing conflict between convenience and control in digital identity systems. By enabling users to authenticate using familiar Web2 credentials (e.g., Google, Kakao, Facebook) while securely managing assets and identity on the blockchain, OAuth 3 dramatically lowers the entry barrier to Web3 ecosystems.
                    </p>
                    
                    <p>At its core, OAuth 3 leverages a multi-layered architecture that combines:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Web2 Social Login Authentication</li>
                      <li>Web3 Private Key Ownership</li>
                      <li>Smart Contract Automation</li>
                      <li>Zero-Knowledge Proofs (ZKP) for privacy</li>
                    </ul>
                    
                    <p className="mt-4">
                      This integrated approach allows users to interact with blockchain-based services as easily as they would with traditional applications—without sacrificing control, privacy, or security.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">3.2 Vision: A New Standard for Internet Authentication</h3>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      The vision behind OAuth 3 is to redefine digital trust for the next generation of internet users. It seeks to establish a universal, user-centric identity layer that is:
                    </p>
                    
                    <ul className="list-disc list-inside space-y-3 mt-4">
                      <li><strong className="text-primary">Secure by Design:</strong> No single point of failure. Multi-factor authentication is enforced on-chain using smart contracts.</li>
                      <li><strong className="text-primary">User-Friendly:</strong> No need to remember seed phrases or manage keys manually. Users can log in with existing Web2 accounts.</li>
                      <li><strong className="text-primary">Privacy-Preserving:</strong> Sensitive information is never exposed to the blockchain. ZKPs ensure that authentication proofs remain confidential.</li>
                      <li><strong className="text-primary">Interoperable:</strong> OAuth 3 is chain-agnostic and supports integration across multiple blockchain networks including Ethereum, Solana, BNB Chain, Avalanche, and TRON.</li>
                      <li><strong className="text-primary">Decentralized:</strong> Governance, reward systems, and authentication rules are controlled by the community through token-based voting.</li>
                    </ul>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">3.3 The Mission</h3>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>OAuth 3's mission is to empower users and organizations with a unified authentication system that aligns with the principles of:</p>
                    
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Self-sovereignty over identity and data</li>
                      <li>Scalability to support enterprise-level applications</li>
                      <li>Accessibility to onboard the next billion users to Web3</li>
                      <li>Sustainability through token-based incentives and decentralized governance</li>
                    </ul>
                    
                    <p className="mt-4">
                      By combining the best of both digital worlds, OAuth 3 aspires to become the new global standard for secure, decentralized, and user-friendly authentication.
                    </p>
                  </div>
                </section>

                {/* Section 4: Core Architecture */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">4. Core Architecture</h2>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      OAuth 3 introduces a novel hybrid authentication architecture that merges the operational simplicity of Web2 login systems with the cryptographic rigor and decentralization of Web3. This section outlines the three foundational components and the multi-layered security model that power OAuth 3.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">4.1 Key Components</h3>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">1. EOA (Externally Owned Account)</h4>
                    <p>
                      An EOA is a traditional blockchain account controlled by a user's private key. In OAuth 3, it represents the user's true ownership over digital assets and identity. The EOA is used to sign transactions and serves as the Web3 anchor in the authentication process.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">2. CA (Contract Account)</h4>
                    <p>
                      A CA is a smart contract-based programmable wallet that serves as the core engine of OAuth 3. It enforces rules such as requiring dual authentication before any transaction is executed. The CA acts as a secure middle layer, ensuring that both the user's Web2 social login and Web3 private key signature are verified before approving asset movement or access requests.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">3. ZKP (Zero-Knowledge Proof)</h4>
                    <p>
                      ZKPs allow OAuth 3 to prove that a user has successfully authenticated via Web2 (e.g., Google login) without revealing any personal data such as email addresses or passwords. This maintains privacy on public blockchains and enhances trust by decoupling identity verification from data exposure.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">4.2 Multi-Layered Security Model</h3>
                    <p>
                      OAuth 3's security is not simply additive—it is multiplicative by design. It establishes a two-factor authentication (2FA) model that operates entirely on-chain via smart contracts:
                    </p>
                    
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li><strong>First Layer:</strong> Web2 social login (verified using ZKP)</li>
                      <li><strong>Second Layer:</strong> EOA signature (Web3 private key)</li>
                    </ul>
                    
                    <p className="mt-4">
                      This ensures that both factors must be independently verified before a transaction is approved. If a malicious actor compromises a user's Web2 account, they still cannot move assets without the private key. Conversely, if a private key is leaked, the CA will still reject access unless the social login is also authenticated. This eliminates the risk of single-point compromise.
                    </p>
                    
                    <p className="mt-4">
                      Additionally, OAuth 3 supports optional recovery keys and backup authentication options, providing a safer user experience without reintroducing central points of control.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">4.3 Comparison with Traditional Systems</h3>
                    
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full border-collapse border border-primary/20">
                        <thead>
                          <tr className="bg-primary/10">
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Feature</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">OAuth 2.0 (Web2)</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Web3 (Pure)</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">OAuth 3 (Hybrid)</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground/80">
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Authentication Type</td>
                            <td className="border border-primary/20 px-4 py-3">Centralized OAuth</td>
                            <td className="border border-primary/20 px-4 py-3">Blockchain-Based</td>
                            <td className="border border-primary/20 px-4 py-3">Web2 + Web3 Hybrid</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Security Level</td>
                            <td className="border border-primary/20 px-4 py-3">Moderate</td>
                            <td className="border border-primary/20 px-4 py-3">High</td>
                            <td className="border border-primary/20 px-4 py-3">Very High</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Data Ownership</td>
                            <td className="border border-primary/20 px-4 py-3">Platform-Owned</td>
                            <td className="border border-primary/20 px-4 py-3">User-Owned</td>
                            <td className="border border-primary/20 px-4 py-3">User-Owned</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">UX</td>
                            <td className="border border-primary/20 px-4 py-3">Simple</td>
                            <td className="border border-primary/20 px-4 py-3">Complex</td>
                            <td className="border border-primary/20 px-4 py-3">Balanced</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Privacy Protection</td>
                            <td className="border border-primary/20 px-4 py-3">Limited</td>
                            <td className="border border-primary/20 px-4 py-3">Strong</td>
                            <td className="border border-primary/20 px-4 py-3">Enhanced (ZKP)</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Interoperability</td>
                            <td className="border border-primary/20 px-4 py-3">High</td>
                            <td className="border border-primary/20 px-4 py-3">Low</td>
                            <td className="border border-primary/20 px-4 py-3">High</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                {/* Footer note */}
                <div className="mt-16 pt-8 border-t border-primary/20">
                  <p className="text-center text-foreground/60 text-sm">
                    This is a preview of the OAuth 3 Whitepaper. The complete document includes additional sections on
                    Token Economics, Governance Model, Implementation Roadmap, and Technical Specifications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}