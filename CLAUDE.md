# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a member management system for "대화상점" (Daehwa Store), a book club community. The application manages participant information with role-based access control for administrators, leaders, and participants.

**Key Purpose**: Store and manage participant information for a book club with search, pagination, and Excel export capabilities.

## Technology Stack

- **Framework**: Next.js 15.5.6 with App Router
- **React**: 19.1.0
- **TypeScript**: 5.x with strict mode enabled
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS 4.x with custom configuration
- **UI Components**: shadcn/ui (New York style) with Lucide icons
- **Validation**: Zod for schema validation
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Turbopack (via Next.js)
- **Package Manager**: pnpm

## Development Commands

```bash
# Development server with hot reload
pnpm dev

# Production build with Turbopack
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Run tests (watch mode)
pnpm test

# Run tests once
pnpm test --run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Project Structure

```
app/                 # Next.js App Router directory
  ├── layout.tsx    # Root layout with Geist fonts
  ├── page.tsx      # Home page
  └── globals.css   # Global styles with Tailwind directives
lib/
  ├── utils.ts      # Utility functions (cn helper for Tailwind)
  ├── supabase/     # Supabase client and database types
  ├── validations/  # Zod schemas for all entities
  └── services/     # Business logic layer (ParticipantService, etc.)
components/         # Reusable React components (shadcn/ui location)
supabase/
  └── migrations/   # Database migration SQL files
test/
  ├── setup.ts      # Test configuration
  └── test-utils.tsx # Custom test utilities
public/            # Static assets
```

## Key Configuration Files

- **tsconfig.json**: TypeScript config with `@/*` path alias for root-level imports
- **components.json**: shadcn/ui configuration (New York style, RSC enabled, stone base color)
- **next.config.ts**: Next.js configuration (minimal, uses defaults)
- **eslint.config.mjs**: ESLint with Next.js core-web-vitals and TypeScript rules
- **vitest.config.ts**: Vitest configuration with jsdom environment and path aliases
- **.env.local**: Environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Application Requirements (from SPEC.md)

### User Roles & Permissions

1. **Administrator (운영자)**
   - Stored data: Gender, Name, Phone number
   - Permissions: View/edit/delete all participants, manage leaders

2. **Leader (리더)**
   - Stored data: Gender, Name, Phone number, Assigned meeting
   - Permissions: View participants in their assigned meetings

3. **Participant (참여자)**
   - Stored data: Gender, Age, Name, Months, First registration month, Phone number, Membership fee, Re-registration, Latest registration, Current meeting, Notes, Past meeting list

### Core Features

- **Participant Search & Display**: Search by multiple fields (gender, age, name, months, first registration month, phone, fee, re-registration, latest registration, current meeting), display 15 per page in table format with pagination
- **Excel Export**: Export current page or all search results to Excel
- **Authentication**: Google OAuth with admin-managed leader access
- **CRUD Operations**: Full create, read, update, delete for participants (admin only)

## Code Style & Conventions

- Uses Geist Sans and Geist Mono fonts
- Tailwind utility-first approach with `cn()` helper from lib/utils.ts
- Component aliases: `@/components`, `@/lib`, `@/hooks`, `@/ui`
- ESLint enforced via Next.js TypeScript and core-web-vitals rules
- React Server Components by default (RSC: true in shadcn config)

## Development Workflow (TDD Approach)

This project follows Test-Driven Development (TDD):

1. **Write tests first**: Create test files (`.test.ts` or `.test.tsx`) before implementing features
2. **Run tests**: Use `pnpm test` to verify tests fail (Red phase)
3. **Implement**: Write minimal code to make tests pass (Green phase)
4. **Refactor**: Improve code while keeping tests green
5. **Repeat**: Continue for next feature

### Testing Guidelines

- All business logic in `lib/services/` should have corresponding tests
- All Zod validation schemas in `lib/validations/` should be tested
- Use `test/test-utils.tsx` for custom render functions with providers
- Mock external dependencies (Supabase) in service tests
- Aim for high test coverage on critical paths

### Database Setup

1. Create a Supabase project
2. Copy `.env.local.example` to `.env.local` and fill in credentials
3. Run migrations in `supabase/migrations/` directory
4. Database schema includes: administrators, leaders, participants, meetings tables
5. Row Level Security (RLS) is enabled on all tables

### Validation Layer

- All database entities have Zod schemas in `lib/validations/`
- Three schema types per entity: full schema, create schema, update schema
- Validation happens at service layer before database operations
- Phone format: Korean mobile numbers (010-XXXX-XXXX or 010XXXXXXXX)
- Date format: YYYY-MM for registration months

## Important Notes

- Project uses Turbopack for faster builds (both dev and build scripts)
- shadcn/ui components should be added to `components/ui/` directory
- Base color scheme is "stone" with CSS variables enabled
- Path imports use `@/*` syntax (configured in tsconfig.json)
- All service methods return validated data using Zod schemas
- ParticipantService includes pagination (default 15 per page) and advanced search filters
