# Deployment Checklist

Step-by-step checklist for deploying the Interactive Visualization Framework.

## Pre-Deployment

### Local Verification

- [ ] All tests passing locally
  ```bash
  npm test
  ```

- [ ] TypeScript compilation successful
  ```bash
  npx tsc --noEmit
  ```

- [ ] Production build works
  ```bash
  npm run build
  npm run preview
  ```

- [ ] No console errors in browser
  - Open http://localhost:4173
  - Check DevTools Console (F12)
  - Test all node types and interactions

- [ ] Dependencies up to date
  ```bash
  npm outdated
  npm audit
  ```

## GitHub Setup

### Repository Configuration

- [ ] Repository pushed to GitHub
  ```bash
  git remote -v
  # Should show: https://github.com/Coldaine/interactive-viz-framework.git
  ```

- [ ] All files committed
  ```bash
  git status
  # Should show: "nothing to commit, working tree clean"
  ```

- [ ] Main branch protected (optional but recommended)
  - Go to: Settings > Branches > Add rule
  - Branch name pattern: `main`
  - ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Select checks: `Lint & Type Check`, `Run Tests`, `Build Project`

### GitHub Actions

- [ ] Workflows enabled
  - Go to: Actions tab
  - Enable workflows if prompted

- [ ] First workflow run successful
  - Push a commit to trigger CI
  - Wait for all jobs to complete
  - Verify all jobs are green ✅

- [ ] Artifacts available (after first run)
  - Go to: Actions > Latest workflow run
  - Check "Artifacts" section
  - Should see: `coverage-report` and `build-output`

## Vercel Deployment

### Method A: GitHub Integration (Recommended)

- [ ] Sign up for Vercel (if needed)
  - Go to: https://vercel.com/signup
  - Sign in with GitHub

- [ ] Import project
  - Go to: https://vercel.com/new
  - Click "Import Project"
  - Select GitHub repository
  - Click "Import"

- [ ] Verify build settings (auto-detected)
  - **Framework Preset:** Vite
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Install Command:** `npm install`
  - Do NOT change these unless necessary

- [ ] Deploy
  - Click "Deploy"
  - Wait 2-3 minutes
  - Celebrate! 🎉

- [ ] Test production deployment
  - Click on deployment URL
  - Test all functionality
  - Check browser console for errors

- [ ] Configure custom domain (optional)
  - Go to: Project Settings > Domains
  - Add domain
  - Configure DNS as instructed
  - Wait for SSL certificate

### Method B: Vercel CLI

- [ ] Install Vercel CLI
  ```bash
  npm i -g vercel
  ```

- [ ] Login to Vercel
  ```bash
  vercel login
  ```

- [ ] Deploy to preview
  ```bash
  vercel
  ```

- [ ] Test preview deployment
  - Open URL provided by CLI
  - Verify everything works

- [ ] Deploy to production
  ```bash
  vercel --prod
  ```

## Post-Deployment

### Verification

- [ ] Production URL accessible
  - Visit deployment URL
  - Load time < 3 seconds
  - No console errors

- [ ] All features working
  - [ ] Canvas drag/zoom/pan
  - [ ] All 7 node types render correctly
  - [ ] All 4 edge types display properly
  - [ ] Animations working
  - [ ] Interactive features functional

- [ ] Mobile responsive
  - Test on mobile device or DevTools responsive mode
  - Verify touch interactions work

- [ ] SEO basics
  - View page source
  - Check `<title>` tag
  - Check meta description

### Monitoring Setup

- [ ] Enable Vercel Analytics (optional)
  - Go to: Project Settings > Analytics
  - Toggle "Enable Web Analytics"

- [ ] Set up error tracking (optional)
  - Integrate Sentry or similar
  - Configure error boundaries

- [ ] Bookmark deployment URLs
  - Production: `https://your-project.vercel.app`
  - Vercel Dashboard: `https://vercel.com/your-team/your-project`

### Documentation Updates

- [ ] Update README.md with live demo URL
  ```markdown
  🔗 **Live Demo:** https://your-project.vercel.app
  ```

- [ ] Add deployment badge to README (optional)
  ```markdown
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Coldaine/interactive-viz-framework)
  ```

- [ ] Update CHANGELOG.md (if exists)
  ```markdown
  ## [1.0.0] - 2025-11-10
  ### Added
  - Initial production deployment to Vercel
  - CI/CD pipeline with GitHub Actions
  ```

## Ongoing Maintenance

### Weekly

- [ ] Check Vercel deployment status
- [ ] Review GitHub Actions workflow runs
- [ ] Monitor analytics (if enabled)

### Monthly

- [ ] Update dependencies
  ```bash
  npm outdated
  npm update
  npm test
  npm run build
  ```

- [ ] Review and merge Dependabot PRs
- [ ] Check bundle size trends
- [ ] Audit security
  ```bash
  npm audit
  ```

### Quarterly

- [ ] Review CI/CD performance
- [ ] Optimize bundle size
- [ ] Update Node.js version (if needed)
- [ ] Review and update documentation

## Troubleshooting

### Deployment Failed

- [ ] Check Vercel build logs
  - Go to: Deployment > Build Logs
  - Look for error messages

- [ ] Verify locally
  ```bash
  npm ci  # Clean install
  npm test
  npm run build
  ```

- [ ] Check `vercel.json` configuration
  - Validate JSON syntax
  - Verify paths are correct

### Tests Failing in CI

- [ ] Run tests in CI mode locally
  ```bash
  npm test -- --run
  ```

- [ ] Check for environment differences
  - Timezone issues
  - Missing environment variables
  - File system case sensitivity

- [ ] Review GitHub Actions logs
  - Go to: Actions > Failed run > Job > Step logs

### Build Succeeds but App Broken

- [ ] Check browser console
  - Press F12
  - Look for JavaScript errors
  - Check Network tab for 404s

- [ ] Verify base path in `vite.config.ts`
  ```typescript
  base: '/'  // Should be '/' for root deployment
  ```

- [ ] Test production build locally
  ```bash
  npm run build
  npm run preview
  ```

## Success Criteria

✅ Deployment is successful when:

1. Production URL is accessible
2. All tests pass in CI
3. Build completes without errors
4. No console errors in production
5. All features working as expected
6. Mobile responsive
7. Load time < 3 seconds
8. Bundle size < 250 KB (gzipped)

## Next Steps After Deployment

1. Share production URL with team/users
2. Set up monitoring and analytics
3. Plan next features (see ROADMAP.md)
4. Continue development with confidence!

---

**Need Help?**

- **Vercel Docs:** https://vercel.com/docs
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Troubleshooting:** See DEPLOYMENT.md
- **Quick Reference:** See .github/CICD_REFERENCE.md

---

**Last Updated:** 2025-11-10
