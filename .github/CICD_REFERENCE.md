# CI/CD Quick Reference

Quick reference guide for GitHub Actions workflows and deployment configuration.

## Workflow Files

### `.github/workflows/ci.yml`

**Purpose:** Continuous Integration pipeline for all branches and pull requests

**Triggers:**
- Every push to any branch
- Every pull request

**Jobs:**
1. **lint-and-typecheck** - TypeScript validation
2. **test** - Run Vitest tests with coverage
3. **build** - Build production bundle
4. **pr-checks** - PR-specific status aggregation

**Job Dependencies:**
```
lint-and-typecheck ─┐
test ───────────────┼─→ pr-checks (PRs only)
build ──────────────┘
```

**Artifacts:**
- Coverage reports (30-day retention)
- Build output (7-day retention)

### `.github/workflows/deploy.yml`

**Purpose:** Automated deployment to Vercel (OPTIONAL)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Requirements:**
- `VERCEL_TOKEN` secret
- `VERCEL_ORG_ID` secret
- `VERCEL_PROJECT_ID` secret

**Note:** Only needed if NOT using Vercel GitHub integration (recommended).

---

## Commands Reference

### Local Testing

```bash
# Run type check (same as CI)
npx tsc --noEmit

# Run tests (same as CI)
npm test -- --run

# Run tests with coverage
npm test -- --coverage --run

# Build for production
npm run build

# Preview production build
npm run preview
```

### Vercel CLI

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# List deployments
vercel ls

# Inspect deployment
vercel inspect <url>

# View logs
vercel logs <url>
```

### GitHub CLI (for managing workflows)

```bash
# List workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch workflow run
gh run watch

# Re-run failed jobs
gh run rerun <run-id>
```

---

## Workflow Configuration

### Node.js Version

All workflows use **Node.js 20.x**:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

### Caching Strategy

npm dependencies are cached using `setup-node@v4`:

```yaml
with:
  cache: 'npm'
```

This speeds up workflow runs by ~30-50%.

### Parallel Execution

Jobs run in parallel by default (no `needs` dependency):

```yaml
jobs:
  job1:
    # Runs immediately
  job2:
    # Runs in parallel with job1
  job3:
    needs: [job1, job2]
    # Waits for job1 and job2 to complete
```

---

## Status Checks

### Required Checks for PRs

To enforce status checks:

1. Go to Repository Settings > Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select these checks:
   - `Lint & Type Check`
   - `Run Tests`
   - `Build Project`

### Status Check Badges

Add to README.md:

```markdown
![CI](https://github.com/Coldaine/interactive-viz-framework/workflows/CI%20Pipeline/badge.svg)
![Tests](https://img.shields.io/badge/tests-89%20passing-success)
```

---

## Vercel Configuration

### `vercel.json` Key Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Rewrites (SPA Routing)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures client-side routing works correctly.

### Headers

**Cache Control:**
```json
{
  "source": "/assets/(.*)",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=31536000, immutable"
    }
  ]
}
```

**Security Headers:**
```json
{
  "source": "/(.*)",
  "headers": [
    { "key": "X-Content-Type-Options", "value": "nosniff" },
    { "key": "X-Frame-Options", "value": "DENY" },
    { "key": "X-XSS-Protection", "value": "1; mode=block" }
  ]
}
```

---

## Debugging Workflows

### View Workflow Logs

1. Go to Actions tab in GitHub
2. Click on workflow run
3. Click on specific job
4. Expand step to view logs

### Common Issues

**Issue:** `npm ci` fails
```bash
# Solution: Verify package-lock.json is committed
git add package-lock.json
git commit -m "chore: add package-lock.json"
```

**Issue:** TypeScript errors in CI but not locally
```bash
# Solution: Ensure consistent TypeScript version
npm install
npm run build
```

**Issue:** Tests pass locally but fail in CI
```bash
# Solution: Run tests in non-watch mode
npm test -- --run

# Check for environment-specific code
```

### Enable Debug Logging

Add these secrets to your repository:

```
ACTIONS_STEP_DEBUG = true
ACTIONS_RUNNER_DEBUG = true
```

This enables verbose logging for all workflow runs.

---

## Deployment URLs

### Vercel URL Structure

**Production:**
```
https://your-project.vercel.app
https://your-custom-domain.com
```

**Preview (branch):**
```
https://your-project-git-branch-name.vercel.app
```

**Preview (PR):**
```
https://your-project-git-pr-123.vercel.app
```

### Environment Detection

```typescript
const isProduction = import.meta.env.PROD
const isDevelopment = import.meta.env.DEV
const mode = import.meta.env.MODE // 'production' | 'development'
```

---

## Performance Targets

### CI/CD Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Workflow Duration | < 5 min | ~3 min |
| Type Check | < 30s | ~15s |
| Test Suite | < 2 min | ~2.5s |
| Build Time | < 2 min | ~30s |

### Build Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Bundle Size (gzipped) | < 250 KB | ~150 KB |
| Time to Interactive | < 3s | ~2s |
| Initial Load | < 2s | ~1.5s |

---

## Security Best Practices

### Secrets Management

**Never commit these:**
- API keys
- Tokens
- Passwords
- Private keys

**Use GitHub Secrets:**
```bash
# Add via CLI
gh secret set MY_SECRET

# Add via UI
Settings > Secrets and variables > Actions
```

### Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Security Scanning

Enable in repository settings:
- Dependabot alerts
- Code scanning
- Secret scanning

---

## Maintenance Tasks

### Weekly

- [ ] Review Dependabot PRs
- [ ] Check workflow run success rate
- [ ] Monitor bundle size trends

### Monthly

- [ ] Update GitHub Actions to latest versions
- [ ] Review and clean up old artifacts
- [ ] Audit npm dependencies (`npm audit`)
- [ ] Update Node.js version if needed

### Quarterly

- [ ] Review CI/CD pipeline efficiency
- [ ] Optimize workflow run times
- [ ] Update documentation

---

## Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Vercel Docs:** https://vercel.com/docs
- **Workflow Syntax:** https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **Vercel Configuration:** https://vercel.com/docs/project-configuration

---

**Last Updated:** 2025-11-10
