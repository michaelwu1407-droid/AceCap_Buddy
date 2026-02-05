# PJ-Buddy Project Log

This document tracks the development progress, key decisions, and version history of the PJ-Buddy project.

## v0.1.0 - Initial Setup & Core Features

**Date:** 2026-02-05

### Core Setup:
- **Project Scaffolding:** Initialized Next.js 15 project with TypeScript, Tailwind, and required dependencies.
- **Database Schema:** Defined the complete `schema.prisma` file for all core models.
- **Database Provisioning:** Successfully set up the database schema on Supabase by generating and manually executing a SQL script to bypass network issues (see `ISSUE-LOG.md`).

### Features Implemented (Hub & Spokes):
- **Agent Module:** Integrated the `findMatches` server action, allowing users to find matching contacts for a deal based on metadata.
- **Tradie Module:** Integrated the `generateQuote` server action into a deal detail page, allowing users to add line items and update deal values dynamically.
- **Server Actions:** Implemented core business logic for Tradie (`generateQuote`) and Agent (`findMatches`) modules, along with a `getDealHealth` utility.
- **Activities API:** Backend endpoints for creating and listing activities associated with deals or contacts.
- **Deals API & UI:** Full CRUD API and a Kanban board UI with drag-and-drop functionality for pipeline management.
- **Contacts API & UI:** Full CRUD API and a basic frontend for creating and listing contacts within a workspace.
- **Workspace API & UI:** Full CRUD API and frontend for creating and listing workspaces.
- **Core UI:** Established a root layout, homepage, and global stylesheet to provide basic navigation and structure.

### Project Management:
- Created `PROJECT_LOG.md` and `ISSUE_LOG.md`.
- Configured git identity and committed all initial work.

## v0.1.1 - Vercel Deployment & Troubleshooting

**Date:** 2026-02-05

### Deployment:
- Initiated deployment to Vercel.
- **Issue 1: Root Directory.** Resolved initial 404 error by setting the Vercel Root Directory to `pj-buddy`.
- **Issue 2: TypeScript Build Error.** Encountered a persistent `implicitly has an 'any' type` error. Fixed the code in `agent-actions.ts`.
- **Issue 3: Git & Vercel Sync.** Diagnosed and resolved a major desynchronization issue where Vercel was connected to an incorrect GitHub repository and was not receiving the pushed fixes.
- **Issue 4: Vercel Build Cache.** Identified a probable Vercel caching issue preventing the latest code from being built, even with the correct commit.
- **Solution:** Forced a Vercel cache invalidation by adding `prisma generate` to the `build` script in `package.json`. This ensures the database client is generated and forces Vercel to re-evaluate the build process.

### Current Status:
- The latest fix has been pushed to GitHub. A new Vercel deployment is in progress, which is expected to succeed.
