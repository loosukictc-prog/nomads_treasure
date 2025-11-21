# Troubleshooting Guide

Common issues and solutions for Nomad Treasures development and deployment.

## Development Issues

### Dev Server Won't Start

**Problem:** `npm run dev` fails or dev server crashes

**Solutions:**

1. **Clear cache and reinstall:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **Check port availability:**

   ```bash
   # Check if ports 5173 (frontend) or 8080 (backend) are in use
   lsof -i :5173
   lsof -i :8080
   ```

3. **Kill existing processes:**

   ```bash
   # On macOS/Linux
   pkill -f "vite\|tsx"

   # On Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

4. **Check TypeScript errors:**
   ```bash
   npm run typecheck
   ```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE :::5173`

**Solutions:**

```bash
# Change Vite port in package.json:
"dev:client": "vite --port 3000"

# Or kill the process using the port:
# On macOS/Linux
lsof -ti:5173 | xargs kill -9

# On Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Module Not Found Errors

**Problem:** `Cannot find module '@/components/...'`

**Solutions:**

1. **Check path aliases in `vite.config.ts`:**

   ```typescript
   resolve: {
     alias: {
       "@": path.resolve(__dirname, "./client"),
       "@shared": path.resolve(__dirname, "./shared"),
     },
   }
   ```

2. **Verify file exists** - Check spelling and case sensitivity

3. **Restart dev server** - Changes to vite.config.ts require restart

### TypeScript Errors

**Problem:** Type errors during build or development

**Solutions:**

```bash
# Check all TypeScript errors
npm run typecheck

# Fix common issues
npm run format.fix

# Clear TypeScript cache
rm -rf dist/
npm run typecheck
```

## API Issues

### API Calls Return 401 (Unauthorized)

**Problem:** Admin endpoints fail with "Invalid or expired token"

**Solutions:**

1. **Check authentication:**

   ```bash
   # Test login endpoint
   curl -X POST http://localhost:8080/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@nomadtreasures.com","password":"admin123"}'
   ```

2. **Verify token is stored:**

   - Open browser DevTools → Application/Storage
   - Check localStorage for `auth_token`

3. **Check token expiry:**

   - Tokens expire after 24 hours
   - Log out and log back in

4. **Verify Authorization header:**
   - Network tab should show: `Authorization: Bearer <token>`

### API Endpoint Not Found

**Problem:** `GET /api/something` returns 404

**Solutions:**

1. **Check endpoint is registered in `server/index.ts`:**

   ```typescript
   app.get("/api/endpoint", requireAdminAuth, handler);
   ```

2. **Verify route path matches:**

   - Check for typos
   - Note: routes are case-sensitive in production

3. **Test with curl:**
   ```bash
   curl -X GET http://localhost:8080/api/health
   ```

### CORS Errors

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**

1. **Check CORS configuration in `server/index.ts`:**

   ```typescript
   cors({
     origin: true,
     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allowedHeaders: ["Content-Type", "Authorization"],
     credentials: true,
   });
   ```

2. **For development with custom domain:**

   ```typescript
   cors({
     origin: "https://yourdomain.com",
     credentials: true,
   });
   ```

3. **Check Content-Type header:**
   - Should be `application/json` for JSON payloads

## Frontend Issues

### Blank Page or 404

**Problem:** App loads but shows "Page not found"

**Solutions:**

1. **Check routing in `client/App.tsx`:**

   ```bash
   # Verify route exists
   grep -n "path=\"/your-route\"" client/App.tsx
   ```

2. **Clear browser cache:**

   - DevTools → Application → Clear storage
   - Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)

3. **Check component imports:**
   - Verify all page components are imported
   - Check spelling matches

### Styles Not Loading

**Problem:** TailwindCSS classes not applied

**Solutions:**

1. **Check TailwindCSS configuration:**

   ```bash
   # Verify content paths in tailwind.config.ts
   content: ["./index.html", "./client/**/*.{ts,tsx}"]
   ```

2. **Rebuild CSS:**

   ```bash
   npm run dev
   # TailwindCSS rebuilds automatically
   ```

3. **Check class names:**
   - Verify spelling (no typos in utility classes)
   - Use only standard Tailwind classes
   - Custom colors must be in config

### Login Page Not Working

**Problem:** Admin login fails or doesn't redirect

**Solutions:**

1. **Check demo credentials:**

   - Email: `admin@nomadtreasures.com`
   - Password: `admin123`
   - (Change in production!)

2. **Verify API is running:**

   ```bash
   curl http://localhost:8080/api/health
   ```

3. **Check console for errors:**

   - DevTools → Console tab
   - Look for error messages

4. **Clear localStorage:**
   ```javascript
   localStorage.clear();
   ```

## Database Issues

### Database Connection Failed

**Problem:** `Error: connect ECONNREFUSED` when using database

**Solutions:**

1. **Check DATABASE_URL in `.env`:**

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/nomad_treasures
   ```

2. **Verify PostgreSQL is running:**

   ```bash
   # macOS with Homebrew
   brew services list
   brew services start postgresql

   # Linux
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

3. **Test connection:**

   ```bash
   psql postgresql://user:password@localhost:5432/nomad_treasures
   ```

4. **Check credentials:**
   - Username and password are correct
   - Database exists
   - User has proper permissions

### Database Schema Not Found

**Problem:** Tables don't exist when connecting to database

**Solutions:**

1. **Run schema setup:**

   ```bash
   psql nomad_treasures < server/sql/nomad_treasures_postgres.sql
   ```

2. **Verify tables exist:**

   ```bash
   psql nomad_treasures -c "\dt"
   ```

3. **Check database name:**
   ```bash
   psql -l
   ```

## Build Issues

### Build Fails with TypeScript Errors

**Problem:** `npm run build` fails

**Solutions:**

```bash
# Check all type errors first
npm run typecheck

# Fix common formatting issues
npm run format.fix

# Build with verbose output
npm run build -- --debug
```

### Build Output Empty

**Problem:** `dist/` folder is empty or missing files

**Solutions:**

1. **Verify build output directories:**

   ```bash
   ls -la dist/
   # Should contain: spa/ and server/
   ```

2. **Check vite.config.ts:**

   - Verify `outDir: "dist/spa"` for client build
   - Verify server build uses correct config

3. **Clean build:**
   ```bash
   rm -rf dist/
   npm run build
   ```

## Deployment Issues

### GitHub Pages Shows 404

**Problem:** Site deployed but routes don't work

**Solutions:**

1. **Verify `public/404.html` exists:**

   ```bash
   cat public/404.html
   ```

2. **Check GitHub Pages settings:**

   - Settings → Pages
   - Source: GitHub Actions
   - Branch: main

3. **Verify workflow completed:**

   - Go to Actions tab
   - Check "Deploy to GitHub Pages" workflow
   - All steps should be green

4. **Clear browser cache:**
   - Hard refresh or use private/incognito window

### Netlify Deployment Fails

**Problem:** Build fails during Netlify deployment

**Solutions:**

1. **Check build settings:**

   - Build command: `npm run build`
   - Publish directory: `dist/spa`

2. **Verify environment variables:**

   - Site settings → Build & deploy → Environment
   - All required variables are set

3. **Check logs:**

   - Deployments tab → View logs
   - Look for specific error messages

4. **Test locally:**
   ```bash
   npm run build
   npm start
   ```

## Performance Issues

### App Loads Slowly

**Problem:** Poor performance or slow page loads

**Solutions:**

1. **Check bundle size:**

   ```bash
   npm run build
   # Look at dist/spa/ file sizes
   ```

2. **Enable code splitting:**

   - Already configured in vite.config.ts
   - Verify `manualChunks` configuration

3. **Optimize images:**

   - Use appropriate formats (WebP, AVIF)
   - Compress images before adding
   - Use lazy loading for images

4. **Monitor API performance:**
   - DevTools → Network tab
   - Check API response times
   - Optimize slow endpoints

### High Memory Usage

**Problem:** Dev server uses lots of memory

**Solutions:**

1. **Restart dev server:**

   ```bash
   # Kill and restart
   npm run dev
   ```

2. **Check for memory leaks:**

   - DevTools → Memory
   - Take heap snapshot
   - Look for retained objects

3. **Reduce project scope:**
   - Temporarily remove large dependencies
   - Isolate problematic pages

## Testing Issues

### Tests Won't Run

**Problem:** `npm test` fails or hangs

**Solutions:**

```bash
# Update snapshots if needed
npm test -- --update

# Run specific test file
npm test -- components/Button.spec.tsx

# Clear test cache
rm -rf node_modules/.vitest
npm test
```

## Getting Help

If you can't find a solution:

1. **Check documentation:**

   - [README.md](README.md)
   - [DEPLOYMENT.md](DEPLOYMENT.md)
   - [CONTRIBUTING.md](CONTRIBUTING.md)

2. **Search existing issues:**

   - GitHub Issues tab
   - Use keywords from your error

3. **Create a new issue:**

   - Include error messages
   - Steps to reproduce
   - Environment information (OS, Node version, etc.)

4. **For security issues:**
   - See [SECURITY.md](SECURITY.md)
   - Email: security@nomadtreasures.com

---

**Last Updated:** 2024
