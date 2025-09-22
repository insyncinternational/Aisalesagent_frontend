# Deployment Guide

This guide covers how to deploy the AI Voice Caller Frontend to various platforms.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended)

**One-click deployment:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/ai-voice-caller-frontend)

**Manual deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

**Environment Variables for Vercel:**
- `VITE_API_URL`: Your backend API URL
- `VITE_APP_NAME`: Application name
- `VITE_DEFAULT_LANGUAGE`: Default language (en, tr, az, ar)
- `VITE_DEFAULT_CURRENCY`: Default currency (USD, TRY, AZN, AED)

### 2. Netlify

**One-click deployment:**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-org/ai-voice-caller-frontend)

**Manual deployment:**
```bash
# Build the project
npm run build

# Upload dist folder to Netlify
# Or connect your Git repository
```

**Netlify Configuration:**
Create `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

### 4. AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 5. Docker Deployment

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

**Build and run:**
```bash
docker build -t ai-voice-caller-frontend .
docker run -p 80:80 ai-voice-caller-frontend
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# API Configuration
VITE_API_URL=https://your-api-domain.com

# Application Settings
VITE_APP_NAME=AI Voice Caller
VITE_DEFAULT_LANGUAGE=en
VITE_DEFAULT_CURRENCY=USD
```

### Optional Environment Variables

```env
# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT_BOT=true
VITE_ENABLE_EXIT_INTENT=true

# External Services
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_HOTJAR_ID=HOTJAR_ID

# CDN Configuration
VITE_CDN_URL=https://cdn.your-domain.com
```

## 📱 Mobile App Deployment

### PWA Configuration

The app is configured as a Progressive Web App (PWA):

```json
// public/manifest.json
{
  "name": "AI Voice Caller",
  "short_name": "AI Voice Caller",
  "description": "AI-powered voice calling system",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8B5CF6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### App Store Deployment

For mobile app stores, consider using:
- **Capacitor**: Convert web app to native mobile app
- **Cordova**: Hybrid mobile app development
- **React Native**: Native mobile app development

## 🔒 Security Considerations

### Content Security Policy (CSP)

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://your-api-domain.com;
">
```

### HTTPS Configuration

- Always use HTTPS in production
- Configure SSL certificates
- Enable HSTS headers
- Use secure cookies

## 📊 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Optimize images
# Use WebP format
# Implement lazy loading
```

### CDN Configuration

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
})
```

## 🔍 Monitoring and Analytics

### Error Tracking

```javascript
// Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

```javascript
// Add to main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🚨 Troubleshooting

### Common Issues

1. **Build fails with memory error:**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

2. **API calls fail in production:**
   - Check CORS configuration
   - Verify API URL in environment variables
   - Check network connectivity

3. **Translations not loading:**
   - Verify translation files are included in build
   - Check i18n configuration
   - Ensure language files are properly formatted

4. **Styling issues:**
   - Check Tailwind CSS configuration
   - Verify PostCSS setup
   - Ensure all CSS files are imported

### Debug Mode

```bash
# Enable debug mode
VITE_DEBUG_MODE=true npm run dev

# Check console for debug information
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review the logs
3. Contact the development team
4. Open an issue on GitHub

---

**Happy Deploying! 🚀**
