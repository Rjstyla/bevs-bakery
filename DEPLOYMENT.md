# Vercel + Supabase Deployment Guide

Complete step-by-step guide to deploy Island-Bake to Vercel with Supabase as the database.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Supabase Setup](#step-1-supabase-setup)
3. [Step 2: Local Environment Setup](#step-2-local-environment-setup)
4. [Step 3: Push Database Schema](#step-3-push-database-schema)
5. [Step 4: Vercel Setup](#step-4-vercel-setup)
6. [Step 5: Deploy to Vercel](#step-5-deploy-to-vercel)
7. [Step 6: Post-Deployment](#step-6-post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:

- **GitHub account** - Vercel deploys from GitHub
- **Node.js 18+** - For local development
- **npm or yarn** - Package manager
- **Git** - For version control
- **Command line familiarity** - For running CLI commands

---

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"** or sign in if you have an account
3. Fill in project details:
   - **Organization**: Create or select an existing organization
   - **Project name**: `island-bake` (or your preferred name)
   - **Database password**: Create a strong password and save it securely
   - **Region**: Select closest to your users (e.g., `us-east-1` for US)
4. Click **"Create new project"** and wait 2-3 minutes for setup

### 1.2 Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. You'll see:
   - **Project URL** - Copy this (e.g., `https://xxxxx.supabase.co`)
   - **API Key (anon, public)** - Copy this (safe for client-side)
   - **Service Role Secret** - Copy this (KEEP SECRET - server-only)
3. Go to **Database** → **Connection string** → **URI**
4. Copy the PostgreSQL connection string (looks like: `postgresql://postgres:password@...`)
5. Save all these values safely (use a password manager)

### 1.3 Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase-rebuild.sql` from your project
4. Paste into the SQL editor
5. Click **"Run"** to execute all statements
6. Verify: Go to **Tables** view and confirm you see `users` and `orders` tables

---

## Step 2: Local Environment Setup

### 2.1 Create Local Environment File

1. In your project root directory, create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   DATABASE_URL=postgresql://postgres:password@...
   NODE_ENV=development
   PORT=3000
   VITE_API_URL=http://localhost:3000
   SESSION_SECRET=generate_a_random_string_here_32_chars_min
   ```

### 2.2 Generate Session Secret

Generate a random 32+ character string for `SESSION_SECRET`:

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Maximum 256)}))
```

### 2.3 Test Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. In one terminal, start the server:
   ```bash
   npm run dev
   ```

3. In another terminal, start the client:
   ```bash
   npm run dev:client
   ```

4. Open [http://localhost:5000](http://localhost:5000)

5. Test the order form - it should work with your Supabase database

---

## Step 3: Push Database Schema

If using Drizzle Kit for migrations:

```bash
npm run db:push
```

This ensures your Drizzle schema matches the Supabase database. If you already ran the SQL file in Step 1.3, this should complete without issues.

---

## Step 4: Vercel Setup

### 4.1 Push Code to GitHub

1. Initialize Git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Island Bake app"
   ```

2. Create a new repository on GitHub:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `island-bake`
   - Click **"Create repository"**
   - **DO NOT initialize with README, .gitignore, or license**

3. Push your local code:
   ```bash
   git remote add origin https://github.com/your-username/island-bake.git
   git branch -M main
   git push -u origin main
   ```

### 4.2 Connect Vercel to GitHub

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in or create an account (easiest with GitHub)
3. Click **"New Project"**
4. Find and select your `island-bake` repository
5. Click **"Import"**

### 4.3 Configure Vercel Project

1. **Project name**: Leave as `island-bake` (or customize)

2. **Framework Preset**: Select **Other** (since it's a custom setup with Vite)

3. **Root Directory**: Leave empty (or select `.` if prompted)

4. **Build Command**: Make sure it's `npm run build`

5. **Output Directory**: Make sure it's `dist`

6. **Environment Variables**: Add all the following variables:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `VITE_SUPABASE_URL` | Your Supabase URL | From Step 1.2 |
   | `VITE_SUPABASE_ANON_KEY` | Your anon key | From Step 1.2 |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | From Step 1.2 - KEEP SECRET |
   | `DATABASE_URL` | PostgreSQL connection string | From Step 1.2 |
   | `NODE_ENV` | `production` | |
   | `VITE_API_URL` | Leave empty or remove | Vercel will auto-set to your domain |

7. Click **"Deploy"**

> **Important**: Do NOT commit `.env.local` to GitHub. Make sure `.gitignore` includes `.env*` files.

---

## Step 5: Deploy to Vercel

### 5.1 Initial Deployment

Once you've configured environment variables in Step 4.3, Vercel automatically starts the deployment. You should see:

1. **Building** - Vercel runs `npm run build`
2. **Deploying** - Code is deployed to Vercel's servers
3. **Ready** - Your app is live with a URL like `https://island-bake-xxxxx.vercel.app`

Check the **Deployments** tab to monitor progress.

### 5.2 Troubleshoot Build Errors

If the build fails:

1. Click the failed deployment
2. Go to **Build Logs** tab
3. Look for error messages
4. Common issues:
   - Missing environment variables
   - TypeScript errors (run `npm run check` locally)
   - Missing dependencies (run `npm install` locally)

Fix the issue locally, commit, and push to GitHub - Vercel will automatically redeploy.

### 5.3 Test Your Deployment

1. Visit your Vercel URL (e.g., `https://island-bake-xxxxx.vercel.app`)
2. Navigate through pages:
   - **Home page** - Hero section and products visible
   - **Order form** - Should load and function
   - **Admin page** - Should show orders from Supabase
3. Submit a test order and verify it appears in Supabase

---

## Step 6: Post-Deployment

### 6.1 Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `bevsbakery.com`)
4. Follow Vercel's instructions to update DNS records with your registrar
5. SSL certificate is auto-generated (free with Vercel)

### 6.2 Monitor Your App

1. **Analytics** tab - View traffic, pageviews, response times
2. **Logs** tab - Real-time server and deployment logs
3. **Integrations** - Connect Slack, GitHub, etc. for notifications

### 6.3 Set Up Automatic Deployments

By default, every push to `main` branch automatically triggers a deployment. To customize:

1. **Settings** → **Git**
2. Configure:
   - **Production branch**: `main`
   - **Skipped deploys**: None (or add patterns to skip)
   - **Preview deployments**: Enable (deploy all branches and PRs)

### 6.4 Create Environment Variables for Different Stages

Go to **Settings** → **Environment Variables** to manage variables per stage:

- **Production** - Used on main domain
- **Preview** - Used on preview deployments from PRs
- **Development** - Used locally (use `.env.local`)

You can set different Supabase projects for each stage if needed.

---

## Troubleshooting

### Build Fails with "MODULE_NOT_FOUND"

**Problem**: Vercel can't find a package

**Solution**:
```bash
# Locally:
npm install
npm run build

# If it works locally but not on Vercel, check:
# 1. Are you committing package-lock.json?
git add package-lock.json
git commit -m "Add package-lock.json"
git push

# 2. Force a rebuild on Vercel (Settings → Deployments → Redeploy)
```

### Environment Variables Not Working

**Problem**: `process.env.VITE_SUPABASE_URL` is undefined

**Solution**:
- Client-side variables must start with `VITE_` in Vite projects
- In Vercel, make sure variables are set for Production environment
- Redeploy after adding/changing variables (Deployments tab → Redeploy)

### Database Connection Errors

**Problem**: "Unable to connect to database"

**Solution**:
1. Verify `DATABASE_URL` is set correctly in Vercel
2. Test the connection string locally:
   ```bash
   psql your_connection_string
   ```
3. Check Supabase status: [status.supabase.com](https://status.supabase.com)
4. Restart your Vercel deployment

### CORS Errors

**Problem**: Frontend can't reach backend API

**Solution**:
1. Check that `VITE_API_URL` is set correctly in environment variables
2. For development: `http://localhost:3000`
3. For production: Leave empty (Vercel sets it to your domain automatically)
4. Ensure Express is handling CORS headers (check `server/index.ts`)

### Orders Not Saving

**Problem**: Form submits but orders don't appear in database

**Solution**:
1. Check Supabase **SQL Editor** → **Query** and run:
   ```sql
   SELECT * FROM orders;
   ```
2. Check browser console for API errors (F12 → Network tab)
3. Check Vercel logs for backend errors (Deployments → Logs)
4. Verify `INSERT` permissions on orders table

---

## File Structure for Deployment

Vercel looks for these key files:

```
island-bake/
├── package.json              # Scripts: build, dev, start
├── vite.config.ts            # Build configuration
├── server/                   # Express backend
├── client/                   # React frontend
├── shared/                   # Shared TypeScript
├── tsconfig.json             # TypeScript config
├── .env.example              # Template (don't commit .env)
├── .gitignore                # Should include .env*
├── vercel.json               # Vercel configuration
├── database-schema.sql       # Reference only
└── supabase-rebuild.sql      # Reference only
```

---

## Environment Variables Reference

### Client-Side (Vite)

Must start with `VITE_` prefix to be exposed to frontend:

```
VITE_SUPABASE_URL        - Supabase project URL
VITE_SUPABASE_ANON_KEY   - Supabase anon key (public)
VITE_API_URL             - API endpoint (optional, auto-set on Vercel)
NODE_ENV                 - "production" or "development"
```

### Server-Side (Node.js/Express)

Hidden from client, only available on backend:

```
SUPABASE_SERVICE_ROLE_KEY  - Supabase service role (SECRET)
DATABASE_URL               - PostgreSQL connection string (SECRET)
SESSION_SECRET             - Session encryption key (SECRET)
PORT                       - Server port (default 3000)
NODE_ENV                   - "production" or "development"
```

---

## Security Checklist

- [ ] `.env.local` and `.env*` are in `.gitignore`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT exposed in client code
- [ ] `DATABASE_URL` is NOT committed to Git
- [ ] GitHub repository is private (or sensitive data removed)
- [ ] Vercel environment variables are set (not in code)
- [ ] Supabase project has Row-Level Security (RLS) enabled (optional but recommended)
- [ ] Database backups are enabled in Supabase
- [ ] HTTPS is enforced (Vercel handles this by default)

---

## Next Steps

After successful deployment:

1. **Test thoroughly** - Submit orders, check admin dashboard, verify emails work
2. **Set up logging** - Monitor errors in Vercel Logs tab
3. **Add authentication** - Implement user login for admin panel
4. **Process payments** - Integrate Stripe or similar
5. **Email notifications** - Send order confirmations
6. **Analytics** - Track orders and revenue
7. **Custom domain** - Set up your bakery's domain

---

## Support & Resources

- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Drizzle ORM**: [https://orm.drizzle.team](https://orm.drizzle.team)
- **Vite Docs**: [https://vitejs.dev](https://vitejs.dev)
- **Express Docs**: [https://expressjs.com](https://expressjs.com)

---

**Last Updated**: December 18, 2025

**Project**: Island-Bake (Bev's Bakery Web App)
