# Island-Bake Project Overview

## Project Summary

**Island-Bake** is a full-stack web application for **Bev's Bakery**, a Jamaican specialty bakery. The application showcases authentic Jamaican baked goods and beverages, enabling customers to place orders and allowing admins to manage those orders. The project demonstrates modern web development practices with a React frontend, Express backend, and PostgreSQL database.

---

## Tech Stack

### Frontend
- **React** (with TypeScript) using Vite as the build tool
- **Wouter** for routing
- **TanStack React Query** (v5) for server state management
- **React Hook Form** with Zod validation
- **Framer Motion** for animations
- **Radix UI** component primitives (extensive collection: accordion, dialog, dropdown, select, etc.)
- **Tailwind CSS** with custom styling
- **Shadcn/ui** patterns for component composition

### Backend
- **Express.js** for HTTP server
- **Node.js** with TypeScript
- **Drizzle ORM** for database abstraction and type safety
- **PostgreSQL** as the primary database
- **connect-pg-simple** for session management
- **Zod** for runtime schema validation

### Build & Tooling
- **Vite** for client-side bundling
- **TypeScript** throughout
- **tsx** for running TypeScript in Node.js
- **Drizzle Kit** for database migrations

---

## Project Structure

```
Island-Bake/
├── client/                          # React frontend
│   ├── src/
│   │   ├── App.tsx                 # Main app component with routing
│   │   ├── main.tsx                # React entry point
│   │   ├── index.css               # Global styles
│   │   ├── components/
│   │   │   ├── hero.tsx            # Hero banner component
│   │   │   ├── order-form.tsx      # Order form component
│   │   │   ├── product-card.tsx    # Product display card
│   │   │   └── ui/                 # Radix UI + Shadcn wrapper components
│   │   ├── pages/
│   │   │   ├── home.tsx            # Home page (public)
│   │   │   ├── admin.tsx           # Admin dashboard
│   │   │   └── not-found.tsx       # 404 page
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx      # Mobile breakpoint detection
│   │   │   └── use-toast.ts        # Toast notification hook
│   │   ├── lib/
│   │   │   ├── queryClient.ts      # React Query configuration
│   │   │   └── utils.ts            # Utility functions (e.g., cn for class merging)
│   │   └── index.html              # HTML template
│   └── public/                      # Static assets
│
├── server/                          # Express backend
│   ├── index.ts                    # Express app setup and middleware
│   ├── routes.ts                   # API route definitions
│   ├── db.ts                       # Database connection (Pool + Drizzle)
│   ├── storage.ts                  # Data access layer (DatabaseStorage class)
│   ├── static.ts                   # Static file serving
│   └── vite.ts                     # Vite dev server integration
│
├── shared/                          # Shared code between client and server
│   └── schema.ts                   # Drizzle table definitions and Zod schemas
│
├── script/
│   └── build.ts                    # Build script for production
│
├── attached_assets/                 # Image assets
│   └── generated_images/            # AI-generated product images
│
├── Configuration Files
│   ├── package.json                # Dependencies and scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── vite.config.ts              # Vite bundler config
│   ├── drizzle.config.ts           # Drizzle ORM config
│   ├── postcss.config.js           # PostCSS/Tailwind config
│   ├── components.json             # Shadcn component registry
│   └── database-schema.sql         # SQL schema reference
```

---

## Data Models

### Users Table
```typescript
users {
  id: string (UUID, primary key)
  username: string (unique, required)
  password: string (required)
}
```

**Schemas:**
- `insertUserSchema`: Validates username and password for user creation
- `User` type: Inferred from the table (used for responses)
- `InsertUser` type: Used for input validation

### Orders Table
```typescript
orders {
  id: string (UUID, primary key)
  name: string (required)
  email: string (required)
  phone: string (required)
  cakeQuantity: integer (default: 0)
  sorrelQuantity: integer (default: 0)
  specialRequests: string (optional)
  createdAt: timestamp (auto-generated)
  status: string (default: "pending")
}
```

**Schemas:**
- `insertOrderSchema`: Validates order input with Zod rules
  - Name: min 2 characters
  - Email: valid email format
  - Phone: min 10 characters
  - Quantities: non-negative numbers
  - Special requests: optional
- `Order` type: Inferred from the table
- `InsertOrder` type: Used for input validation

---

## API Endpoints

All endpoints are under `/api/` prefix.

### Orders
- **POST /api/orders** - Create a new order
  - Input: `InsertOrder` (validated with Zod)
  - Response: `Order` object
  - Error handling: Returns Zod validation errors on invalid input

- **GET /api/orders** - Retrieve all orders
  - Response: Array of `Order` objects (sorted by creation date, newest first)
  - Error: 500 on database failure

- **GET /api/orders/:id** - Retrieve a single order
  - Response: Single `Order` object
  - Error: 404 if order not found, 500 on database failure

---

## Key Components & Features

### Pages
- **Home Page** (`pages/home.tsx`)
  - Hero section with background image and CTA
  - Product showcase (Jamaican fruit cake, Sorrel drink)
  - Order form (scrollable into view)
  - Animated sections using Framer Motion

- **Admin Page** (`pages/admin.tsx`)
  - Dashboard for viewing and managing orders
  - Displays all orders from the database
  - Status management (likely for order fulfillment)

- **404 Page** (`pages/not-found.tsx`)
  - Fallback for undefined routes

### Core Components
- **Hero** - Banner with background image and call-to-action button
- **ProductCard** - Displays product info (title, description, price, image, tags)
- **OrderForm** - Form for customers to place orders (integrates with API)

### Hooks
- **useIsMobile()** - Detects mobile viewport for responsive design
- **useToast()** - Toast notification system for user feedback

### UI Components (from Radix UI + Shadcn)
Extensive library including: buttons, forms, dialogs, dropdowns, inputs, selects, carousels, tables, tabs, tooltips, and more.

---

## Architecture Patterns

### Data Flow
1. **Client** renders React components
2. **User interaction** triggers form submission or API calls
3. **React Query** manages async state and caching
4. **API calls** go to Express routes at `/api/*`
5. **Server** validates input with Zod schemas
6. **Storage layer** (DatabaseStorage) queries the database via Drizzle ORM
7. **Response** is returned to the client and cached by React Query

### Validation Strategy
- **Frontend**: Zod schemas for form validation (React Hook Form integration)
- **Backend**: Same Zod schemas re-validate all inputs (belt-and-suspenders approach)
- **Database**: PostgreSQL constraints (unique, not null, defaults)

### Error Handling
- **API Layer**: Try/catch with specific error type checks (ZodError vs. other errors)
- **Client Layer**: React Query automatic retry and error state management
- **Logging**: Express middleware logs all API calls with status codes and response times

---

## Scripts & Commands

From `package.json`:

```bash
# Development
npm run dev:client          # Start Vite dev server on port 5000
npm run dev                 # Start Express server (NODE_ENV=development)

# Production
npm run build              # Bundle client & compile server
npm start                  # Run production server (NODE_ENV=production)

# Utilities
npm run check              # Run TypeScript type checking
npm run db:push           # Push Drizzle schema changes to database
```

### Typical Development Workflow
1. Open two terminals:
   - Terminal 1: `npm run dev` (Express backend on default port, usually 3000)
   - Terminal 2: `npm run dev:client` (Vite frontend on port 5000)
2. Frontend proxies API requests to backend
3. Hot reload on file changes (both client and server)

---

## Database Setup

**Database:** PostgreSQL  
**Connection:** Via `DATABASE_URL` environment variable  
**ORM:** Drizzle with Zod schema validation  

### Migrations
Use Drizzle Kit to manage schema changes:
```bash
npm run db:push
```

This syncs the TypeScript schema definitions to the PostgreSQL database.

---

## Key Design Decisions

1. **Shared Schema Module**
   - `shared/schema.ts` defines tables and Zod validation schemas
   - Used by both client (for form validation) and server (for API validation)
   - Ensures single source of truth for data contracts

2. **React Query for Server State**
   - Handles caching, background refetching, and retry logic
   - Reduces manual state management complexity
   - Configured in `lib/queryClient.ts`

3. **Drizzle ORM + Zod**
   - Type-safe database queries
   - Runtime validation with Zod
   - Automatic TypeScript types from table definitions

4. **Modular UI Components**
   - Radix UI primitives as base components
   - Wrapped in Shadcn component patterns
   - Tailwind CSS for styling
   - Allows consistent design system across the app

5. **Middleware Logging**
   - Express middleware logs all API requests
   - Helps with debugging and monitoring in development

---

## Product Offerings

Based on the codebase, Bev's Bakery offers:
1. **Jamaican Christmas Fruit Cake** - Rich, rum-soaked traditional cake
2. **Sorrel Drink** - Refreshing, gingery Jamaican beverage

Both products are showcased with:
- Generated AI images (in `attached_assets/generated_images/`)
- Product cards with descriptions and pricing
- Integration with the order form

---

## Future Considerations

- **Authentication**: User/admin login system (schema includes `users` table but not fully implemented)
- **Payment Integration**: Stripe or similar for processing orders
- **Email Notifications**: Order confirmation and status updates
- **Order History**: Customer dashboard to view past orders
- **Inventory Management**: Track stock levels for products
- **Analytics**: Dashboard metrics for admin users

---

## File Dependencies Graph

```
App.tsx
  ├── Router
  │   ├── Home (pages/home.tsx)
  │   │   ├── Hero
  │   │   ├── ProductCard (x2)
  │   │   └── OrderForm
  │   ├── Admin (pages/admin.tsx)
  │   │   └── useToast, useQueries for /api/orders
  │   └── NotFound
  │
  ├── queryClient (React Query)
  ├── TooltipProvider
  └── Toaster (notifications)

API Layer
  ├── routes.ts
  │   ├── POST /api/orders
  │   ├── GET /api/orders
  │   └── GET /api/orders/:id
  │
  └── storage.ts (DatabaseStorage)
      └── db.ts (Drizzle connection)
          └── shared/schema.ts (tables & validation)
```

---

## Deployment Considerations

- **Environment Variables**: `DATABASE_URL`, `NODE_ENV`
- **Database Migrations**: Run `npm run db:push` before starting production
- **Build Process**: `npm run build` bundles both client and server
- **Static Files**: Express serves bundled client assets via `serveStatic` middleware
- **Port**: Server typically runs on port 3000 (configurable via environment)

---

## Summary

Island-Bake is a modern, full-stack application showcasing Jamaican baked goods with a clean separation of concerns:
- **Frontend**: React with Vite, featuring smooth animations and responsive design
- **Backend**: Express with type-safe database access via Drizzle ORM
- **Database**: PostgreSQL with runtime validation via Zod
- **Routing**: Wouter on client-side, Express on server-side
- **State**: React Query for server state, local component state for UI

The codebase demonstrates best practices in TypeScript, validation, error handling, and API design, making it a solid foundation for a real-world e-commerce application.
