# TASK.md

Development roadmap for the Daehwastore Register application.

## Project Status

**Current State**: Initial Next.js setup with basic configuration
**Tech Stack Planning**: See [PLAN.md](PLAN.md)
**Requirements**: See [SPEC.md](SPEC.md)

---

## Phase 1: Foundation & Authentication

### 1.1 Database Setup
- [x] Set up Supabase project (pending user setup)
- [x] Create database schema for three user roles:
  - `administrators` table (gender, name, phone)
  - `leaders` table (gender, name, phone, assigned_meeting_id)
  - `participants` table (gender, age, name, months, first_registration_month, phone, fee, re_registration, latest_registration, current_meeting, notes, past_meetings)
- [x] Create `meetings` table for tracking different book club meetings
- [x] Set up Row Level Security (RLS) policies (after DB setup)
- [x] Create database migrations (SQL files ready in supabase/migrations/)

### 1.2 Authentication
- [x] Install and configure Supabase client
- [x] Implement Google OAuth login flow (AuthService in lib/services/auth.ts)
- [x] Create authentication context/provider (Jotai atoms in lib/store/auth.ts)
- [x] Build login page UI (app/login/page.tsx)
- [x] Create OAuth callback route (app/auth/callback/route.ts)
- [x] Implement role-based access control middleware
- [x] Create protected route wrapper for admin-only pages

### 1.3 State Management
- [x] Install Jotai
- [x] Set up atoms for:
  - User authentication state (lib/store/auth.ts)
  - Current user role (derived atom)
  - Participant filters/search state (lib/store/participant.ts)
  - Pagination state (lib/store/participant.ts)

---

## Phase 2: Core UI Components

### 2.1 Layout & Navigation
- [x] Create main layout with navigation bar
- [x] Build role-based navigation menu (admin vs leader views)
- [x] Add user profile dropdown with logout
- [ ] Implement responsive design for mobile/tablet

### 2.2 Reusable Components (shadcn/ui)
- [x] Add Table component for participant lists
- [x] Add Form components (Input, Select, Button, etc.)
- [x] Add Dialog/Modal for create/edit forms
- [x] Add Pagination component
- [x] Add Card component for data display
- [x] Add Badge component for status indicators
- [x] Add Tabs component for organizing content
- [x] Add Toast/Sonner for notifications
- [ ] Add Search/Filter component (will implement with participant features)
- [ ] Add Data export button (will implement with Excel export)

---

## Phase 3: Participant Management (Admin Features)

### 3.1 Participant List View
- [x] Create participants list page with table display
- [x] Implement 15 items per page pagination (using ParticipantService.search)
- [x] Add column sorting functionality
- [x] Show participant fields in table (name, gender, age, phone, months, fee, meeting, date)

### 3.2 Search & Filter
- [x] Implement multi-field search:
  - [x] Gender filter
  - [x] Age range filter
  - [x] Name search (partial match)
  - [x] Months filter
  - [x] First registration month filter
  - [x] Phone number search
  - [x] Fee filter
  - [x] Re-registration status filter
  - [x] Latest registration filter
  - [ ] Current meeting filter (waiting for meetings implementation)
- [x] Add "Clear all filters" button
- [ ] Persist filter state in URL query params (deferred to later)

### 3.3 CRUD Operations
- [x] Create "Add Participant" form with all fields
- [x] Implement participant creation (using ParticipantService.create)
- [x] Create "Edit Participant" form (same component, different mode)
- [x] Implement participant update (using ParticipantService.update)
- [x] Add delete confirmation dialog
- [x] Implement participant deletion (ParticipantService.delete exists)
- [x] Add form validation for all fields (using Zod + react-hook-form)

### 3.4 Excel Export
- [ ] Install Excel export library (e.g., xlsx or exceljs)
- [ ] Implement "Export Current Page" functionality
- [ ] Implement "Export All Results" functionality
- [ ] Format Excel with proper headers and styling

---

## Phase 4: Leader Management (Admin Features)

### 4.1 Leader List View
- [ ] Create leaders list page
- [ ] Display leader information in table
- [ ] Show assigned meetings for each leader

### 4.2 Leader CRUD
- [ ] Create "Add Leader" form
- [ ] Implement leader creation with Google account registration
- [ ] Create "Edit Leader" form (including meeting assignments)
- [ ] Implement leader update API route
- [ ] Add delete confirmation for leaders
- [ ] Implement leader deletion (revoke access)

### 4.3 Meeting Assignment
- [ ] Create interface to assign leaders to meetings
- [ ] Allow multiple leaders per meeting (if needed)
- [ ] Show leader-meeting relationships clearly

---

## Phase 5: Leader View Features

### 5.1 Leader Dashboard
- [ ] Create leader-specific dashboard
- [ ] Display only participants in assigned meetings
- [ ] Show read-only participant information
- [ ] Implement same search/filter as admin (scoped to assigned meetings)
- [ ] Add pagination for leader view

---

## Phase 6: Code Quality & Developer Experience

### 6.1 Linting & Formatting
- [ ] Configure Prettier (as mentioned in PLAN.md)
- [ ] Set up Prettier + ESLint integration
- [ ] Add pre-commit hooks with husky (optional)
- [ ] Create .prettierrc configuration

### 6.2 Type Safety
- [ ] Generate TypeScript types from Supabase schema
- [ ] Create shared type definitions for all entities
- [ ] Add Zod schemas for form validation

### 6.3 Error Handling
- [ ] Implement global error boundary
- [ ] Add toast notifications for user actions
- [ ] Create error logging strategy
- [ ] Add loading states for all async operations

---

## Phase 7: Testing & Deployment

### 7.1 Testing
- [ ] Set up testing environment (Jest/Vitest + React Testing Library)
- [ ] Write unit tests for utility functions
- [ ] Write integration tests for API routes
- [ ] Write component tests for key UI elements

### 7.2 Deployment
- [ ] Set up environment variables for production
- [ ] Configure Vercel deployment (or alternative)
- [ ] Set up CI/CD pipeline
- [ ] Configure production Supabase instance
- [ ] Test production Google OAuth flow

---

## Phase 8: Polish & Optimization

### 8.1 Performance
- [ ] Implement data caching strategies
- [ ] Optimize database queries with indexes
- [ ] Add React Query/SWR for server state management
- [ ] Implement optimistic UI updates

### 8.2 UX Improvements
- [ ] Add keyboard shortcuts for common actions
- [ ] Implement bulk operations (multi-select delete/export)
- [ ] Add data import functionality (Excel/CSV upload)
- [ ] Improve mobile responsiveness

### 8.3 Accessibility
- [ ] Audit with Lighthouse
- [ ] Add ARIA labels where needed
- [ ] Ensure keyboard navigation works throughout
- [ ] Test with screen readers

---

## Notes

- Each phase should be completed before moving to the next
- Admin features take priority over leader features
- Participant management is the core feature and should be thoroughly tested
- Keep the UI simple and focused on data management tasks
