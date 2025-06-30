# PestGuard Pro - Auto-Call Landing Page

Professional pest control landing page with automatic call functionality, optimized for mobile Google Ads campaigns.

## 🚀 **Quick Vercel Deployment**

1. **Create GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/pest-control-landing.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository
   - Deploy automatically!

3. **Custom Domain** (Optional):
   - Add your domain in Vercel dashboard
   - Update DNS to point to Vercel

## ⚡ **Features**

- **Auto-Call Sequence**: 1s delay → 2s → automatic call trigger → 6s → manual button
- **Mobile-First Design**: Optimized for mobile Google Ads traffic
- **Trust Building**: Professional branding, ratings, certifications
- **Analytics Ready**: GTM/GA4 integration for call tracking
- **Debug Mode**: Add `?debug=true` for testing without auto-call

## 📱 **How Auto-Call Works**

1. **Page loads** → Shows loading animation
2. **After 1 second** → Progress bar appears
3. **After 3 seconds total** → Automatically triggers `tel:+18442130185`
4. **After 6 seconds** → Shows manual "Call Now" button as backup
5. **Analytics tracking** → Records all call events

## 🔧 **Configuration**

### Phone Number
Change in `script.js`:
```javascript
const PHONE_NUMBER = '+18442130185';
const DISPLAY_PHONE = '(844) 213-0185';
```

### Company Details
Update in `index.html`:
- Company name: "PestGuard Pro"
- Email: info@pestguardpro.com
- Service area, hours, etc.

### Auto-Call Timing
Modify in `script.js`:
```javascript
const INITIAL_DELAY = 1000;        // 1 second
const CALL_TRIGGER_DELAY = 2000;   // 2 more seconds (3 total)
const MANUAL_BUTTON_DELAY = 3000;  // 3 more seconds (6 total)
```

## 📊 **Analytics Events**

The page tracks these GTM/GA4 events:
- `auto_call_triggered` - When auto-call fires
- `manual_button_click` - When user clicks manual button
- `page_hidden_during_sequence` - If user switches away during auto-call
- `auto_call_failed` - If auto-call doesn't work

## 🛠️ **Files Structure**

```
├── index.html          # Main landing page
├── styles.css          # Responsive mobile-first styles
├── script.js           # Auto-call functionality
├── diagnostic.html     # Server testing page (can remove after deployment)
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## 🧪 **Testing**

### Local Testing
1. Open `index.html` in browser
2. Add `?debug=true` to URL to disable auto-call
3. Check mobile responsiveness

### Production Testing  
1. Visit your Vercel URL
2. Test on actual mobile device
3. Verify call functionality works
4. Check analytics in GTM/GA4

## 📈 **Optimization Tips**

- **Mobile Speed**: Page loads under 1 second on 3G
- **Trust Signals**: Reviews, certifications, emergency messaging
- **Clear CTA**: Giant call button, emergency messaging
- **Fallback Systems**: Manual button if auto-call fails

## 🔒 **Security & Performance**

- Automatic HTTPS via Vercel
- Security headers configured
- Gzip compression enabled
- Global CDN for fast loading
- Mobile-optimized assets

---

**Contact**: For support or customization, modify the contact details in the HTML file. 