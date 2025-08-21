# Fits AI

## Overview

Fits AI is a modern enterprise IT support application built as a React Single Page Application (SPA) with role-based access control and AI integration capabilities. The application serves as an intelligent IT support system that leverages multiple AI providers including OpenAI, Google Gemini, and n8n workflow automation to provide comprehensive IT problem diagnosis, troubleshooting guidance, and system administration support.

The system is designed to handle enterprise-level IT operations with features including document management, collaboration tools, vector search capabilities, backend service monitoring, and real-time communication through websocket integration. The application follows a professional banking interface design with clean aesthetics and supports multilingual content (English/Arabic).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool for fast development and optimized production builds
- **State Management**: Redux Toolkit for centralized application state management
- **Routing**: React Router v6 for client-side navigation and declarative routing
- **Styling**: TailwindCSS utility-first framework with custom design system variables
- **UI Components**: Custom component library with shadcn/ui patterns, utilizing Radix UI primitives for accessibility
- **Animation**: Framer Motion for smooth UI transitions and interactions
- **Forms**: React Hook Form for efficient form handling and validation

### Backend Architecture
- **Server Framework**: Express.js with TypeScript/ES modules support
- **Authentication**: JWT-based authentication with bcryptjs for password hashing
- **Database ORM**: Drizzle ORM with PostgreSQL support via Neon serverless
- **WebSocket**: Y-WebSocket server integration for real-time collaboration
- **Security**: Helmet for security headers, CORS configuration, and rate limiting
- **API Structure**: RESTful API design with role-based access control

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for schema management
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database hosting
- **Schema Design**: Comprehensive schema supporting profiles, documents, categories, collaboration sessions, and multi-tenant architecture
- **Vector Storage**: Built-in support for vector embeddings and similarity search
- **Session Storage**: Local storage for authentication tokens and user preferences

### Authentication and Authorization
- **Authentication Method**: JWT tokens with 24-hour expiration
- **Role-Based Access**: Four-tier role system (admin, sme, viewer, editor) with granular permissions
- **Demo Users**: Preconfigured demo accounts for different role levels
- **Session Management**: Secure token storage with automatic logout functionality
- **Password Security**: Bcrypt hashing for password storage and validation

### Design System
- **Color Palette**: Professional blue-based theme (#007AFF primary) with comprehensive status colors
- **Typography**: Inter font family for UI elements, JetBrains Mono for code
- **Component Variants**: Class variance authority for consistent component styling
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Accessibility**: WCAG compliance through Radix UI primitives and semantic HTML

## External Dependencies

### AI and ML Services
- **OpenAI**: GPT-4 integration for chat completions and IT support responses
- **Google Gemini**: Video content generation and multimodal AI capabilities
- **Vector Search**: Custom vector similarity search for document retrieval

### Automation and Workflow
- **n8n**: Webhook integration for workflow automation and external system connections
- **Custom Webhooks**: Knowledge base integration and ticket creation workflows

### Development and Build Tools
- **Vite**: Fast build tool with hot module replacement and optimized production builds
- **Drizzle Kit**: Database migration and schema generation tools
- **Testing**: Jest and React Testing Library for unit and integration tests

### UI and Visualization
- **D3.js**: Advanced data visualization and custom chart creation
- **Recharts**: React-based charting library for standard charts and graphs
- **Lucide React**: Comprehensive icon library with consistent styling

### Utility Libraries
- **Date-fns**: Date manipulation and formatting utilities
- **Axios**: HTTP client for API requests with interceptors
- **React Window**: Virtual scrolling for large data sets
- **Tailwind Merge**: Utility for merging Tailwind CSS classes efficiently

### Backend Infrastructure
- **Express Rate Limit**: API rate limiting for security and performance
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security middleware for HTTP headers
- **WebSocket**: Real-time communication support for collaboration features