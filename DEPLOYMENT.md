# Deployment Guide

## Vercel Deployment

This app is configured for Vercel deployment. The app uses TanStack Start with a Node.js serverless function handler.

### Setup

1. **Connect your repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the build configuration

2. **Build Process**:
   - Vercel will run `pnpm build`
   - The build process:
     1. Compiles the TanStack Start app with Vite
     2. Generates a Node.js handler at `api/index.js`
     3. Outputs client assets to `dist/client`
     4. Outputs server assets to `dist/server`

3. **Vercel Configuration**:
   - `vercel.json` contains the deployment configuration
   - All routes are rewrites to `/api` (the serverless function)
   - Static assets are served from `dist/client`

### Key Configuration Files

- **`vercel.json`** - Deployment configuration
  - `publicDirectory`: `dist/client` (static assets)
  - `outputDirectory`: `dist` (build output)
  - Rewrites all routes to `/api`

- **`package.json`** - Build script
  - `build`: `vite build && node scripts/generate-vercel-handler.mjs`
  - Generates the serverless function handler dynamically

- **`scripts/generate-vercel-handler.mjs`** - Handler generator
  - Dynamically generates the Vercel serverless handler
  - Points to the correct worker entry file (hash changes with each build)

### Local Testing

To test locally before deploying:

```bash
# Build the app
pnpm build

# Preview the production build
pnpm preview
```

### Deployment

Simply push to your main branch or trigger a manual deployment from the Vercel dashboard. Vercel will automatically:
1. Build the app using the `buildCommand` in `vercel.json`
2. Deploy the static assets to the CDN
3. Deploy the serverless function to Vercel Functions

### Important Notes

- The `api/` directory is generated during build and should not be committed to git (see `.gitignore`)
- The serverless function handler is automatically regenerated on each build
- All routes are handled by the Node.js serverless function using TanStack Start's routing
- Static assets are cached with long TTL for optimal performance

### Troubleshooting

If you see a 404 error:
1. Check the Vercel deployment logs
2. Ensure `vercel.json` is in the root directory
3. Verify the build completes successfully
4. Check that `api/index.js` is generated during build
5. Ensure rewrites are correctly configured in `vercel.json`
