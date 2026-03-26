# AMPLIFI.AI Deployment Guide

## Deploying to Vercel

This guide walks you through deploying AMPLIFI.AI to Vercel using GitHub.

---

## Prerequisites

Before you begin, ensure you have:
- ✅ A GitHub account (https://github.com)
- ✅ A Vercel account (https://vercel.com) - you can sign up with GitHub
- ✅ Supabase project set up with API credentials
- ✅ Git installed locally
- ✅ All code pushed and committed locally

---

## Step 1: Push Your Code to GitHub

### 1a. Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `amplifi-ai`
3. **Do NOT** initialize with README, .gitignore, or license (we have these)
4. Click "Create repository"
5. Copy the repository URL from the page

### 1b. Initialize Git Locally and Push Code

Run these commands in your project root (`d:\Pursuit\week2\AmlifiAI`):

```bash
# Initialize git (if not already done)
git init

# Add remote origin with your GitHub repo URL
git remote add origin https://github.com/YOUR_USERNAME/amplifi-ai.git

# Rename branch to main (GitHub default)
git branch -M main

# Stage all files
git add .

# Commit your code
git commit -m "Initial commit: AMPLIFI.AI neighborhood platform"

# Push to GitHub
git push -u origin main
```

### 1c. Verify on GitHub

- Visit https://github.com/YOUR_USERNAME/amplifi-ai
- You should see all your code files pushed

---

## Step 2: Connect Repository to Vercel

### 2a. Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. You'll be redirected to the Vercel dashboard

### 2b. Import Your Repository

1. On Vercel dashboard, click "New Project" or "Add New..." button
2. Under "Import Git Repository", search for `amplifi-ai`
3. Click on your repository to select it
4. You'll see the Project Configuration page

### 2c. Configure Project Settings

**Framework Preset:** Next.js (should auto-detect)

**Project Name:** `amplifi-ai` (or your preferred name)

**Root Directory:** `./` (leave as default)

**Build and Output Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

(These should auto-fill correctly)

---

## Step 3: Add Environment Variables in Vercel

**IMPORTANT:** This is where you add your Supabase credentials so Vercel can access them.

### 3a. During Initial Deployment (Project Configuration Page)

1. Scroll down to "Environment Variables" section
2. Click "Add" to add a variable

**Add First Variable:**
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** (paste your Supabase project URL)
  - Get this from: Supabase Project → Settings → API → Project URL
- Click "Add"

**Add Second Variable:**
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** (paste your anon public key)
  - Get this from: Supabase Project → Settings → API → Anon key
- Click "Add"

### 3b. Example Values (Replace with Your Own!)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3c. After Initial Deployment (Project Settings)

If you need to update environment variables later:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click "Environment Variables" in the left sidebar
4. Edit or add variables as needed
5. Changes take effect on the next deployment

---

## Step 4: Deploy!

### 4a. Complete the Deployment

1. On the Project Configuration page, click "Deploy" button
2. Vercel will automatically:
   - Pull your code from GitHub
   - Build the Next.js app
   - Run TypeScript checks
   - Deploy to Vercel's CDN
3. Wait for the deployment to complete (usually 2-5 minutes)

### 4b. Monitor Deployment

- You'll see a progress indicator showing build status
- Once complete, you'll see "Congratulations! Your project has been successfully deployed"
- A unique URL will be provided (e.g., `https://amplifi-ai.vercel.app`)

### 4c. Access Your App

- Click the preview link or visit your deployment URL
- Your AMPLIFI.AI app is now live! 🎉

---

## Step 5: Verify Everything Works

### 5a. Test Core Features

1. **Sign Up** - Create a new account
2. **Profile Page** - Edit your profile with skills
3. **Directory** - Browse other users
4. **Messaging** - Send a message to another user
5. **Block Party** - Create a block party event

### 5b. Check Browser Console

- Open DevTools (F12)
- Check the Console tab for any errors
- Common issues:
  - Red errors about Supabase = environment variables not set
  - Network errors = check Supabase URL/key

### 5c. Supabase Logs

- Go to your Supabase project
- Check logs to see if API calls are working

---

## Automatic Deployments (Continuous Integration)

Once connected, Vercel automatically deploys when you:
- Push to the `main` branch
- Create a pull request (Vercel creates a preview deployment)

### To Deploy New Changes

```bash
# Make changes to your code

# Stage and commit
git add .
git commit -m "Describe your changes"

# Push to GitHub
git push origin main

# Vercel automatically deploys!
```

You'll see progress on the Vercel dashboard, and a link to the deployment appears.

---

## Environment Variables Reference

| Variable | Required | Where to Get | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | YES | Supabase → Settings → API → Project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | YES | Supabase → Settings → API → Anon key | `eyJhb...` |

**Note:** These variables are prefixed with `NEXT_PUBLIC_` so they're exposed to the browser. Keep your Service Role Key secret and never add it to these variables.

---

## Common Troubleshooting

### Build Fails

**Error:** `npm ERR! code ERESOLVE`
- **Solution:** Check package.json dependencies are correct
- Run `npm install` locally and commit lock file

**Error:** `TypeScript compilation error`
- **Solution:** Run `npm run build` locally to catch errors first
- Fix errors and commit changes

### Environment Variables Not Working

**Symptom:** "Supabase not configured" error
- **Solution:** 
  1. Go to Vercel Project → Settings → Environment Variables
  2. Verify variables are set correctly
  3. Redeploy: click the three dots menu → "Redeploy"
  4. Clear browser cache (Ctrl+Shift+Delete)

### Deployment URL Issues

**Problem:** URL doesn't load
- **Solution:**
  1. Check Vercel deployment logs for errors
  2. Wait a few minutes (DNS may not be propagated)
  3. Try clearing browser cache
  4. Check that Supabase is accessible

### Database Errors

**Problem:** Sign-up fails or profile not created
- **Solution:**
  1. Verify Supabase project is active
  2. Check Row Level Security policies are correct
  3. Review Supabase SQL logs for errors
  4. Ensure database tables exist

---

## Custom Domain (Optional)

To use your own domain instead of `amplifi-ai.vercel.app`:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `amplifi.ai`)
4. Follow DNS configuration instructions
5. Update Supabase CORS if needed

---

## Production Checklist

Before considering your app production-ready:

- [ ] All pages load without errors
- [ ] Sign up and login work
- [ ] Profile creation on signup works
- [ ] Can edit profile and save to Supabase
- [ ] Directory displays real users
- [ ] Messaging works in real-time
- [ ] Block party wizard completes successfully
- [ ] No console errors in browser
- [ ] Responds to mobile devices
- [ ] Environment variables are hidden
- [ ] Supabase Row Level Security is configured

---

## Security Best Practices

✅ **Do:**
- Use `NEXT_PUBLIC_` prefix only for frontend-safe values
- Enable Row Level Security on all Supabase tables
- Regularly rotate Supabase keys
- Monitor Vercel and Supabase logs
- Use HTTPS (Vercel provides this automatically)

❌ **Don't:**
- Commit `.env.local` or secrets to GitHub
- Expose your Service Role Key
- Use the same password for Vercel and Supabase
- Skip RLS policies

---

## Monitoring & Maintenance

### Vercel Dashboard

- **Deployments**: View all past deployments
- **Analytics**: Monitor usage and performance
- **Logs**: Check build and runtime logs
- **Settings**: Manage environment variables and domains

### Supabase Dashboard

- **API Usage**: Monitor requests and connections
- **Database**: Check table data and RLS policies
- **Auth**: View user signups and sessions
- **Logs**: Check for query errors

### Keep Your Code Updated

Periodically:
- Update npm dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`
- Test new deployments before production changes

---

## Quick Reference Commands

```bash
# Local development
npm run dev              # Start dev server at localhost:3000

# Before deploying
git add .
git commit -m "Message"
git push origin main     # Auto-deploys to Vercel

# Check for issues
npm run build            # Full build test
npm run lint             # Code quality check

# View environment
vercel env pull          # Pull Vercel env vars locally (requires CLI)
```

---

## Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Help**: https://docs.github.com

---

## Success! 🎉

Your AMPLIFI.AI app is now deployed on Vercel! You can:

- Share the URL with others (e.g., `https://amplifi-ai.vercel.app`)
- Continue developing and pushing changes
- Monitor performance and errors
- Scale up as your user base grows

**Next Steps:**
1. Test all features on the live deployment
2. Share with beta users for feedback
3. Make improvements based on usage
4. Consider adding custom domain
5. Set up monitoring dashboards

---

**Last Updated:** March 2026
**Status:** Ready for Production Deployment
