# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build (output to `dist/`)
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the project

There is no test suite configured in this project.

## Architecture

This is a single-page personal portfolio site built with React 19 + Vite. There is no router in use (`react-router-dom` is a dependency but `App.jsx` does not use it) — navigation is done entirely via same-page anchor links (`#home`, `#about`, etc.) that `NavBar.jsx` points at section IDs.

`App.jsx` is a flat composition root: it renders one top-level component per page section, in order, with no shared layout wrapper or context providers:

```
NavBar → Home → About → Experience → Skill → Projects
```

Each section component (`src/components/*.jsx`) is self-contained:
- Owns an `id="..."` on its root `<section>` matching the NavBar anchor for that section.
- Defines its own content as a local data array (e.g. `experiences` in `Experience.jsx`, `projects` in `Projects.jsx`) directly in the file rather than pulling from a separate data/config module. **When updating resume content (jobs, projects, skills), edit the array literal inside the relevant component file directly.**
- Imports images directly from `src/assets/` (organized into `Experience_Photos/`, `Project_Images/`, `Hobby_Images/`) as ES module imports, not from `public/`.

### Styling

Styling is split across two systems that coexist but are not mixed within the same component:
- `src/App.css` (~1000 lines) holds nearly all hand-written component styles, keyed by the custom class names used in JSX (e.g. `.timeline-card`, `.project-card`, `.navbar-links`). This is the primary styling mechanism — most components import `App.css` and use plain custom classNames, not Tailwind utility classes.
- Tailwind (`@tailwindcss/vite`) is wired up via `@import "tailwindcss"` in `src/index.css`, but is not actually used for utility classes in the existing components. Treat `App.css` as the source of truth for section/component styles unless deliberately migrating to Tailwind.

Animations use `framer-motion` (see the `motion.div` scroll-reveal pattern in `Experience.jsx`). The animated background on the Home section uses `react-tsparticles`/`tsparticles-slim` (`PixelAnimation.jsx`), configured via a `useMemo` options object — this is a legacy tsParticles v2-style config object, not the newer `@tsparticles/react` API.

MUI (`@mui/material`, `@mui/icons-material`) and `react-icons`/`lucide-react` are both available for icons; existing components favor `react-icons` (e.g. `FaGithub`, `FaLinkedinIn` in `NavBar.jsx`).
