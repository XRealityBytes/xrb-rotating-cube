# Claude Code: XRB Rotating Cube

Read **`AGENTS.md`** first. It is the shared source of project guidance for Claude
Code and Codex. Read **`README.md`** for the workflow and
**`docs/SETUP_STATUS.md`** for verified setup and remote URLs.

## Project context

This is a small Vite + vanilla TypeScript + Three.js website using npm and
Node.js 24.x. Preserve the smoothly rotating cube-to-sphere morph, colour cycle,
responsive dark layout, animation controls, keyboard accessibility, and
reduced-motion behaviour.

- `src/main.ts` connects the page controls and scene lifecycle.
- `src/style.css` owns the responsive visual presentation.
- `src/scene/config.ts` exposes appearance, camera, lighting, and motion settings.
- `src/scene/createCubeScene.ts` owns rendering, animation, resize, and disposal.
- `.vscode/` and the `.code-workspace` file provide the shared development setup.
- `vercel.json` configures the production build and `dist/` output.

## Development

Start with `npm ci` and `npm run dev`. The development URL is
`http://127.0.0.1:5173`. Use `npm run format` after edits, then
`npm run check` and `npm run build`. `npm run preview` serves a built website at
`http://127.0.0.1:4173`.

Use strict TypeScript and the existing module boundaries. Keep rotation and
morphing based on elapsed time, remove listeners and GPU resources during teardown, and check
that hot replacement does not leave duplicate animation loops. Preserve the
lockfile and keep dependency versions compatible.

## Delivery

Use the GitHub and Vercel workflow in the README for authorised remote actions.
Preview and production deployments have separate npm scripts and VS Code tasks.
Preserve public repository visibility unless the user explicitly requests a
change, and verify actual remote resources before reporting success. Exclude
credentials and account-local state from commits and ZIPs. Report checks
performed and any remaining limitations.

When changing shared workflow guidance, update `AGENTS.md` first and keep this
summary consistent with it.
