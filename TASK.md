# TASK.md

Development roadmap for the Daehwastore Register application.

## Project Status

**Current State**: Initial Next.js setup with basic configuration
**Tech Stack Planning**: See [PLAN.md](PLAN.md)
**Requirements**: See [SPEC.md](SPEC.md)

---

## Phase 1: Foundation & Authentication

### 1.1 Database Setup
- [ ] Set up Supabase project
- [ ] Create database schema for three user roles:
  - `administrators` table (gender, name, phone)
  - `leaders` table (gender, name, phone, assigned_meeting_id)
  - `participants` table (gender, age, name, months, first_registration_month, phone, fee, re_registration, latest_registration, current_meeting, notes, past_meetings)
- [ ] Create `meetings` table for tracking different book club meetings
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create database migrations

### 1.2 Authentication
- [ ] Install and configure Supabase client
- [ ] Implement Google OAuth login flow
- [ ] Create authentication context/provider
- [ ] Build login page UI
- [ ] Implement role-based access control middleware
- [ ] Create protected route wrapper for admin-only pages

### 1.3 State Management
- [ ] Install Jotai
- [ ] Set up atoms for:
  - User authentication state
  - Current user role
  - Participant filters/search state
  - Pagination state

---

## Phase 2: Core UI Components

### 2.1 Layout & Navigation
- [ ] Create main layout with navigation bar
- [ ] Build role-based navigation menu (admin vs leader views)
- [ ] Add user profile dropdown with logout
- [ ] Implement responsive design for mobile/tablet

### 2.2 Reusable Components (shadcn/ui)
- [ ] Add Table component for participant lists
- [ ] Add Form components (Input, Select, Button, etc.)
- [ ] Add Dialog/Modal for create/edit forms
- [ ] Add Pagination component
- [ ] Add Search/Filter component
- [ ] Add Data export button

---

## Phase 3: Participant Management (Admin Features)

### 3.1 Participant List View
- [ ] Create participants list page with table display
- [ ] Implement 15 items per page pagination
- [ ] Add column sorting functionality
- [ ] Show all participant fields in table

### 3.2 Search & Filter
- [ ] Implement multi-field search:
  - Gender filter
  - Age range filter
  - Name search (partial match)
  - Months filter
  - First registration month filter
  - Phone number search
  - Fee filter
  - Re-registration status filter
  - Latest registration filter
  - Current meeting filter
- [ ] Add "Clear all filters" button
- [ ] Persist filter state in URL query params

### 3.3 CRUD Operations
- [ ] Create "Add Participant" form with all fields
- [ ] Implement participant creation API route
- [ ] Create "Edit Participant" form
- [ ] Implement participant update API route
- [ ] Add delete confirmation dialog
- [ ] Implement participant deletion API route
- [ ] Add form validation for all fields

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
