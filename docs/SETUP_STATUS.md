# Delivery and setup status

Prepared on 22 October 2026.

## Run locally

The complete starter requires **Node.js 24.x and npm 11.x**. No API keys are needed.

```bash
cd xrb-rotating-cube
npm ci
npm run dev
```

Open <http://127.0.0.1:5173>. Open `xrb-rotating-cube.code-workspace` in VS Code.

## Verification

- Dependency installation, including a clean `npm ci` from the lockfile: passed.
- TypeScript checking, ESLint with zero warnings, and Prettier validation: passed.
- Vite production build: passed; generated `dist/`.
- VS Code configuration JSON, debugger task references, and Vite readiness
  patterns: checked. VS Code itself was not launched here.
- Browser page load and WebGL 2 rendering: passed in Chrome. The cube-to-sphere
  loop, colour changes, pause/resume, reset, keyboard speed adjustment, and
  desktop/mobile framing were checked with no application console errors. The
  browser session did not expose a reduced-motion emulation control, so that
  preference path was reviewed in code but not visually re-tested.

The build emits a non-failing size advisory for the Three.js engine chunk:
approximately 540 kB minified, 134 kB gzip. The engine is cached separately from
the small application module.

Versions were checked against the npm registry and pinned: Vite 8.3.5, Three.js
0.186.1, TypeScript 6.0.3, ESLint 10.13.0, typescript-eslint 8.72.0, Prettier 3.9.10.
TypeScript 6.0.3 is the current stable version compatible with the linter's
TypeScript peer range; the newer TypeScript 7 release was not combined with that
incompatible dependency. Vercel CLI 65.1.0 is downloaded on demand by deployment
scripts and is not needed for normal development.

## GitHub: public publication requested

Repository: <https://github.com/XRealityBytes/xrb-rotating-cube>

The repository was created earlier under **XRealityBytes**. On 22 October 2026,
the user authorised publishing it publicly and pushing the current source. The
source tree is being prepared as a local `main` branch with this URL configured
as `origin`. The downloadable ZIP intentionally excludes `.git`.

To populate this existing empty repository from the extracted ZIP, run the
following from the project folder. Git must have your own author name and email
configured. Install GitHub CLI from <https://cli.github.com/> if needed.

```bash
gh auth login
gh auth setup-git
git init -b main
git add .
git commit -m "Initial rotating cube starter"
git remote add origin https://github.com/XRealityBytes/xrb-rotating-cube.git
git push -u origin main
gh repo view XRealityBytes/xrb-rotating-cube --json nameWithOwner,isPrivate,url
```

These commands assume an extracted ZIP without `.git`. For an existing checkout,
inspect `git status` and `git remote -v` and skip already completed initialization
steps. Do not force-push if the remote has acquired commits. Verify that the
repository reports `isPrivate: false` after publication.

## Vercel: configured; remote project outstanding

No Vercel project or deployment was created, so there is no verified Vercel URL.
Remote setup was stopped when the user asked to wrap up. No Vercel plugin is
required for the CLI workflow.

After pushing the repository:

```bash
npm run vercel:login
npm run vercel:link
npm run vercel:git
npm run deploy:preview
```

Choose the intended Vercel account/team and create `xrb-rotating-cube` during
linking. Use the project root, Vite preset, Node.js 24.x, `npm ci` for installation,
`npm run build` for building, and `dist` as output. `vercel.json` supplies the build
settings. No environment variables are required.

After checking the preview, deploy to production with:

```bash
npm run deploy:production
```

The source repository's visibility and the website's deployment-protection
settings are separate; choose website access in Vercel.

## Archive

The ZIP contains one `xrb-rotating-cube/` folder with source, documentation,
lockfile, workspace and required dotfiles. Dependencies, build output, `.git`,
`.vercel`, credentials and temporary QA pages are excluded.
