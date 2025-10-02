# Vercel Deployment Guide

## Prerequisites
- GitHub repository connected to Vercel
- Backend API deployed and accessible

## Environment Variables

Set the following environment variables in your Vercel dashboard:

### Required Variables
- `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend-api.vercel.app`)

### Setting Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `VITE_API_URL` with your production API URL

## Deployment Steps

### Automatic Deployment
1. Push your code to the main branch
2. Vercel will automatically build and deploy

### Manual Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`

## Build Configuration

The project is configured with:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18.x

## Important Notes

1. **API Configuration**: Update `VITE_API_URL` in your environment variables to point to your production backend
2. **SPA Routing**: The app uses client-side routing with rewrites configured for all routes
3. **Build Optimization**: Consider code splitting for better performance (current bundle is ~900KB)

## Troubleshooting

### Common Issues
1. **Build Failures**: Check that all dependencies are in `package.json`
2. **API Errors**: Verify `VITE_API_URL` is set correctly
3. **Routing Issues**: Ensure `vercel.json` rewrites are configured

### Performance Optimization
- The build shows a warning about large chunks (>500KB)
- Consider implementing code splitting for better loading times
- Use dynamic imports for heavy components

## Local Testing
```bash
npm run build
npm run preview
```

This will build and serve the production version locally for testing.