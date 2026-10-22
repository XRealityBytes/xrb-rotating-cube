# Agent instructions: XRB Rotating Cube

## Purpose and boundaries

Maintain a small, understandable browser demo: a smoothly rotating, lit 3D cube
that morphs into a sphere and back while cycling colours, with a responsive dark
presentation and accessible animation controls. This is a Vite + vanilla
TypeScript + Three.js project using npm and Node.js 24.x. The source repository
is public. Follow the user's current authorisation for GitHub and Vercel actions.

Keep the starter easy to extend. Add a framework, server, external asset service,
or new dependency only when the requested feature warrants it.

## Read and work here

Read `README.md` and `docs/SETUP_STATUS.md` for usage and verified delivery status.

| Path                                 | Responsibility                                                |
| ------------------------------------ | ------------------------------------------------------------- |
| `src/main.ts`                        | DOM setup, controls, and scene lifecycle                      |
| `src/style.css`                      | Responsive layout, colours, typography, and focus states      |
| `src/scene/config.ts`                | Cube, camera, lighting, and rotation settings                 |
| `src/scene/createCubeScene.ts`       | Three.js objects, animation, resize, and disposal             |
| `index.html`                         | Page entry and document metadata                              |
| `public/`                            | Static assets copied into the build                           |
| `vite.config.ts`                     | Development/preview ports and build configuration             |
| `.vscode/`                           | Shared tasks, browser debugger, settings, and recommendations |
| `vercel.json`                        | Deployment build settings                                     |
| `package.json` / `package-lock.json` | Scripts and reproducible dependencies                         |

## Commands

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm run format
npm run format:check
npm run check
npm run build
npm run preview
```

Development uses `http://127.0.0.1:5173`; production preview uses
`http://127.0.0.1:4173`. Both ports are strict. If a port changes, update
`vite.config.ts`, the VS Code URLs/readiness matchers, and the README together.

## Implementation conventions

- Use TypeScript with strict checking. Prefer explicit interfaces at module
  boundaries and meaningful names over casts or suppressed errors.
- Keep scene configuration separate from rendering and DOM controls.
- Express angular speed per second and advance rotation and morphing using elapsed time.
  Handle pause/resume and background tabs without large visible jumps.
- Preserve responsive sizing, a sensible pixel-ratio cap, reduced-motion
  behaviour, keyboard access, visible focus, and meaningful control labels.
- Dispose of renderer resources and remove event listeners during teardown or
  hot replacement. Avoid adding duplicate animation loops after source edits.
- Format with Prettier and maintain the existing ESLint configuration.
- Update `package-lock.json` with dependency changes. Check compatibility before
  upgrading packages; do not silently replace a compatible set with mismatched
  latest versions.

## Verification

For source/config changes, run `npm run check` and `npm run build`. Run `npm ci`
when dependency inputs change or when verifying a fresh extraction.

For visible changes, inspect the page in a browser: rendering, continuous
rotation, pause/resume, desktop/mobile sizing, keyboard controls, and console
errors. Check a reduced-motion preference when changing animation behaviour.
Preview the production build when changing loading, assets, or build settings.
Record which checks ran; describe unavailable checks honestly. Add focused tests
only when a new behaviour or regression warrants them.

## GitHub, Vercel, and handoff

Inspect the existing branch, remote, and linked Vercel project before changing
them. Use the existing project identities recorded in `docs/SETUP_STATUS.md`.
Complete relevant checks before pushing or deploying requested changes.

The deployment scripts are `vercel:login`, `vercel:link`, `vercel:git`,
`deploy:preview`, and `deploy:production`. They use the CLI version pinned in
`package.json`. The intended build output is `dist/`.

Preserve public repository visibility unless the user explicitly requests a
change. Website access is controlled separately in Vercel. Keep credentials,
`.env` files, `.vercel/`, local agent settings,
`node_modules/`, and generated output out of commits and delivery archives.
Never infer successful remote creation or deployment from a local config file;
verify the returned resource and record its actual URL.

Keep these instructions and `CLAUDE.md` consistent. Update the README when
commands, architecture, behaviour, or setup requirements change.
