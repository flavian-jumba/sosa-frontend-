# 🚨 URGENT FIX: CORS Error on Vercel

## What's Wrong?
Your app works on **localhost** but shows **CORS errors** on **Vercel** because your Laravel backend isn't allowing requests from your Vercel domain.

## What You Need to Do RIGHT NOW

### 1️⃣ Find Your Vercel Domain
Go to your browser and check the URL bar:
- Example: `https://sosa-frontend-xyz123.vercel.app`
- Or check Vercel dashboard → Your Project → Domains

### 2️⃣ Update Laravel Backend CORS Config

Open your Laravel project (`sosa-BE` folder) and edit `config/cors.php`:

```php
<?php

return [
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'storage/*', // For images
    ],

    'allowed_methods' => ['*'],

    // 👇 ADD YOUR VERCEL DOMAIN HERE
    'allowed_origins' => [
        'http://localhost:8080',
        'http://localhost:8081',
        'https://sosa-frontend-black.vercel.app', // ⚠️ Replace with YOUR actual domain from step 1
    ],

    // 👇 THIS ALLOWS ALL VERCEL PREVIEW DEPLOYMENTS
    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.vercel\.app$/', // Allows *.vercel.app
    ],

    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### 3️⃣ Push Changes to Laravel Cloud

```bash
cd /home/infinity/coding/laravel/SosaCottagesProject/sosa-BE

# Commit the changes
git add config/cors.php
git commit -m "Fix CORS for Vercel frontend"

# Push to Laravel Cloud (this triggers auto-deployment)
git push origin main
```

### 4️⃣ Wait for Deployment (1-2 minutes)

Laravel Cloud will automatically deploy your changes. Check the deployment status in your Laravel Cloud dashboard.

### 5️⃣ Test Your Vercel App

1. Go to your Vercel app URL
2. Refresh the page (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
3. Open DevTools (F12) → Network tab
4. Check if API requests now return `200 OK` instead of `CORS error`

## ✅ How to Verify It's Fixed

### In Browser DevTools (F12):
1. Go to **Network** tab
2. Click on any API request (e.g., `cottages` or `health`)
3. Click **Headers** tab
4. Look for these headers in the **Response Headers**:
   ```
   Access-Control-Allow-Origin: https://your-vercel-app.vercel.app
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   ```

### Test from Command Line:
```bash
curl -H "Origin: https://your-vercel-app.vercel.app" \
     -I \
     https://sosa-be-main-0fch1f.laravel.cloud/api/v1/public/cottages

# Should see CORS headers in response
```

## 🎯 Quick Reference

| Issue | Symptom | Fix |
|-------|---------|-----|
| CORS Error | Network tab shows "CORS error" | Add Vercel domain to `config/cors.php` |
| Works locally, fails on Vercel | Different origins | Configure allowed origins |
| Images not loading | 403 or CORS on `/storage/*` | Add `storage/*` to CORS paths |

## 📋 Complete Checklist

- [ ] Get your Vercel domain URL
- [ ] Update `config/cors.php` with Vercel domain
- [ ] Commit and push to Laravel Cloud
- [ ] Wait for deployment (check Laravel Cloud dashboard)
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Test Vercel app - should load data now!

## 🆘 Still Not Working?

### Check These:

1. **Correct domain?** Make sure no typo in the domain you added
2. **Trailing slash?** Use `https://app.vercel.app` NOT `https://app.vercel.app/`
3. **Deployed?** Check Laravel Cloud dashboard - deployment must be complete
4. **Cache?** Try opening in incognito/private window
5. **Multiple domains?** Check if Vercel gave you a different URL

### Get More Help:

1. Share screenshot of:
   - Browser DevTools → Network tab showing the CORS error
   - Your `config/cors.php` file
   - Your Vercel domain from browser URL bar

2. Check Laravel logs:
   ```bash
   # If you have SSH access to Laravel Cloud
   tail -f storage/logs/laravel.log
   ```

## 💡 Pro Tips

- The `allowed_origins_patterns` line allows ALL `*.vercel.app` domains (good for preview deployments)
- For production with custom domain, add it to `allowed_origins`
- After fixing CORS, images should also work (if backend setup is correct)
- Always test in incognito window after changes to avoid cache issues

---

**Expected Timeline:**
- Edit config: 2 minutes
- Push to Laravel Cloud: 1 minute  
- Deployment: 1-2 minutes
- **Total: ~5 minutes to fix!**
