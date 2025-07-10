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

                {/* Section 5: Services & Use Cases */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">5. Services & Use Cases</h2>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      OAuth 3 is not merely a conceptual authentication framework—it is a fully deployable platform that delivers tangible value to both individual users and enterprises. By adapting its architecture to different needs, OAuth 3 serves as a universal bridge between traditional and decentralized identity systems.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">5.1 Individual User Service: Web2-Simple, Web3-Secure Wallet</h3>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Core Value: Simplicity without Sacrificing Sovereignty</h4>
                    <p>
                      OAuth 3 enables users to manage digital assets across multiple blockchains—including Ethereum, Solana, BNB Chain, Avalanche, and TRON—using familiar Web2 logins (Google, Kakao, Facebook, email). No more seed phrases. No more manual key storage.
                    </p>
                    <p>
                      Behind the scenes, account abstraction (ERC-4337) and gas sponsorship streamline complex blockchain operations into single-click transactions. The result is a wallet experience that feels like a Web2 finance app—but with full user ownership and decentralization.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Key Features</h4>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Unified interface for multi-chain wallet management</li>
                      <li>Secure access via Web2 + EOA dual authentication</li>
                      <li>Gasless transactions for seamless UX</li>
                      <li>ZKP-based login proofs for privacy preservation</li>
                      <li>Automatic backup and recovery options</li>
                    </ul>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Expected Impact</h4>
                    <p>
                      OAuth 3 drastically lowers the entry barrier for mainstream users by eliminating the complexity of traditional Web3 wallets, accelerating Web3 adoption on a global scale.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">5.2 Enterprise Service: Decentralized Asset Custody & Governance</h3>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Core Value: Security and Cost Efficiency</h4>
                    <p>
                      For token-issuing foundations, DAOs, and Web3 startups, OAuth 3 offers a smart contract-based custody solution that replaces expensive centralized custodians (e.g., BitGo). Organizations can enforce multi-signature controls, spending rules, and time locks via immutable on-chain governance logic.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Key Features</h4>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Programmable fund access policies (e.g., multi-approval for large withdrawals)</li>
                      <li>Full control without relying on third-party custodians</li>
                      <li>90%+ reduction in custody costs</li>
                      <li>Cross-chain asset management and multi-chain compatibility</li>
                      <li>Transparent auditing and traceability</li>
                    </ul>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Expected Impact</h4>
                    <p>
                      OAuth 3 empowers Web3 organizations to securely manage digital assets while optimizing operational efficiency. It removes the need for trust in intermediaries, aligning perfectly with the ethos of decentralization.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">5.3 Cross-Chain Support & Ecosystem Compatibility</h3>
                    <p>OAuth 3 is natively compatible with multiple blockchain environments, each with unique advantages:</p>
                    
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full border-collapse border border-primary/20">
                        <thead>
                          <tr className="bg-primary/10">
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Blockchain</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Strengths</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">OAuth 3 Role</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground/80">
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Ethereum</td>
                            <td className="border border-primary/20 px-4 py-3">DeFi ecosystem, smart contract maturity</td>
                            <td className="border border-primary/20 px-4 py-3">Core identity and asset layer</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Solana</td>
                            <td className="border border-primary/20 px-4 py-3">High throughput, fast finality</td>
                            <td className="border border-primary/20 px-4 py-3">Real-time UX, NFT compatibility</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">BNB Chain</td>
                            <td className="border border-primary/20 px-4 py-3">Low fees, rapid deployment</td>
                            <td className="border border-primary/20 px-4 py-3">Gas-efficient multi-chain wallet</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Avalanche</td>
                            <td className="border border-primary/20 px-4 py-3">Subnet architecture, scalability</td>
                            <td className="border border-primary/20 px-4 py-3">Custom enterprise environments</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">TRON</td>
                            <td className="border border-primary/20 px-4 py-3">Content-centric, high TPS</td>
                            <td className="border border-primary/20 px-4 py-3">Media and gaming identity use cases</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="mt-4">
                      This broad compatibility ensures that OAuth 3 users and enterprises can manage assets and identities seamlessly across ecosystems.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">5.4 Competitive Advantage</h3>
                    <p>
                      OAuth 3 outperforms traditional authentication methods and Web3 wallets in security, usability, cost efficiency, scalability, and privacy. By bridging the gap between centralized and decentralized identity systems, OAuth 3 redefines the UX standard for secure authentication.
                    </p>
                  </div>
                </section>

                {/* Section 6: Reward & Incentive System */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">6. Reward & Incentive System</h2>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      OAuth 3 introduces a sustainable, token-powered incentive model that not only secures the network but also rewards active participants, including individual users and token-issuing organizations. By aligning economic incentives with security and engagement, OAuth 3 fosters a self-reinforcing ecosystem where usage drives value, and value fuels growth.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">6.1 Individual Holder Rewards</h3>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Mechanism: Stake-by-Holding</h4>
                    <p>
                      Users who hold digital assets (e.g., ETH, SOL) within their OAuth 3 smart wallets receive periodic rewards in the form of OA3 tokens, the native utility token of the platform. Simply by maintaining asset balances, users are recognized as contributors to the ecosystem's security and liquidity.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">How It Works</h4>
                    <ol className="list-decimal list-inside space-y-2 mt-4">
                      <li>Users authenticate via OAuth 3 and deposit assets in their hybrid wallet.</li>
                      <li>The system calculates rewards based on average balance and holding duration.</li>
                      <li>Rewards are distributed in OA3 tokens at regular intervals.</li>
                      <li>ZKP ensures that all reward claims preserve privacy and identity confidentiality.</li>
                    </ol>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Example Payouts</h4>
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full border-collapse border border-primary/20">
                        <thead>
                          <tr className="bg-primary/10">
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">User</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Assets Held</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Monthly Reward (OA3)</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground/80">
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">User A</td>
                            <td className="border border-primary/20 px-4 py-3">1 ETH</td>
                            <td className="border border-primary/20 px-4 py-3">10 OA3</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">User B</td>
                            <td className="border border-primary/20 px-4 py-3">5 ETH</td>
                            <td className="border border-primary/20 px-4 py-3">50 OA3</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">User C</td>
                            <td className="border border-primary/20 px-4 py-3">10 ETH</td>
                            <td className="border border-primary/20 px-4 py-3">100 OA3</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-foreground/60 mt-2">Note: OA3 is an ERC-20 token used across the OAuth 3 ecosystem.</p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">6.2 Foundation & DAO Rewards</h3>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Mechanism: Cross-Chain Payment Pools</h4>
                    <p>
                      Organizations and foundations that manage their native tokens using OAuth 3 pay monthly usage fees (e.g., 1 ETH or 1 SOL per chain). These payments are pooled and redistributed to users across other blockchains via cross-chain reward mechanisms.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Key Features</h4>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Each chain has a dedicated "reward pool" funded by usage fees.</li>
                      <li>The reward ratio is determined through decentralized governance votes.</li>
                      <li>Rewards are distributed to individual holders in alternative native tokens (e.g., users on Ethereum may receive SOL or AVAX).</li>
                    </ul>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Example Distribution</h4>
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full border-collapse border border-primary/20">
                        <thead>
                          <tr className="bg-primary/10">
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Pool Chain</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Monthly Fee Paid</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Cross-Chain Rewards</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground/80">
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Ethereum</td>
                            <td className="border border-primary/20 px-4 py-3">1 ETH</td>
                            <td className="border border-primary/20 px-4 py-3">0.1 SOL, 0.05 AVAX</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Solana</td>
                            <td className="border border-primary/20 px-4 py-3">1 SOL</td>
                            <td className="border border-primary/20 px-4 py-3">0.2 AVAX, 0.1 ETH</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Avalanche</td>
                            <td className="border border-primary/20 px-4 py-3">1 AVAX</td>
                            <td className="border border-primary/20 px-4 py-3">0.15 ETH, 0.05 SOL</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-sm text-foreground/60 mt-2">Figures shown are illustrative.</p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">6.3 Governance Participation</h3>
                    <p>All OA3 token holders gain governance rights to vote on key parameters such as:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Reward distribution ratios</li>
                      <li>Fee structures</li>
                      <li>Supported blockchains</li>
                      <li>Feature rollouts and ecosystem upgrades</li>
                    </ul>
                    <p className="mt-4">
                      This DAO-based system ensures transparency, fairness, and decentralization, giving the community a direct role in shaping the network's evolution.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">6.4 Key Differences: Individual vs Foundation Incentives</h3>
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full border-collapse border border-primary/20">
                        <thead>
                          <tr className="bg-primary/10">
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Category</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Individual Users</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Foundations / Enterprises</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground/80">
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Authentication</td>
                            <td className="border border-primary/20 px-4 py-3">Web2 OAuth + EOA</td>
                            <td className="border border-primary/20 px-4 py-3">ZKP + enterprise email domains</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Asset Rewards</td>
                            <td className="border border-primary/20 px-4 py-3">Based on balance & duration</td>
                            <td className="border border-primary/20 px-4 py-3">Based on monthly usage fees</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Reward Token</td>
                            <td className="border border-primary/20 px-4 py-3">OA3</td>
                            <td className="border border-primary/20 px-4 py-3">Cross-chain native tokens (e.g., ETH)</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Payout Schedule</td>
                            <td className="border border-primary/20 px-4 py-3">Periodic (monthly or weekly)</td>
                            <td className="border border-primary/20 px-4 py-3">Monthly</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Governance Role</td>
                            <td className="border border-primary/20 px-4 py-3">OA3 holders vote</td>
                            <td className="border border-primary/20 px-4 py-3">Participate via token-weighted DAO</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Cross-Chain Benefit</td>
                            <td className="border border-primary/20 px-4 py-3">Multi-chain wallet access</td>
                            <td className="border border-primary/20 px-4 py-3">Cross-chain treasury optimization</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4">
                      OAuth 3's reward system is designed to create positive feedback loops that incentivize secure usage, deepen engagement, and empower both individuals and institutions in a unified digital identity framework.
                    </p>
                  </div>
                </section>

                {/* Section 7: Tokenomics */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">7. Tokenomics</h2>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      The OAuth 3 ecosystem is powered by OA3, an ERC-20 utility and governance token that fuels authentication services, incentivizes participation, and enables decentralized decision-making. The tokenomics of OA3 are designed for long-term sustainability, ecosystem alignment, and community empowerment.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">7.1 Token Overview</h3>
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full border-collapse border border-primary/20">
                        <thead>
                          <tr className="bg-primary/10">
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Parameter</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Details</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground/80">
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Token Name</td>
                            <td className="border border-primary/20 px-4 py-3">OAuth 3 Token</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Symbol</td>
                            <td className="border border-primary/20 px-4 py-3">OA3</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Token Standard</td>
                            <td className="border border-primary/20 px-4 py-3">ERC-20</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Total Supply</td>
                            <td className="border border-primary/20 px-4 py-3">1,000,000,000 OA3 (1 billion)</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Initial Circulating</td>
                            <td className="border border-primary/20 px-4 py-3">300,000,000 OA3 (30% of total supply)</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Issuance Networks</td>
                            <td className="border border-primary/20 px-4 py-3">Ethereum, BNB Chain, Avalanche (multi-chain support)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">7.2 Token Utility</h3>
                    <p>OA3 serves three core functions within the OAuth 3 ecosystem:</p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">1. Governance</h4>
                    <p>OA3 holders can participate in on-chain governance to vote on:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Reward distribution policies</li>
                      <li>Authentication fees</li>
                      <li>Supported blockchains</li>
                      <li>Protocol upgrades and roadmap initiatives</li>
                    </ul>
                    <p className="mt-4">This ensures a DAO-powered framework where control lies in the hands of the community.</p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">2. Reward Distribution</h4>
                    <p>OA3 is used to reward:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Individual users who hold digital assets in OAuth 3 wallets</li>
                      <li>Developers or ecosystem participants contributing value</li>
                      <li>Early adopters and referral agents</li>
                    </ul>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">3. Service Payments</h4>
                    <p>
                      Future OAuth 3 premium services (e.g., enterprise dashboards, compliance modules, identity analytics) may require payment in OA3, increasing the token's functional utility and demand.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">7.3 Token Allocation</h3>
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full border-collapse border border-primary/20">
                        <thead>
                          <tr className="bg-primary/10">
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Category</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Allocation %</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Amount (OA3)</th>
                            <th className="border border-primary/20 px-4 py-3 text-left text-primary">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="text-foreground/80">
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Ecosystem Rewards (Users)</td>
                            <td className="border border-primary/20 px-4 py-3">20%</td>
                            <td className="border border-primary/20 px-4 py-3">200,000,000 OA3</td>
                            <td className="border border-primary/20 px-4 py-3">For individual asset-holding rewards</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Ecosystem Incentives</td>
                            <td className="border border-primary/20 px-4 py-3">20%</td>
                            <td className="border border-primary/20 px-4 py-3">200,000,000 OA3</td>
                            <td className="border border-primary/20 px-4 py-3">Used to bootstrap participation and activity</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Partnerships & Marketing</td>
                            <td className="border border-primary/20 px-4 py-3">15%</td>
                            <td className="border border-primary/20 px-4 py-3">150,000,000 OA3</td>
                            <td className="border border-primary/20 px-4 py-3">Strategic partners, market growth, and promotional campaigns</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Team & Founders</td>
                            <td className="border border-primary/20 px-4 py-3">15%</td>
                            <td className="border border-primary/20 px-4 py-3">150,000,000 OA3</td>
                            <td className="border border-primary/20 px-4 py-3">1-year lockup, 3-year monthly vesting (36 months)</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Development & Operations</td>
                            <td className="border border-primary/20 px-4 py-3">10%</td>
                            <td className="border border-primary/20 px-4 py-3">100,000,000 OA3</td>
                            <td className="border border-primary/20 px-4 py-3">R&D, infrastructure, audits, and maintenance</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Reserve Fund</td>
                            <td className="border border-primary/20 px-4 py-3">10%</td>
                            <td className="border border-primary/20 px-4 py-3">100,000,000 OA3</td>
                            <td className="border border-primary/20 px-4 py-3">Long-term strategic reserves and emergency liquidity</td>
                          </tr>
                          <tr>
                            <td className="border border-primary/20 px-4 py-3 font-medium">Early Investors</td>
                            <td className="border border-primary/20 px-4 py-3">5%</td>
                            <td className="border border-primary/20 px-4 py-3">50,000,000 OA3</td>
                            <td className="border border-primary/20 px-4 py-3">Private round, subject to vesting</td>
                          </tr>
                          <tr className="bg-primary/5">
                            <td className="border border-primary/20 px-4 py-3 font-medium">Seed Funding Participants</td>
                            <td className="border border-primary/20 px-4 py-3">5%</td>
                            <td className="border border-primary/20 px-4 py-3">50,000,000 OA3</td>
                            <td className="border border-primary/20 px-4 py-3">Seed backers and early ecosystem supporters</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">7.4 Vesting and Distribution Strategy</h3>
                    <p>To ensure stability and prevent speculative volatility:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li><strong>Team & Founders:</strong> 12-month cliff, then monthly vesting over 36 months</li>
                      <li><strong>Ecosystem Rewards & Incentives:</strong> Distributed gradually based on on-chain activity</li>
                      <li><strong>Marketing & Partnerships:</strong> Released based on milestone-based engagements</li>
                      <li><strong>Investor allocations:</strong> Subject to linear vesting and lockups to align with long-term growth</li>
                    </ul>
                  </div>
                </section>

                {/* Section 8: Ecosystem & Growth Strategy */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">8. Ecosystem & Growth Strategy</h2>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      OAuth 3 aims to establish itself as the global authentication standard for both decentralized and traditional digital services. To realize this vision, the project is backed by a comprehensive ecosystem and growth strategy that emphasizes partnership development, community-led expansion, and cross-chain scalability.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">8.1 Ecosystem Vision</h3>
                    <p>
                      At its core, OAuth 3 envisions a self-sustaining, interoperable identity network where users own their credentials, enterprises secure their assets, and developers build privacy-first applications using shared authentication infrastructure.
                    </p>
                    <p>
                      OAuth 3 does not operate as a closed system; it is a modular, extensible protocol designed to integrate with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Web3 wallets and DeFi platforms</li>
                      <li>NFT marketplaces and GameFi ecosystems</li>
                      <li>Centralized apps seeking blockchain-based security layers</li>
                      <li>Cross-chain bridges, oracles, and decentralized identity (DID) services</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">8.2 Growth Pillars</h3>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">1. Strategic Partnerships</h4>
                    <p>OAuth 3 is pursuing integrations with:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Major blockchain foundations (Ethereum, Solana, BNB Chain, etc.)</li>
                      <li>Web2 identity providers and Single Sign-On (SSO) systems</li>
                      <li>Custody solutions, Layer-2 rollups, and account abstraction protocols</li>
                    </ul>
                    <p className="mt-4">
                      These alliances aim to accelerate user acquisition, liquidity inflow, and protocol utility across verticals.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">2. Community Engagement</h4>
                    <p>Community growth is a central tenet of OAuth 3's strategy. Through:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>DAO governance onboarding</li>
                      <li>Ambassador programs</li>
                      <li>Developer grants and hackathons</li>
                    </ul>
                    <p className="mt-4">
                      OAuth 3 empowers grassroots contributors to shape the protocol's future while incentivizing active participation through OA3 token rewards.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">3. Cross-Chain Infrastructure</h4>
                    <p>
                      OAuth 3 is built for multi-chain compatibility from day one. The protocol will continually expand integration with high-performance and emerging chains to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Maximize ecosystem reach</li>
                      <li>Support localized adoption strategies</li>
                      <li>Enable seamless identity management across fragmented blockchain environments</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">8.3 Go-to-Market Strategy</h3>
                    <p>OAuth 3's go-to-market plan is structured in three progressive waves:</p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Early Adopters (Web3 Native Users)</h4>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li><strong>Target:</strong> DeFi users, DAO contributors, crypto wallets</li>
                      <li><strong>Messaging:</strong> Enhanced security + ZKP privacy for crypto-native applications</li>
                    </ul>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Enterprise & Institutional Use</h4>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li><strong>Target:</strong> Token foundations, compliance-focused Web3 firms, dApp platforms</li>
                      <li><strong>Messaging:</strong> Cost-efficient custody + programmable compliance</li>
                    </ul>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Mass Market & Web2 Onboarding</h4>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li><strong>Target:</strong> Everyday internet users, fintech apps, consumer-facing platforms</li>
                      <li><strong>Messaging:</strong> Seamless Web2 login + Web3 control with zero onboarding complexity</li>
                    </ul>
                    
                    <p className="mt-4">
                      Each stage is supported by performance marketing, educational campaigns, and incentive-based user growth programs.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">8.4 Developer Ecosystem</h3>
                    <p>OAuth 3 offers extensive support for builders:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Open SDKs and APIs for easy authentication integration</li>
                      <li>Smart contract templates for on-chain identity control</li>
                      <li>Support for ERC-4337-based account abstraction</li>
                      <li>Documentation, tutorials, and sandbox environments</li>
                    </ul>
                    <p className="mt-4">
                      Developer grants will be distributed through the DAO to incentivize dApps, security audits, tools, and plugins that grow the ecosystem.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">8.5 Sustainability & Decentralization</h3>
                    <p>To ensure long-term sustainability:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Protocol upgrades are proposed and ratified via on-chain governance</li>
                      <li>Token incentives are designed to reward value-aligned behaviors</li>
                      <li>A treasury reserve supports emergency funding, R&D, and risk mitigation</li>
                    </ul>
                    <p className="mt-4">
                      By decentralizing control and distributing value, OAuth 3 ensures that no single entity dictates the network's evolution—the community does.
                    </p>
                    <p className="mt-4">
                      <strong className="text-primary">The OAuth 3 ecosystem is more than a product—it's an evolving collaborative infrastructure for digital identity.</strong> By combining technological innovation, robust token incentives, and a decentralized governance model, OAuth 3 is poised to scale as the authentication backbone of the next internet.
                    </p>
                  </div>
                </section>

                {/* Section 9: Security & Privacy */}
                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-primary mb-6">9. Security & Privacy</h2>
                  <div className="space-y-4 text-foreground/80 leading-relaxed">
                    <p>
                      Security and privacy are the cornerstones of OAuth 3's architecture. Designed for a future where digital identity is sovereign, verifiable, and private, OAuth 3 introduces an authentication model that surpasses traditional standards by integrating blockchain-level resilience, cryptographic integrity, and zero-knowledge technologies.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">9.1 Multi-Layered Security Architecture</h3>
                    <p>
                      OAuth 3 employs a dual-authentication mechanism enforced by smart contracts on-chain, effectively eliminating single points of failure.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Two-Factor Authentication (2FA) on the Blockchain</h4>
                    <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mt-4">
                      <p><strong className="text-primary">Factor 1:</strong> Web2 Social Login (e.g., Google, Facebook, Kakao)</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Validated through Zero-Knowledge Proofs (ZKP)</li>
                      </ul>
                      
                      <p className="mt-4"><strong className="text-primary">Factor 2:</strong> Web3 Private Key Signature (EOA)</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Required for executing any transaction on the blockchain</li>
                      </ul>
                    </div>
                    
                    <p className="mt-4">This hybrid model ensures that:</p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>A stolen Web2 login cannot access assets without the private key</li>
                      <li>A compromised private key cannot operate without passing social login validation</li>
                    </ul>
                    <p className="mt-4">
                      <strong className="text-primary">Result:</strong> Even if one layer is breached, user assets remain secure.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">9.2 Smart Contract-Based Access Control</h3>
                    <p>
                      OAuth 3's Contract Account (CA) operates as a programmable guardian of user assets. Its capabilities include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Conditional execution logic (e.g., dual-auth confirmation, time-locked transfers)</li>
                      <li>Role-based access for enterprise wallets</li>
                      <li>Configurable thresholds for multi-signature approval</li>
                    </ul>
                    <p className="mt-4">
                      Unlike centralized 2FA apps (e.g., Google Authenticator), OAuth 3's security is fully transparent, verifiable, and tamper-proof, enforced at the protocol level.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">9.3 Zero-Knowledge Proofs (ZKP)</h3>
                    <p>
                      OAuth 3 incorporates Zero-Knowledge Proofs to preserve user privacy without compromising authentication integrity.
                    </p>
                    
                    <h4 className="text-lg font-medium text-primary mt-6 mb-3">Key Benefits:</h4>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>No personal data is stored or transmitted on-chain</li>
                      <li>Users can prove they've successfully logged in via Web2 without revealing emails or passwords</li>
                      <li>Compliance with privacy regulations (e.g., GDPR, CCPA) is enhanced through cryptographic anonymization</li>
                    </ul>
                    <p className="mt-4">
                      <strong className="text-primary">ZKP turns identity verification into data-minimized authentication</strong>, providing a breakthrough in Web3 privacy and UX.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">9.4 Key Recovery & Backup Mechanisms</h3>
                    <p>
                      Recognizing the real-world risks of key loss, OAuth 3 introduces secure backup and recovery tools, including:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>Social recovery protocols using designated guardians</li>
                      <li>Encrypted key shards with multi-party computation (MPC) support</li>
                      <li>Optional Web2-linked key fragments (e.g., email-triggered recovery under DAO-governed rules)</li>
                    </ul>
                    <p className="mt-4">
                      These methods ensure that users can regain access without compromising decentralization or handing control back to centralized platforms.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">9.5 Compliance & Auditing</h3>
                    <ul className="list-disc list-inside space-y-2 mt-4">
                      <li>All smart contracts undergo rigorous third-party security audits</li>
                      <li>Open-source codebases and on-chain transparency ensure trust</li>
                      <li>DAO-governed upgrade paths prevent unilateral changes and promote collective responsibility</li>
                    </ul>
                    <p className="mt-4">
                      <strong className="text-primary">OAuth 3 is engineered not just to meet today's best practices—but to set the new benchmark for secure, decentralized digital identity systems.</strong>
                    </p>
                  </div>
                </section>

                {/* Footer note */}
                <div className="mt-16 pt-8 border-t border-primary/20">
                  <p className="text-center text-foreground/60 text-sm">
                    This comprehensive whitepaper outlines OAuth 3's complete vision, architecture, and implementation strategy. 
                    For the latest updates and technical specifications, please visit our official documentation.
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