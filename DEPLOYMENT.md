# Deployment Guide - Nomad Treasures

## GitHub Pages Deployment

GitHub Pages works best with **custom domains**. Static hosting with SPA routing on GitHub Pages subpaths (like `github.com/username/repo`) has limitations.

### Prerequisites
- GitHub repository (public or private with Pages enabled)
- Custom domain (recommended) or GitHub Pages domain

### Deploy with GitHub Actions

1. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main (or your default branch)
   - Folder: / (root)

2. **Workflow automatically runs:**
   - The `.github/workflows/github-pages.yml` workflow triggers on push to main
   - Builds the app and deploys to GitHub Pages automatically

3. **Verify deployment:**
   - Check Actions tab to see workflow status
   - Your site will be available at `https://yourusername.github.io`

### Custom Domain Setup

1. **Add custom domain to Pages settings:**
   - Settings → Pages
   - Custom domain: enter your domain (e.g., nomadtreasures.com)

2. **Configure DNS records:**
   - For apex domain: Add A records pointing to GitHub's IP addresses
   - For subdomain: Add CNAME record pointing to your GitHub Pages URL

3. **Enable HTTPS:**
   - GitHub Pages automatically provisions SSL certificate

### Troubleshooting GitHub Pages

**Issue:** Routes don't work when deployed
- **Solution:** GitHub Pages serves the `public/404.html` for undefined routes, which redirects to index.html for SPA routing

**Issue:** Assets not loading
- **Solution:** Check that build output is in `dist/spa` and `.github/workflows/github-pages.yml` points to correct path

## Netlify Deployment

Netlify is ideal for SPA applications and handles routing automatically.

### Deploy from Git

1. **Connect repository:**
   - Visit https://app.netlify.com/signup
   - Choose "Connect to Git"
   - Authorize GitHub and select your repository

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist/spa`

3. **Add environment variables:**
   - Go to Site settings → Build & deploy → Environment
   - Add any environment variables from `.env.example`

4. **Deploy:**
   - Click "Deploy site"
   - Netlify automatically deploys on every push to main

### Custom Domain on Netlify

1. Site settings → Domain management
2. Add custom domain
3. Update DNS records with Netlify's nameservers
4. HTTPS automatically enabled

## Docker Deployment

For self-hosted or cloud deployments.

### Build Docker Image

```bash
docker build -t nomad-treasures:latest .
```

### Run Container

```bash
docker run -d \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e DATABASE_URL=your-database-url \
  nomad-treasures:latest
```

### Docker Compose

```bash
docker-compose up -d
```

## Traditional Server Deployment

For VPS, dedicated servers, or cloud VMs.

### Build for Production

```bash
npm run build
npm install -g pm2
```

### Start with PM2

```bash
pm2 start dist/server/node-build.mjs --name "nomad-treasures" --instances max --exec-mode cluster
pm2 save
pm2 startup
```

### Reverse Proxy with Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment Variables

Create `.env` file on server:

```env
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@host:5432/nomad_treasures
JWT_SECRET=your-secret-key
```

## AWS Deployment

### Using AWS Amplify (Easiest)

1. **Connect repository:**
   - AWS Amplify Console → Create app
   - Connect GitHub repository
   - Select main branch

2. **Build settings automatically detected**
   - Amplify uses `npm run build` and serves from `dist/spa`

3. **Custom domain and SSL included**

### Using S3 + CloudFront (Cost-effective)

1. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://nomad-treasures-bucket
   ```

2. **Upload build:**
   ```bash
   aws s3 sync dist/spa/ s3://nomad-treasures-bucket/ --delete
   ```

3. **Create CloudFront distribution:**
   - Origin: S3 bucket
   - Default root object: index.html
   - Custom error page: 404.html → index.html

4. **Set HTTPS and custom domain**

## Vercel Deployment

Vercel is optimized for Next.js but works great with Vite SPAs.

1. **Connect repository:**
   - Vercel.com → Import Project
   - Select GitHub repository

2. **Configure build:**
   - Framework: Create React App (Vite)
   - Build Command: `npm run build`
   - Output Directory: `dist/spa`

3. **Deploy:**
   - Click Deploy
   - Automatic deployments on push

## Environment Variables for Different Platforms

### GitHub Pages / Static Hosting
- Only frontend environment variables needed
- No backend environment variables

### Node.js Hosting (Netlify Functions, Vercel, AWS)
- Frontend environment variables (`.env` file)
- Backend environment variables (platform secrets)

### Example Environment Setup

Create `.env` file:
```env
NODE_ENV=production
VITE_API_URL=https://api.yourdomain.com
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

## SSL/HTTPS

All major platforms provide free SSL:
- **GitHub Pages:** Automatic
- **Netlify:** Automatic
- **Vercel:** Automatic
- **AWS:** AWS Certificate Manager (free)
- **Traditional Server:** Let's Encrypt (free with Certbot)

## Database Setup

### PostgreSQL

For production, connect to a PostgreSQL database:

1. **Create database:**
   ```sql
   CREATE DATABASE nomad_treasures;
   ```

2. **Run schema:**
   ```bash
   psql nomad_treasures < server/sql/nomad_treasures_postgres.sql
   ```

3. **Configure connection:**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/nomad_treasures
   ```

### Managed Services

- **AWS RDS:** Managed PostgreSQL
- **Heroku Postgres:** Simple managed database
- **Railway:** Modern PostgreSQL hosting
- **Neon:** Serverless PostgreSQL

## CI/CD Best Practices

1. **Test before deploy:**
   - Run tests in CI pipeline
   - Type checking with TypeScript
   - Lint and format checks

2. **Automatic deployments:**
   - Push to main → Automatic deployment
   - Separate staging/production

3. **Monitor deployments:**
   - Check workflow status
   - Monitor application logs
   - Set up error tracking (Sentry)

## Rollback

If deployment fails:

1. **GitHub Pages:** Previous builds stored as artifacts
2. **Netlify:** Instant rollback from deployment history
3. **Vercel:** Rollback to previous deployment
4. **Traditional server:** Git revert and redeploy

## Performance Optimization

1. **Build output:**
   - Vite creates optimized bundles in `dist/spa`
   - Code splitting by routes
   - CSS purging with TailwindCSS

2. **CDN/Caching:**
   - GitHub Pages/Netlify/Vercel use global CDN
   - Cache static assets aggressively
   - Invalidate cache on new builds

3. **Monitoring:**
   - Set up error tracking (Sentry)
   - Monitor performance (Datadog, New Relic)
   - Track user analytics

## Support & Troubleshooting

- **GitHub Pages:** https://docs.github.com/en/pages
- **Netlify:** https://docs.netlify.com
- **Vercel:** https://vercel.com/docs
- **AWS:** https://docs.aws.amazon.com
