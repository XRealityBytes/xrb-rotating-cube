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

## GitHub: public and source pushed

Repository: <https://github.com/XRealityBytes/xrb-rotating-cube>

On 22 October 2026, **Public** visibility was verified in GitHub and the complete
source was pushed to `main`. The initial source commit was
`7f038851a7ed8ba18e4d5afdb9c1a81ddbb95e69`. The local `main` branch tracks
`origin/main`, and `origin` points to the repository above.

Clone the public repository with:

```bash
git clone https://github.com/XRealityBytes/xrb-rotating-cube.git
```

The downloadable ZIP intentionally excludes `.git`. Credentials, `.env` files,
dependencies, generated build output, and account-local deployment state were
excluded from the commit.

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
