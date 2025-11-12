# CI/CD Documentation

This document explains the Continuous Integration and Continuous Deployment setup for TaskFlow.

## Overview

The project uses **GitHub Actions** for CI/CD with the following workflows:

1. **CI Workflow** - Runs on every push and PR
2. **Deploy Workflow** - Deploys to GitHub Pages on main branch
3. **Dependabot** - Automated dependency updates

---

## CI Workflow (`.github/workflows/ci.yml`)

### Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Jobs

#### 1. **Lint** 
Checks code quality and style.

```bash
- ESLint (JavaScript/TypeScript)
- Stylelint (CSS)
- TypeScript type checking
```

**Runs:** `pnpm lint`, `pnpm lint:css`, `pnpm check`

#### 2. **Test**
Runs all tests with coverage.

```bash
- Unit tests (Vitest)
- Component tests (Testing Library)
- Storybook tests (Playwright)
```

**Runs:** `pnpm test`

**Outputs:** Coverage reports uploaded to Codecov

#### 3. **Build**
Builds the production application.

```bash
- Vite production build
- Optimized and minified
```

**Runs:** `pnpm build`

**Outputs:** Build artifacts (`dist/`) uploaded for 7 days

#### 4. **Storybook**
Builds Storybook static site.

```bash
- Storybook static build
- Component documentation
```

**Runs:** `pnpm build-storybook`

**Outputs:** Storybook artifacts (`storybook-static/`) uploaded for 7 days

#### 5. **CI Success**
Summary job that ensures all jobs passed.

---

## Deploy Workflow (`.github/workflows/deploy.yml`)

### Triggers

- Push to `main` branch
- Manual trigger (`workflow_dispatch`)

### Process

1. **Build** - Builds the application for production
2. **Deploy** - Deploys to GitHub Pages

### Setup Required

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: GitHub Actions

2. **Configure Base URL (if needed):**
   ```yaml
   env:
     BASE_URL: /your-repo-name/
   ```

3. **Permissions:**
   - Workflow has `pages: write` permission
   - Automatically configured

---

## Dependabot (`.github/dependabot.yml`)

### Features

- **Weekly updates** every Monday at 9 AM
- **Grouped updates** for related packages
- **Auto-labeling** for easy filtering
- **Conventional commits** (chore: prefix)

### Update Groups

| Group | Packages |
|-------|----------|
| **storybook** | @storybook/*, storybook |
| **testing** | @testing-library/*, @vitest/*, vitest, playwright |
| **eslint** | eslint*, @typescript-eslint/* |
| **stylelint** | stylelint*, @stylistic/* |
| **typescript** | typescript, tslib, @types/* |

### Configuration

Edit `.github/dependabot.yml` to:
- Change update frequency
- Add/remove groups
- Modify reviewers
- Adjust PR limits

---

## Pull Request Template

Located at `.github/pull_request_template.md`

### Sections

- Description
- Type of change
- Related issues
- Changes made
- Screenshots
- Checklist
- Testing notes

### Usage

Template automatically appears when creating a PR.

---

## Issue Templates

### Bug Report (`.github/ISSUE_TEMPLATE/bug_report.md`)

For reporting bugs with:
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots

### Feature Request (`.github/ISSUE_TEMPLATE/feature_request.md`)

For suggesting features with:
- Problem statement
- Proposed solution
- Benefits and drawbacks
- Implementation ideas

---

## Status Badges

Add these to your README.md:

```markdown
![CI](https://github.com/username/repo/workflows/CI/badge.svg)
![Deploy](https://github.com/username/repo/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
```

---

## Local Testing

Test CI steps locally before pushing:

```bash
# Lint
pnpm lint
pnpm lint:css
pnpm check

# Test
pnpm test

# Build
pnpm build
pnpm build-storybook
```

---

## Troubleshooting

### CI Failing on Lint

**Issue:** ESLint or Stylelint errors

**Solution:**
```bash
pnpm lint:fix
pnpm lint:css:fix
git add .
git commit -m "fix: lint errors"
```

### CI Failing on Tests

**Issue:** Tests failing in CI but passing locally

**Possible causes:**
- Missing Playwright browsers
- Environment differences
- Timing issues

**Solution:**
```bash
# Install Playwright locally
npx playwright install --with-deps chromium

# Run tests in CI mode
CI=true pnpm test
```

### CI Failing on Build

**Issue:** Build errors in CI

**Solution:**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Test build locally
pnpm build
```

### Deploy Failing

**Issue:** GitHub Pages deployment fails

**Solutions:**
1. Check Pages is enabled in Settings
2. Verify permissions in workflow file
3. Check base URL configuration
4. Review deployment logs

---

## Performance Optimization

### Caching

The workflows use caching for:
- ✅ pnpm dependencies (`cache: 'pnpm'`)
- ✅ Playwright browsers (installed once)

### Concurrency

- ✅ Cancels in-progress runs for same branch
- ✅ Parallel job execution
- ✅ Only one deployment at a time

### Artifacts

- ✅ Build artifacts retained for 7 days
- ✅ Storybook artifacts retained for 7 days
- ✅ Coverage reports uploaded to Codecov

---

## Security

### Secrets

Required secrets (add in Settings → Secrets):

| Secret | Purpose | Required |
|--------|---------|----------|
| `CODECOV_TOKEN` | Upload coverage | Optional |
| `GITHUB_TOKEN` | Automatic | Auto-provided |

### Permissions

Workflows use minimal permissions:
- `contents: read` - Read repository
- `pages: write` - Deploy to Pages
- `id-token: write` - OIDC token

---

## Best Practices

✅ **Always run locally first** - Test before pushing  
✅ **Keep workflows fast** - Use caching and parallelization  
✅ **Monitor failures** - Fix broken builds quickly  
✅ **Update dependencies** - Review Dependabot PRs regularly  
✅ **Use status checks** - Require CI to pass before merging  
✅ **Document changes** - Update this doc when modifying workflows  

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Codecov Documentation](https://docs.codecov.com/)
