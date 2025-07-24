# OAuth 3 Website

## Overview

This is a full-stack web application for OAuth 3, a next-generation hybrid authentication protocol that combines Web2 convenience with Web3 security. The application is built using modern web technologies with a React frontend and Express.js backend, utilizing PostgreSQL for data storage through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom OAuth 3 color scheme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Typography**: IBM Plex Sans and Inter fonts for technical sophistication and excellent readability

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM (Neon Database)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reload with Vite integration in development mode
- **Database Tables**:
  - `users`: Stores user accounts (id, username, password)
  - `contacts`: Stores contact form submissions (id, first_name, last_name, email, company, message, created_at)
  - `tokens`: Stores custom ERC20 tokens (id, user_email, address, symbol, name, created_at)
  - `chains`: Stores blockchain network configurations (id, network_name, rpc_url, chain_id, explorer_url, is_active, created_at, updated_at)

### Key Components

#### Database Layer
- **ORM**: Drizzle ORM with TypeScript support
- **Schema**: Centralized schema definition in `/shared/schema.ts`
- **Database**: PostgreSQL (configured for Neon Database in production)
- **Migration**: Drizzle Kit for database migrations
- **Connection**: Neon PostgreSQL with connection pooling via `@neondatabase/serverless`

#### Authentication System
- Basic user model with username/password authentication
- Extensible storage interface for CRUD operations
- DatabaseStorage class for persistent data storage
- Session-based authentication ready for implementation
- Full CRUD operations for user management

#### UI Components
- Comprehensive component library based on Radix UI
- Professional OAuth 3 brand colors following oauth3.io aesthetic:
  - Primary: Purple (#B454FF - hsl(260, 100%, 70%))
  - Secondary: Deep Navy (#0C0F1A - hsl(220, 30%, 10%))
  - Accent: Cyan (#00D9FF - hsl(190, 100%, 60%))
  - Background: Dark Navy (#050814 - hsl(220, 40%, 4%))
  - Glass morphism cards with subtle hover effects
  - Smooth transitions and professional animations

## Data Flow

1. **Client Requests**: Frontend makes API calls to `/api/*` endpoints
2. **Server Processing**: Express.js handles requests with middleware logging
3. **Database Operations**: Drizzle ORM manages database interactions
4. **Response**: JSON responses sent back to client
5. **State Management**: TanStack Query caches and manages server state

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Comprehensive UI component primitives
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **tsx**: TypeScript execution for development
- **vite**: Frontend build tool and development server
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Build Process
1. Frontend: Vite builds React application to `/dist/public`
2. Backend: esbuild bundles server code to `/dist/index.js`
3. Database: Drizzle pushes schema changes to PostgreSQL

### Environment Configuration
- **Development**: Uses tsx for hot reload and Vite dev server
- **Production**: Serves built static files and runs compiled server bundle
- **Database**: Requires `DATABASE_URL` environment variable

### File Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend application
├── shared/          # Shared TypeScript types and schemas
├── attached_assets/ # Static assets and documentation
└── dist/           # Build output directory
```

### Key Features
- OAuth 3 protocol explanation and marketing content
- Responsive design with mobile-first approach
- Interactive demo section (placeholder)
- Contact form with validation and database integration
- SEO-optimized with meta tags
- Comprehensive documentation sections
- Modern UI with smooth animations and transitions
- Integrated OAuth 3 logo branding throughout the site
- Clean, professional typography with IBM Plex Sans and Inter fonts
- Sophisticated dark theme with deep navy to purple gradients  
- Glassmorphism design elements with subtle neon accents
- Professional color palette inspired by oauth3.io aesthetic
- Consistent Heroicons integration across all pages
- Deduplicated content with distinct page purposes

The application is designed to be easily extensible for implementing the actual OAuth 3 authentication features while maintaining a professional marketing presence for the protocol.

### Recent Changes
- **Personal Service Balance Refresh Fix (2025-01-22)**:
  - Fixed refresh button not working in personal service page
  - Corrected chain ID comparison from using database ID to actual chain ID
  - Added retry mechanism with 3 attempts for balance fetching
  - Implemented 10-second timeout for RPC calls to prevent hanging
  - Enhanced error messages to show specific failure reasons
  - Added validation checks for wallet, chain selection, and chains loading state
  - Balance now correctly fetches based on selected chain's RPC URL
- **Dashboard ZK Account Detection Fix (2025-01-21)**:
  - Fixed issue where zkaccount3/check API wasn't being called on dashboard initial load
  - Resolved race condition between chain selection and wallet data loading
  - Dashboard now waits for chains to load and selectedChainId to be set before loading wallet data
  - Added multi-chain ZK Account detection that checks all available chains
  - Dashboard warning now shows which chains have existing ZK Accounts when current chain doesn't have one
  - Example: "💡 You have ZKP accounts on: Holesky Testnet, Sepolia Testnet"
  - This helps users understand where their ZK Accounts exist across different networks
- **Balance Display Architecture Update (2025-01-21)**:
  - Clear separation of balance displays:
    - ETH balance: Shows only for Web3 wallet address (regular Ethereum account)
    - Token balances: Shows only for ZKP Smart Contract (CA) address
  - Updated dashboard UI to reflect this architecture:
    - Web3 Account card displays only ETH balance
    - ZKP Smart Contract card displays all ERC20 token balances
  - Token balance fetching now uses zkAccountInfo.zkAccountAddress instead of wallet.address
  - This aligns with OAuth 3's security model where assets are held in smart contract accounts
- **Chain-Specific Token Management (2025-01-21)**:
  - Added chainId column to tokens table in database
  - Tokens are now stored and retrieved per blockchain network
  - Updated API routes to accept chainId parameter for token operations
  - Dashboard displays tokens specific to the selected chain
  - Added ERC20 token balance functionality with getTokenBalance in wallet.ts
  - Token balances update automatically when switching chains
  - Added sample USDC tokens for Ethereum Mainnet, Sepolia, and Holesky testnets
- **Chain Selection Fix (2025-01-21)**:
  - Fixed double API calls when navigating from dashboard to personalservice page
  - Fixed wrong chain being used (Holesky called when Sepolia selected)
  - Updated personalservice page to properly respect selected chain ID from dashboard
  - Added chainId parameter to `waitForTransaction` function for correct RPC usage
  - Updated `getProvider` and `getRpcUrl` functions to accept optional chainId parameter
  - Fixed balance detection to use retry mechanism and direct RPC calls for Sepolia
  - Only performs single ZK Account check when needed, preventing redundant API calls
  - Chain-specific RPC URLs now properly used throughout the transaction flow
- **Sepolia Gas Limit Fix (2025-01-21)**:
  - Fixed "insufficient funds" error on Sepolia testnet during ZK Account creation
  - Implemented network-specific gas limits:
    - Sepolia (chainId: 11155111): 1,000,000 gas limit
    - Other networks: 500,000 gas limit (default)
  - Added detailed error logging for better debugging
  - Added specific error handling for gas limit exceeded errors
- **Smart Contract Deployment to Sepolia (2025-01-20)**:
  - Successfully deployed all 3 contracts to Sepolia testnet:
    - Groth16Verifier: 0x83f76458Ed154A34a9Ef071d1D08e31bb2E9E610
    - ZKAccountV3 Implementation: 0x858b3ce1378451b4A1995fCB1ef46208Dc85456c
    - ZKAccountFactoryV3: 0xE574f47Ad3D2fD2e60512CDB71d490FdacD2a56D
  - Database updated with deployed contract addresses for Sepolia
  - Application now shows ZK Account functionality only on Sepolia
  - Holesky and other chains show appropriate warning messages
- **Network Image Support in Database (2025-01-20)**:
  - Added `network_image` column to `chains` table for displaying network logos
  - Updated schema to support optional network image paths
  - Added Ethereum logo (@assets/image_1752985874370.png) to all existing chains
  - Ready for UI integration to display network logos in chain selector
- **Dashboard Chain Selector and ZKP CA Warning (2025-01-20)**:
  - Added chain network selector dropdown in Session Status Bar
  - Users can now switch between available chains from dashboard
  - Added warning message when ZKP CA is not created on selected network
  - ZKP Smart Contract card highlights in red when CA not created
  - Warning directs users to Personal Service page for ZKP generation
- **Chain Configuration Database Migration (2025-01-20)**:
  - Created `chains` table in PostgreSQL for network configuration storage
  - Added API endpoints: GET /api/chains, POST /api/chains, PUT /api/chains/:id, DELETE /api/chains/:id
  - Migrated from environment variables to database for chain configuration
  - Added holesky chain as default active network with RPC URL and explorer
  - Configuration endpoint now reads from database instead of environment variables
  - Supports multiple chains with active/inactive status management
  - Removed all hardcoded RPC URLs and chain IDs from codebase
  - Updated ZK account check to use database RPC URL
  - Removed fallback RPC URLs - now requires active chain in database
- **ZKP Smart Contract Database Integration (2025-07-20)**:
  - chains 테이블에 zkAccountFactory와 verifierAddress 컬럼 추가
  - 각 체인별로 ZKP CA 작동을 위한 두 개의 스마트 컨트랙트 주소 저장
  - Holesky Testnet ZKP 스마트 컨트랙트 추가:
    - ZKAccountFactoryV3: 0xDa12A4D2aeC349C8eE5ED77b7F2B38D0BE083bd0
    - Groth16Verifier: 0x99ab99d09e3dD138035a827eEF741B8F6D7AC8cd
  - Sepolia Testnet ZKP 스마트 컨트랙트 업데이트:
    - ZKAccountFactoryV3: 0x909d1bAf9547112b112c1d37ac8D9b5EaEb3DEd6
    - Groth16Verifier: 0x9481E026034b2b1F96B9E080983079A1cBc082FA
  - Ethereum Mainnet ZKP 스마트 컨트랙트 추가:
    - ZKAccountFactoryV3: 0xDa12A4D2aeC349C8eE5ED77b7F2B38D0BE083bd0
    - Groth16Verifier: 0x99ab99d09e3dD138035a827eEF741B8F6D7AC8cd
  - 애플리케이션이 환경 변수 대신 데이터베이스에서 체인별 컨트랙트 주소 읽음
- **Token Storage Migration to Database (2025-01-19)**:
  - Created `tokens` table in PostgreSQL for persistent token storage
  - Added API endpoints: GET /api/tokens, POST /api/tokens, DELETE /api/tokens/:id
  - Migrated from localStorage to database storage for custom tokens
  - Tokens now persist across browsers and devices for each user
  - User email linked to tokens for user-specific token lists
  - Added OA3 token (0xA28FB91e203721B077fE1EBE450Ee62C0d9857Ea) to database
- **Database Setup (2025-01-19)**:
  - Configured PostgreSQL database with Neon Database integration
  - Created database tables: users (for authentication), contacts (for contact form submissions), and tokens (for custom ERC20 tokens)
  - DatabaseStorage class already implemented and active
  - All database operations ready for production use
- **Dashboard Functionality Enhancements (2025-01-19)**:
  - Added functional Add Token system with validation and storage
  - Tokens are saved in localStorage and persist between sessions  
  - Added tokens appear in Send section dropdown for selection
  - Token list shows all added custom tokens with remove functionality
  - Toast notifications for all token operations (add/remove/errors)
  - Ethereum address validation for token contracts
- **Toast Notification System (2025-01-19)**:
  - Replaced alert messages with toast popups on Dashboard page
  - Extended toast system to Personal Service page for copy operations
  - 2-second auto-dismiss with error variants for failures
- **Dashboard UI Updates (2025-01-19)**: Made multiple refinements to the dashboard interface
  - Changed "Logout" button to "Disconnect" with gray border styling
  - Removed Dashboard Overview header card
  - Made Refresh button icon-only design
  - Removed icons from all Account Overview cards
  - Reduced font sizes: card titles from text-lg to text-base, labels from text-sm to text-xs
  - Changed all cards to right-angled corners (removed rounded corners)
  - Web3 Account card now shows full wallet address instead of truncated version
  - Removed card design from Add Token section for cleaner UI
  - Removed card design from Send Coin/Token section for minimal appearance
  - Removed card design from Receive Coin/Token section for consistent minimal UI
  - Updated Remove button in Added Tokens to square icon button with X icon and disconnect button style
  - Changed Select dropdown hover/focus color from blue to white with transparency
  - Fixed layout shift issue when opening Select dropdown by adjusting z-index values
- **ZKP Contract Account Display (2025-01-19)**:
  - Updated Receive Coin/Token section to only display ZKP Contract Account address
  - Added QR code generation for ZKP Contract Account address using qrcode library
  - Removed fallback to regular wallet address for clearer user experience
  - Made Refresh button in Account Overview section square (7x7) with centered icon
- **Global Input Styling (2025-01-20)**:
  - Added purple 1px border to all input, textarea, and select elements on focus
  - Removed default focus ring styles from Input and Textarea components
  - Applied consistent purple focus border (hsl(260, 100%, 70%)) across all pages
  - Extended purple focus border to Select components (combo boxes) with 1px width
- **Personal Service Page Private Key Warning (2025-01-20)**:
  - Changed private key copy warning from alert dialog to toast popup message
  - Added destructive variant toast with 2-second duration for better UX
  - Made Balance Information refresh button icon-only matching dashboard style
- **Home Page Restructure (2025-01-19)**: Replaced individual sections with summary overviews
  - Added About OAuth 3 summary section with key benefits
  - Added Technology summary section with core components (EOA, CA, ZKP)
  - Added Services summary section with Individual and Enterprise services
  - Each section includes "Learn More" button linking to respective pages
  - Removed separate Demo and Contact sections from home page
- **Navigation Update (2025-01-19)**: Changed "Resources" to "Docs" in main menu
- **Services Page Enhancement (2025-01-19)**: 
  - Added professional card designs with gradients and icons
  - Individual Services: Added "Get Started" button linking to /personalservice
  - Enterprise Services: Added "Coming Soon" label
- **Personal Service Page (2025-01-17)**: Added comprehensive interactive personal service
  - 6-step authentication flow simulation
  - Google OAuth login, Web3 account connection, ZKP generation
  - Progress tracking and detailed account information display
  - Integrated "View Demo" button on home page's demo section
- **Content Deduplication (2025-01-17)**: Removed major content overlaps between pages
  - About page: Focuses on OAuth 3 concept and key benefits
  - Technology page: Emphasizes technical architecture and security
  - Services page: Highlights practical applications and blockchain support
- **Icon Consistency**: All pages now use Heroicons for uniform styling
- **Contact Integration**: Fully functional contact form with database storage