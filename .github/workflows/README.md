# GitHub Actions Workflows

This directory contains CI/CD workflows for the Task Manager application.

## Workflows

### 1. `ci.yml` - Continuous Integration

Runs on every push and pull request to main/master/develop branches.

**Jobs:**

- **lint-and-test**: Runs ESLint, Prettier checks, and tests
- **build**: Builds the application and uploads artifacts

### 2. `cd.yml` - Continuous Deployment

Runs on pushes to main/master branches.

**Features:**

- Builds the production application
- Deploys to GitHub Pages by default
- Includes commented alternatives for Vercel and Netlify

### 3. `full-ci-cd.yml` - Complete Pipeline

Combines CI and CD in a single workflow with dependency management.

## Setup Instructions

### For GitHub Pages Deployment:

1. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. The workflow will automatically deploy on push to main/master.

### For Vercel Deployment:

1. Get your Vercel tokens from Vercel dashboard
2. Add secrets to GitHub repository:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Uncomment the Vercel deployment step in `cd.yml`

### For Netlify Deployment:

1. Get your Netlify tokens from Netlify dashboard
2. Add secrets to GitHub repository:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
3. Uncomment the Netlify deployment step in `cd.yml`

### For Code Coverage:

1. Sign up at [codecov.io](https://codecov.io)
2. Add your repository
3. Get your token and add it as `CODECOV_TOKEN` secret

## Workflow Triggers

- **Push**: Runs on push to main/master/develop
- **Pull Request**: Runs on PRs to main/master/develop
- **Manual**: Use `workflow_dispatch` to trigger manually

## Environment Variables

No additional environment variables are required for basic setup. The workflows use:

- `NODE_ENV=production` for builds
- GitHub secrets for deployment tokens (if using external services)

## Notes

- All workflows use Node.js 20
- Build artifacts are retained for 7 days
- Test coverage is uploaded to Codecov (optional)
