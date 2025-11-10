# Deployment Guide

Complete guide for deploying the Interactive Visualization Framework to production.

## Table of Contents

- [Quick Deploy to Vercel](#quick-deploy-to-vercel)
- [CI/CD Pipeline Setup](#cicd-pipeline-setup)
- [Manual Deployment](#manual-deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

---

## Quick Deploy to Vercel

### Method 1: One-Click Deploy (Recommended)

Click the button below to deploy directly from GitHub:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Coldaine/interactive-viz-framework)

This will:
1. Fork or clone the repository to your GitHub account
2. Create a new Vercel project
3. Automatically configure build settings
4. Deploy to production

### Method 2: GitHub Integration

1. **Connect Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository

2. **Configure Project**
   - Vercel auto-detects Vite framework
   - Verify settings:
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for first deployment
   - Receive production URL (e.g., `your-project.vercel.app`)

### Method 3: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## CI/CD Pipeline Setup

### GitHub Actions Workflows

Two workflows are included:

#### 1. CI Pipeline (`.github/workflows/ci.yml`)

Runs automatically on every push and pull request:

**Jobs:**
- **Lint & Type Check** - TypeScript strict mode validation
- **Run Tests** - Vitest test suite with coverage
- **Build Project** - Production build verification
- **PR Status Check** - Aggregate status for pull requests

**Features:**
- Parallel job execution for faster builds
- Dependency caching for npm packages
- Coverage report artifacts (30-day retention)
- Build artifacts (7-day retention)
- PR status summaries
- Bundle size reporting

**Triggers:**
```yaml
on:
  push:
    branches: ['**']
  pull_request:
    branches: ['**']
```

#### 2. Deploy Workflow (`.github/workflows/deploy.yml`) - Optional

Automatically deploys to Vercel on push to `main` branch.

**Setup Required:**

1. Get Vercel credentials:
   - Token: https://vercel.com/account/tokens
   - Org ID: Vercel team settings
   - Project ID: Vercel project settings

2. Add GitHub secrets:
   ```
   Settings > Secrets and variables > Actions > New repository secret
   ```

   Required secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

3. Commit the workflow to your repository

**Note:** The Vercel GitHub integration handles deployments automatically, making this workflow optional. Use it only if you need custom deployment logic.

### CI/CD Best Practices

**Branch Protection Rules (Recommended):**

1. Go to repository Settings > Branches
2. Add rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - Select checks: `Lint & Type Check`, `Run Tests`, `Build Project`
   - ✅ Require linear history
   - ✅ Do not allow bypassing

This prevents merging PRs with failing tests or build errors.

---

## Manual Deployment

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Build Locally

```bash
# Install dependencies
npm install

# Run tests to verify everything works
npm test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The `dist/` directory contains the production build.

### Deploy to Static Hosting

The built files can be deployed to any static hosting service:

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages

1. Build the project: `npm run build`
2. Copy `dist/` contents to `gh-pages` branch
3. Enable GitHub Pages in repository settings

#### Cloudflare Pages

1. Connect repository to Cloudflare Pages
2. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`

---

## Environment Configuration

### Build Configuration

**`vercel.json`** - Vercel deployment configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

**Key Features:**
- **SPA Routing:** Catch-all rewrites for client-side routing
- **Asset Caching:** 1-year cache for `/assets/*` (Vite hashed filenames)
- **Security Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`

### Environment Variables

No environment variables are required for the base deployment.

**To add environment variables:**

1. **Vercel Dashboard:**
   - Go to Project Settings > Environment Variables
   - Add variables for Production/Preview/Development
   - Redeploy to apply changes

2. **Vercel CLI:**
   ```bash
   vercel env add MY_VAR production
   vercel env add MY_VAR preview
   vercel env add MY_VAR development
   ```

3. **Access in code:**
   ```typescript
   const apiKey = import.meta.env.VITE_API_KEY
   ```

**Important:** Prefix client-side env vars with `VITE_` to expose them to the browser.

### Custom Domain

1. Go to Vercel Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate is automatically provisioned

---

## Troubleshooting

### Build Failures

**Issue:** TypeScript errors during build

```bash
# Solution: Run type check locally
npx tsc --noEmit

# Fix errors and commit
git add .
git commit -m "fix: resolve TypeScript errors"
git push
```

**Issue:** Tests failing in CI but passing locally

```bash
# Run tests in CI mode
npm test -- --run

# Check for environment-specific issues
# (missing mocks, timezone differences, etc.)
```

**Issue:** Build succeeds but app doesn't work

```bash
# Test production build locally
npm run build
npm run preview

# Check browser console for errors
# Verify all assets are loading
```

### Deployment Issues

**Issue:** 404 on refresh (SPA routing)

```json
// Verify vercel.json has catch-all rewrite:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Issue:** Assets not loading

```bash
# Check vite.config.ts for base path
export default defineConfig({
  base: '/', // Should be '/' for root deployment
  // ...
})
```

**Issue:** Vercel deployment slow

```bash
# Check bundle size
npm run build
du -sh dist

# Optimize if needed:
# - Code splitting
# - Lazy loading
# - Tree shaking
# - Asset optimization
```

### CI/CD Issues

**Issue:** GitHub Actions workflow not running

1. Check workflow file syntax (YAML indentation)
2. Verify workflows are enabled in repository settings
3. Check if Actions are enabled for your account

**Issue:** Tests timeout in CI

```yaml
# Increase timeout in vitest.config.ts
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
  },
})
```

**Issue:** Deployment secrets not working

1. Verify secret names match exactly (case-sensitive)
2. Re-add secrets if copied incorrectly
3. Check workflow has `secrets` permission

---

## Performance Monitoring

### Vercel Analytics

Enable analytics in Vercel dashboard:
1. Go to Project Settings > Analytics
2. Enable Web Analytics
3. Deploy to see metrics

**Metrics tracked:**
- Page load times
- Core Web Vitals
- Geographic distribution
- Device/browser breakdown

### Bundle Size Tracking

CI pipeline automatically reports bundle size:

```bash
# Check locally
npm run build
du -sh dist

# Target: < 250 KB gzipped
```

---

## Rollback Strategy

### Vercel Rollback

1. Go to Deployments tab in Vercel dashboard
2. Find previous successful deployment
3. Click "..." menu > "Promote to Production"

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push

# Reset to specific commit
git reset --hard <commit-hash>
git push --force
```

**Note:** Force push requires disabling branch protection temporarily.

---

## Security Checklist

- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Security headers configured (`vercel.json`)
- ✅ No sensitive data in client-side code
- ✅ Environment variables for secrets
- ✅ Dependency security audits (`npm audit`)
- ✅ CSP headers (add if needed)
- ✅ Rate limiting (add if needed)

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure custom domain (optional)
3. ✅ Enable branch protection rules
4. ✅ Set up monitoring/analytics
5. ✅ Share production URL
6. ✅ Monitor first week of traffic

---

## Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy
- **GitHub Actions:** https://docs.github.com/en/actions
- **React Flow Deployment:** https://reactflow.dev/learn/advanced-use/deployment

---

**Last Updated:** 2025-11-10
