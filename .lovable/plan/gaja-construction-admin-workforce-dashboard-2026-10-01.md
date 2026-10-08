# GAJA Construction Admin & Workforce Dashboard

## Goal
Build a responsive, role-based construction operations dashboard from the supplied brief, using the screenshots as reference while modernizing the visual system.

## Experience
- Public role-selection page with Super Admin, Site Admin, and Site User entry points.
- Three distinct split-screen login pages with role-specific construction imagery, validation, password visibility, remember-me, and test credentials.
- A responsive dashboard shell with collapsible desktop sidebar, mobile drawer, top account menu, role badge, logout, and footer.
- Dense, practical management views optimized for construction operations rather than a marketing site.

## Role areas
- **Super Admin:** overview, states, locations, sites, site admins, site assignments, site users, and four invoice queues.
- **Site Admin:** assigned-site overview, sites, workforce management, and invoice review with approve/reject reasons.
- **Site User:** overview, assigned sites, invoice creation/upload and tracking, profile, and password management.

## Functionality
- Searchable, sortable, paginated data tables with page-size controls and mobile overflow.
- Add/edit forms, delete confirmation, field validation, status controls, empty/loading states, and notifications.
- Site and user assignment flows, filtered lists, invoice creation, approval, rejection, viewing, and download actions.
- Seed data based on the supplied screenshots, including the named states, locations, sites, and administrators.

## Data and access
- Enable Lovable Cloud for persistent authentication, profiles, operational records, and uploaded invoice files.
- Store roles in a dedicated protected roles table, with profiles linked to authenticated accounts.
- Enforce role and ownership rules at the data layer so each role only sees and changes permitted records.
- Use secure email/password sign-in; role-specific login screens route users to their authorized dashboard.

## Technical details
- Keep the existing TanStack Start, React, TypeScript, and Tailwind v4 foundation.
- Use file-based routes with authenticated role sections and server-validated data operations.
- Define the supplied royal blue, cyan, sky, and white palette as semantic design tokens.
- Generate cohesive role-specific construction imagery rather than embedding the reference screenshots.
- Add unique metadata to every public content route.
- Verify login, role routing, key CRUD flows, invoice workflow, logout, and desktop/mobile layouts.
