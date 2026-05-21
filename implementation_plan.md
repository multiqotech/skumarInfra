# Dynamic "We Build" Projects & Admin Scalability Refactor

This plan outlines the architecture for making the "We Build" section fully dynamic, adding a Project Details page, and refactoring the Admin dashboard to improve scalability by breaking it into reusable components.

## Proposed Changes

### Server (Backend)
- **New Model**: Create `server/models/Project.js`.
  - Fields: `title`, `category` (e.g. 'airports', 'bridges'), `image`, `description`, `timeToBuild`, `engineers`, `location`.
- **New Controller**: Create `server/controllers/projectController.js`.
  - Functions to handle `getProjectsByCategory`, `getProjectById`, `createProject`, `updateProject`, `deleteProject`.
- **New Routes**: Update `server/routes/contentRoutes.js` (or create `projectRoutes.js`) to expose these endpoints.

### Admin (Dashboard Refactor & New Features)
The current `admin/src/app/page.js` is over 1100 lines. To make it scalable, I will break it down into modular components:
- **[NEW]** `admin/src/components/FaqManager.jsx`
- **[NEW]** `admin/src/components/TeamManager.jsx`
- **[NEW]** `admin/src/components/TestimonialManager.jsx`
- **[NEW]** `admin/src/components/VideoManager.jsx`
- **[NEW]** `admin/src/components/ProjectManager.jsx` (Handles adding/editing projects for the "We Build" section)
- **[MODIFY]** `admin/src/app/page.js` to simply import and render these components based on the active tab.

The new `ProjectManager` will allow the admin to select a category (e.g., Airports, Bridges) and then manage (Add/Edit/Delete) the projects under that category. Projects will require fields for: Image, Name, Description, Time to Build, Engineers, and Location.

### Client (Frontend)
- **[MODIFY]** `client/src/data/weBuildData.js`: Enhance the existing dummy data to include the new fields (`description`, `timeToBuild`, `engineers`, `location`) so the fallback looks good when the database is empty.
- **[MODIFY]** `client/src/app/we-build/[slug]/page.js`: Update the page to fetch projects from the database (via `/api/projects/:category`). If the database has no projects for a category, it will fall back to `weBuildData`. The project cards will now wrap in a Next.js `Link` pointing to the new details page.
- **[NEW]** `client/src/app/we-build/[slug]/[projectId]/page.js`: A new dynamic route to display the individual project details (Image, Name, Description, Time to Build, Engineers, Location). It will fetch the specific project from the backend (or fallback to dummy data if a dummy project was clicked).

## Open Questions

> [!IMPORTANT]
> 1. Do you want the "Time to Build" field to be a simple text input (e.g., "24 months") or a strict date range (e.g., "Jan 2020 - Dec 2021")?
> 2. For the dummy data fallback on the Project Details page, I will generate an ID based on the array index so the routing works. Is this acceptable?
> 3. Do you want any specific layout for the Project Details page, or should I design a premium layout consistent with the rest of the site?

## Verification Plan

### Automated Tests
- Build and run the `admin`, `client`, and `server` apps locally.
- Verify API endpoints return expected data or fallback appropriately.

### Manual Verification
- Test creating, updating, and deleting a project in the new Admin Panel.
- Verify Cloudinary image uploads still function correctly for Projects.
- Navigate to the Client "We Build" section, click a category, verify it loads either DB or dummy data.
- Click a specific project and verify the new Details page renders the correct information cleanly.
