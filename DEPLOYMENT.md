# Deployment Guide

Complete guide for deploying TaskFlow to various environments.

## Table of Contents

- [GitHub Pages (Production)](#github-pages-production)
- [Storybook Deployment](#storybook-deployment)
- [Preview Deployments](#preview-deployments)
- [Release Process](#release-process)
- [Performance Monitoring](#performance-monitoring)
- [Troubleshooting](#troubleshooting)

---

## GitHub Pages (Production)

### Automatic Deployment

Pushes to `main` branch automatically deploy to GitHub Pages.

**Workflow:** `.github/workflows/deploy.yml`

**URL:** `https://your-username.github.io/taskflow-svelte/`

### Manual Deployment

```bash
# Trigger manual deployment
gh workflow run deploy.yml
```

### Setup

1. **Enable GitHub Pages:**
   ```
   Settings → Pages → Source: GitHub Actions
   ```

2. **Configure Base URL:**
   Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
   });
   ```

3. **Update workflow:**
   Edit `.github/workflows/deploy.yml`:
   ```yaml
   env:
     BASE_URL: /your-repo-name/
   ```

---

## Storybook Deployment

### Separate Storybook Site

Deploy Storybook to its own GitHub Pages environment.

**Workflow:** `.github/workflows/storybook-deploy.yml`

**URL:** `https://your-username.github.io/taskflow-svelte/storybook/`

### Manual Build

```bash
# Build Storybook locally
pnpm build-storybook

# Serve locally
npx serve storybook-static
```

---

## Preview Deployments

### PR Previews

Every PR gets a preview build automatically.

**Workflow:** `.github/workflows/preview-deploy.yml`

**Features:**
- ✅ Builds on every PR update
- ✅ Artifacts available for 7 days
- ✅ Automatic PR comment with instructions
- ✅ Includes both app and Storybook

### Testing PR Previews

1. Go to PR → Actions tab
2. Download `preview-{pr-number}` artifact
3. Extract and serve locally:
   ```bash
   npx serve dist
   npx serve storybook-static
   ```

---

## Release Process

### Creating a Release

1. **Update version:**
   ```bash
   # Update package.json version
   npm version patch  # or minor, major
   ```

2. **Create and push tag:**
   ```bash
   git push origin main
   git push origin v1.0.0
   ```

3. **Automatic release:**
   - Workflow creates GitHub Release
   - Builds and attaches artifacts
   - Generates changelog from commits

**Workflow:** `.github/workflows/release.yml`

### Release Assets

Each release includes:
- `taskflow-app-v*.zip` - Production build
- `taskflow-storybook-v*.zip` - Storybook docs
- Automatic changelog
- Links to deployments

### Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0) - Breaking changes
- **MINOR** (0.1.0) - New features
- **PATCH** (0.0.1) - Bug fixes

---

## Performance Monitoring

### Lighthouse CI

Automatic performance audits on every PR and push.

**Workflow:** `.github/workflows/lighthouse.yml`

**Metrics:**
- Performance score (target: 90+)
- Accessibility score (target: 90+)
- Best practices score (target: 90+)
- SEO score (target: 90+)

### View Results

1. Go to Actions → Lighthouse CI
2. Click on run
3. View uploaded reports

### Local Lighthouse

```bash
# Build and preview
pnpm build
pnpm preview

# Run Lighthouse (in another terminal)
npx lighthouse http://localhost:4173 --view
```

---

## Environment Variables

### Production

Set in `.github/workflows/deploy.yml`:

```yaml
env:
  BASE_URL: /taskflow-svelte/
  NODE_ENV: production
```

### Local Development

Create `.env.local`:

```bash
VITE_API_URL=http://localhost:3000
VITE_ENABLE_MOCK=true
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`, `pnpm lint:css`)
- [ ] Type checking passes (`pnpm check`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Storybook builds (`pnpm build-storybook`)
- [ ] Lighthouse scores meet targets
- [ ] No console errors in production build
- [ ] All features tested manually
- [ ] Documentation updated
- [ ] Changelog updated

---

## Troubleshooting

### Deployment Fails

**Issue:** GitHub Pages deployment fails

**Solutions:**
1. Check Pages is enabled in Settings
2. Verify workflow permissions
3. Check base URL configuration
4. Review deployment logs in Actions

### Build Fails in CI

**Issue:** Build works locally but fails in CI

**Solutions:**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Test build
pnpm build

# Check for environment-specific issues
NODE_ENV=production pnpm build
```

### Lighthouse Scores Low

**Issue:** Performance scores below target

**Solutions:**
1. Optimize images (use WebP, lazy loading)
2. Code splitting (dynamic imports)
3. Remove unused dependencies
4. Enable compression
5. Optimize fonts

### Preview Build Not Working

**Issue:** PR preview artifacts don't work

**Solutions:**
1. Check artifact was uploaded
2. Verify base URL is correct
3. Extract entire archive
4. Serve from correct directory

---

## Advanced Deployment

### Custom Domain

1. **Add CNAME file:**
   ```bash
   echo "your-domain.com" > public/CNAME
   ```

2. **Configure DNS:**
   ```
   Type: CNAME
   Name: www
   Value: your-username.github.io
   ```

3. **Enable HTTPS:**
   Settings → Pages → Enforce HTTPS

### Multiple Environments

Create separate workflows for staging:

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches: [develop]

env:
  BASE_URL: /taskflow-staging/
```

### CDN Integration

Use Cloudflare or similar:

1. Point DNS to GitHub Pages
2. Enable Cloudflare proxy
3. Configure caching rules
4. Enable auto-minify

---

## Monitoring

### GitHub Actions Status

Monitor workflow runs:
```bash
gh run list --workflow=deploy.yml
gh run view <run-id>
```

### Deployment Status

Check deployment status:
```bash
gh api repos/:owner/:repo/pages/builds/latest
```

### Performance Tracking

Track Lighthouse scores over time:
- Use Lighthouse CI server
- Store results in database
- Create dashboards

---

## Resources

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Lighthouse CI Docs](https://github.com/GoogleChrome/lighthouse-ci)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Storybook Deployment](https://storybook.js.org/docs/react/sharing/publish-storybook)
