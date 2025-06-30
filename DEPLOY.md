# 🚀 Deploy to Vercel - Step by Step

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it something like `pest-control-landing` or `auto-call-landing`
3. Make it **public** (easier for Vercel connection)
4. **Don't** initialize with README (we have files already)

## Step 2: Upload Your Files

### Option A: GitHub Web Interface
1. Click "uploading an existing file"
2. Drag these files from your computer:
   - `index.html`
   - `styles.css` 
   - `script.js`
   - `vercel.json`
   - `README.md`
   - `diagnostic.html` (optional - for testing)
3. Commit with message: "Initial commit - auto-call landing page"

### Option B: Command Line (if you have git)
```bash
git init
git add .
git commit -m "Initial commit - auto-call landing page"
git remote add origin https://github.com/YOURUSERNAME/YOURREPONAME.git
git push -u origin main
```

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Find your repository and click "Import"
5. **Leave all settings as default** - the `vercel.json` handles everything
6. Click "Deploy"
7. Wait 30-60 seconds ⏳
8. Get your live URL! 🎉

## Step 4: Test Everything

1. **Visit your Vercel URL on mobile**
2. **Test the auto-call**: Should dial (844) 213-0185 after 3 seconds
3. **Check manual button**: Should appear after 6 seconds
4. **Test on desktop**: Manual button should work

## Step 5: Optional Customizations

### Add Custom Domain
- In Vercel dashboard: Settings → Domains
- Add your domain and follow DNS instructions

### Update Phone Number
- Edit `script.js` lines:
  ```javascript
  const PHONE_NUMBER = '+1YOUR-PHONE-NUMBER';
  const DISPLAY_PHONE = '(YOUR) PHONE-NUMBER';
  ```

### Update Company Info
- Edit `index.html` to change "PestGuard Pro" to your company name
- Update email, service area, etc.

## 🎯 Your Files Are Ready!

All files are optimized for Vercel:
- ✅ `vercel.json` - Handles routing and headers
- ✅ Mobile-first responsive design
- ✅ Auto HTTPS and compression
- ✅ Global CDN for fast loading
- ✅ Auto-call works perfectly

## 🔧 Need Help?

If something doesn't work:
1. Check your Vercel deployment logs
2. Test the diagnostic.html page: `yoursite.vercel.app/diagnostic`
3. Add `?debug=true` to test without auto-calling

**Deploy time: ~5 minutes** ⚡ 