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
  - Extended toast system to Demo page for copy operations
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
  - Updated Remove button in Added Tokens to square icon button with X icon and disconnect button style
  - Changed Select dropdown hover/focus color from blue to white with transparency
  - Fixed layout shift issue when opening Select dropdown by adjusting z-index values
- **Home Page Restructure (2025-01-19)**: Replaced individual sections with summary overviews
  - Added About OAuth 3 summary section with key benefits
  - Added Technology summary section with core components (EOA, CA, ZKP)
  - Added Services summary section with Individual and Enterprise services
  - Each section includes "Learn More" button linking to respective pages
  - Removed separate Demo and Contact sections from home page
- **Navigation Update (2025-01-19)**: Changed "Resources" to "Docs" in main menu
- **Services Page Enhancement (2025-01-19)**: 
  - Added professional card designs with gradients and icons
  - Individual Services: Added "Get Started" button linking to /demo
  - Enterprise Services: Added "Coming Soon" label
- **View Demo Page (2025-01-17)**: Added comprehensive interactive demo
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