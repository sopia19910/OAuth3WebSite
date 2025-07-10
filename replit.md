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
- **Typography**: Montserrat font family for modern sans-serif aesthetics

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reload with Vite integration in development mode

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
- Custom styling with OAuth 3 brand colors:
  - Primary: Blue (#3A76F0)
  - Secondary: Light Gray (#F4F6F9)
  - Accent: Orange (#FF9C00)
  - Dark: Dark Gray (#333333)

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
- Contact form with validation
- SEO-optimized with meta tags
- Comprehensive documentation sections
- Modern UI with smooth animations and transitions

The application is designed to be easily extensible for implementing the actual OAuth 3 authentication features while maintaining a professional marketing presence for the protocol.