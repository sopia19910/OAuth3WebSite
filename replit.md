# OAuth 3 Website

## Overview
This project is a full-stack web application demonstrating OAuth 3, a hybrid authentication protocol merging Web2 convenience with Web3 security. It aims to showcase the protocol's capabilities, provide marketing content, and serve as a foundation for future authentication features. The application features a responsive design, interactive elements, a contact form, and comprehensive documentation sections, all presented with a modern, professional UI inspired by the oauth3.io aesthetic.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom OAuth 3 color scheme (Purple, Deep Navy, Cyan, Dark Navy) and glass morphism elements.
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Typography**: IBM Plex Sans and Inter fonts.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules)
- **Database**: PostgreSQL via Drizzle ORM (configured for Neon Database)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage.
- **Key Database Tables**: `users` (user accounts), `contacts` (form submissions), `tokens` (custom ERC20 tokens), `chains` (blockchain network configurations).

### Key Components & Features
- **Database Layer**: Drizzle ORM for type-safe database interactions.
- **Authentication System**: Google OAuth integration with session management, API key generation for developers.
- **UI Components**: Comprehensive library based on Radix UI, featuring professional OAuth 3 branding, subtle hover effects, and smooth transitions.
- **Data Flow**: Client API calls to Express.js, Drizzle ORM for database operations, JSON responses, and TanStack Query for client-side state management.
- **User Interface**: Responsive design with a mobile-first approach, modern UI with animations, integrated OAuth 3 branding, consistent typography, dark theme with gradients, and glassmorphism design. Includes a functional contact form, an interactive personal service simulation, and dashboard with left sidebar menu including API Application access.

## External Dependencies

### Core
- **@neondatabase/serverless**: PostgreSQL connection.
- **@tanstack/react-query**: Server state management.
- **@radix-ui/***: UI component primitives.
- **drizzle-orm**: Type-safe database ORM.
- **express**: Web application framework.
- **tailwindcss**: Utility-first CSS framework.

### Development
- **tsx**: TypeScript execution for development.
- **vite**: Frontend build tool and development server.