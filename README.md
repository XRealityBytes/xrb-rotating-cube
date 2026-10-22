# XRB Rotating Cube

A small, runnable 3D starter for XRealityBytes: a lit, continuously rotating cube
that smoothly morphs into a sphere and back while cycling colours. It sits on a
responsive dark canvas with pause/resume, reset, and speed controls, plus a clean
place to experiment with camera, lighting, materials, and motion.

Built with **Vite, vanilla TypeScript, Three.js, and npm**. The project includes a
VS Code workspace, browser debugger, development tasks, agent instructions, and
Vercel configuration.

**Delivery status:** see [docs/SETUP_STATUS.md](docs/SETUP_STATUS.md) for the checks
actually performed and the verified GitHub/Vercel setup, URLs, or remaining steps.

## Prerequisites

- **Node.js 24.x** and npm. Check with `node --version` and `npm --version`.
- A recent browser with **WebGL 2** support and graphics acceleration enabled.
- VS Code is recommended. Chrome or Edge is needed for the supplied external
  browser debug configurations.
- Git, a GitHub account, and [GitHub CLI](https://cli.github.com/) are needed only
  for repository setup. A Vercel account is needed only for deployment.

Use the committed lockfile for a reproducible dependency installation. Exact
dependency and CLI versions are recorded in `package.json` and
`package-lock.json`.

## Quick start

Extract the ZIP, then run these commands from the extracted folder's parent:

```bash
cd xrb-rotating-cube
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**. Vite updates the page when you save source files.
Use `npm run dev:open` instead to start the server and open your browser together.
Stop the server with `Ctrl+C` in its terminal.

No environment variables or API keys are needed for the cube.

## Open and debug in VS Code

Open `xrb-rotating-cube.code-workspace` using **File → Open Workspace from File**,
or run this from the project folder if the `code` command is installed:

```bash
code xrb-rotating-cube.code-workspace
```

Install the recommended ESLint and Prettier extensions. Accept VS Code's option
to use the workspace TypeScript version after installing dependencies.

1. Run **Terminal → Run Task → Install dependencies** once, or use `npm ci`.
2. Open **Run and Debug**, choose **Cube: Chrome (start dev server)** or the Edge
   equivalent, and press **F5**.
3. The background task starts Vite, waits for the local URL, and opens the debugger.
   Put breakpoints in `src/main.ts` or the scene module.

**Cube: Chrome (production preview)** builds the website and opens port **4173**.
The development/preview task remains available after debugging; stop it with
**Terminal → Terminate Task** when finished. Stop a manually started server before
launching a debug configuration that starts another server on the same port.

## Commands and tasks

Use **Terminal → Run Task** for the corresponding named tasks.

| Command                     | Purpose                                                 |
| --------------------------- | ------------------------------------------------------- |
| `npm ci`                    | Install exactly the locked dependency set               |
| `npm run dev`               | Start development at `127.0.0.1:5173`                   |
| `npm run dev:open`          | Start development and open a browser                    |
| `npm run typecheck`         | Check TypeScript without generating files               |
| `npm run lint`              | Run ESLint; warnings fail the check                     |
| `npm run format`            | Apply Prettier formatting                               |
| `npm run format:check`      | Verify formatting without changing files                |
| `npm run check`             | Run type checking, linting, and formatting checks       |
| `npm run build`             | Type check and create the production website in `dist/` |
| `npm run preview`           | Serve an existing production build at `127.0.0.1:4173`  |
| `npm run vercel:login`      | Sign in to Vercel                                       |
| `npm run vercel:link`       | Create or link the Vercel project                       |
| `npm run vercel:git`        | Connect the linked project to the Git repository        |
| `npm run deploy:preview`    | Deploy to Vercel's preview environment                  |
| `npm run deploy:production` | Deploy to Vercel's production environment               |

**Build production** is the default build task (`Cmd+Shift+B` on macOS,
`Ctrl+Shift+B` on Windows/Linux). **Check: all** is the default test-group task;
it runs static checks. This starter does not require a separate test framework.

The **Preview production build** VS Code task builds first. When using the
terminal directly, run:

```bash
npm run build
npm run preview
```

## Change the cube

| File                           | Change here                                               |
| ------------------------------ | --------------------------------------------------------- |
| `src/scene/config.ts`          | Shape/material, morph, colour, camera, light, and speed   |
| `src/scene/createCubeScene.ts` | Scene geometry, morphing, rendering, resize, and disposal |
| `src/main.ts`                  | Controls and page-to-scene integration                    |
| `src/style.css`                | Colours, typography, layout, and mobile styling           |
| `index.html`                   | Page title, description, and entry document               |
| `vite.config.ts`               | Development/preview configuration                         |
| `public/`                      | Static assets                                             |

Rotation, morphing, and colour changes use elapsed time, so the animation is
independent of screen refresh rate. The speed control scales the complete motion.
Preserve resize handling and renderer cleanup when adding objects or controls. A
reduced-motion preference starts the experience paused; the user can choose to
resume it.

## Work with Claude Code or Codex

Open the project folder with your chosen agent. `AGENTS.md` contains the shared,
project-specific instructions for Codex and other agents. `CLAUDE.md` directs
Claude Code to the same guidance and summarises the important commands and files.

A useful first request is:

> Read AGENTS.md, CLAUDE.md, and README.md. Inspect the scene configuration, change
> the cube's material and lighting, then run the documented checks and preview
> the result. Preserve the working pause/resume and resize behaviour.

Keep agent instructions updated when scripts or architecture change. Agent
authentication and local preferences belong in your own environment.

## GitHub: public repository

Check `docs/SETUP_STATUS.md` first. Once the source has been pushed, clone the
verified URL to keep its commit history. If the repository is still empty, use
the ZIP and the existing-repository push commands in that report. The downloadable ZIP intentionally
excludes `.git`; it remains usable without Git or a GitHub account.

If remote creation is still outstanding, install GitHub CLI and run the following
from the extracted project directory. Git must have your own author name and
email configured before committing:

```bash
gh auth login
git init -b main
git add .
git commit -m "Initial rotating cube starter"
gh repo create xrb-rotating-cube --public --source=. --remote=origin --push
gh repo view --json nameWithOwner,isPrivate,url
git remote -v
```

The verification output should show `isPrivate: false` and the intended repository
URL. If that name already exists, inspect it and choose a new unused name for a
new project. If the repository has already been created for this starter, use the
setup report's instructions instead of creating another one.

## Vercel setup and deployment

The npm scripts use a pinned Vercel CLI through `npm exec`, so a global CLI
installation is unnecessary. The first Vercel command may download that CLI.

After GitHub setup, run:

```bash
npm run vercel:login
npm run vercel:link
npm run vercel:git
```

During linking, select the intended account/team. Create `xrb-rotating-cube` if it
does not exist, or choose the already verified project from the setup report.
The Git connection step uses the repository remote and may require granting
Vercel access to the GitHub repository.

Use these project settings:

| Setting               | Value           |
| --------------------- | --------------- |
| Framework preset      | Vite            |
| Root directory        | Project root    |
| Node.js version       | 24.x            |
| Install command       | `npm ci`        |
| Build command         | `npm run build` |
| Output directory      | `dist`          |
| Production branch     | `main`          |
| Environment variables | None required   |

Check and deploy a preview:

```bash
npm run check
npm run build
npm run deploy:preview
```

Inspect the returned preview URL. To publish to the project's production
environment, run:

```bash
npm run deploy:production
```

Once Git integration is connected, commits and pull requests can trigger Vercel
deployments according to the project's settings. Review the production branch
and **Deployment Protection** settings in the Vercel dashboard. Source repository
visibility and access to a deployed website are separate settings.

Vercel creates `.vercel/` locally when you link the project. It is excluded from
Git and the delivery ZIP. Keep account credentials and local environment files
out of source control. Record verified project/deployment URLs in the setup
report after completing any outstanding steps.

## Verification workflow

After changes, run:

```bash
npm run check
npm run build
```

In the browser, verify that the cube renders and rotates, pause/resume works,
the canvas resizes on desktop and mobile, controls work by keyboard, and there
are no unexpected console errors. Check the production preview after changes
to build configuration or asset loading. The delivery-specific results and any
unavailable checks are recorded in `docs/SETUP_STATUS.md`.

## Troubleshooting

| Symptom                         | Action                                                                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Node engine or dependency error | Switch to Node 24.x, then run `npm ci` again.                                                                                            |
| Port 5173 or 4173 is occupied   | Stop the previous process/task. Ports are strict so debugger URLs stay predictable.                                                      |
| F5 waits for the server         | Check the task terminal for an install error or occupied port. Keep the Vite output enabled so its readiness matcher can detect the URL. |
| Chrome/Edge cannot launch       | Install the selected browser or choose the other supplied debug configuration.                                                           |
| Blank scene / graphics error    | Enable browser graphics acceleration and use a browser/device with WebGL 2 support. Inspect the console.                                 |
| Page starts paused              | Check the operating system's reduced-motion preference; use Resume to opt into animation.                                                |
| Production preview is missing   | Run `npm run build` before `npm run preview`.                                                                                            |
| Git commit asks for an identity | Configure your Git author name and verified or GitHub no-reply email, then retry the commit.                                             |
| Vercel cannot access the repo   | Check the selected Vercel team and the GitHub integration's repository permissions.                                                      |

If changing ports intentionally, update `vite.config.ts`, `.vscode/tasks.json`
readiness matchers, `.vscode/launch.json` URLs, and these instructions together.

## Reference documentation

- [Vite guide](https://vite.dev/guide/)
- [Three.js documentation](https://threejs.org/docs/)
- [VS Code tasks](https://code.visualstudio.com/docs/debugtest/tasks)
- [VS Code browser debugging](https://code.visualstudio.com/docs/nodejs/browser-debugging)
- [GitHub CLI: create a repository](https://cli.github.com/manual/gh_repo_create)
- [GitHub CLI: inspect a repository](https://cli.github.com/manual/gh_repo_view)
- [Vercel project linking](https://vercel.com/docs/cli/link)
- [Vercel Git connection](https://vercel.com/docs/cli/git)
- [Vercel deployment from the CLI](https://vercel.com/docs/projects/deploy-from-cli)
