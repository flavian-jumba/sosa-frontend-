# CORS Fix for Vercel Frontend + Laravel Cloud Backend

## The Problem

Your frontend works locally (localhost) but fails on Vercel with CORS errors because:

1. **Local development**: Your browser allows `localhost:8081` → `laravel.cloud` requests
2. **Production (Vercel)**: Your Laravel backend is **blocking** requests from your Vercel domain due to CORS policy

## Quick Fix (Backend - Laravel Cloud)

### Step 1: Update CORS Configuration

SSH into your Laravel Cloud project or update `config/cors.php`:

```php
<?php

return [
    /*
     * Paths that should have CORS enabled
     */
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'storage/*', // Important for images
    ],

    /*
     * Allowed HTTP methods
     */
    'allowed_methods' => ['*'],

    /*
     * Allowed origins (domains that can access your API)
     */
    'allowed_origins' => [
        'http://localhost:8080',
        'http://localhost:8081',
        'https://your-vercel-app.vercel.app', // Add your Vercel domain here
        'https://sosa-frontend.vercel.app',   // Replace with your actual domain
        // Add any custom domains you have
    ],

    /*
     * Patterns for allowed origins (for preview deployments)
     */
    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.vercel\.app$/', // Allows all *.vercel.app domains (preview deployments)
    ],

    /*
     * Allowed headers
     */
    'allowed_headers' => ['*'],

    /*
     * Headers to expose
     */
    'exposed_headers' => [],

    /*
     * Max age for preflight cache
     */
    'max_age' => 0,

    /*
     * Allow credentials (cookies, authorization headers)
     */
    'supports_credentials' => false,
];
```

### Step 2: Set Environment Variable (Laravel Cloud Dashboard)

In your Laravel Cloud project settings, add/update:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Then update `config/cors.php` to use it:

```php
'allowed_origins' => [
    'http://localhost:8080',
    'http://localhost:8081',
    env('FRONTEND_URL', 'https://sosa-frontend.vercel.app'),
],

'allowed_origins_patterns' => [
    '/^https:\/\/.*\.vercel\.app$/', // For preview deployments
],
```

### Step 3: Enable CORS Middleware (Should already be enabled)

Check `bootstrap/app.php` or `app/Http/Kernel.php`:

```php
// In bootstrap/app.php (Laravel 11)
->withMiddleware(function (Middleware $middleware) {
    $middleware->api([
        \Illuminate\Http\Middleware\HandleCors::class, // Make sure this is here
    ]);
})

// OR in app/Http/Kernel.php (Laravel 10)
protected $middleware = [
    \Illuminate\Http\Middleware\HandleCors::class, // Should be here
    // ... other middleware
];
```

### Step 4: Clear Cache and Redeploy

```bash
# Via Laravel Cloud CLI or SSH
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan optimize

# Then redeploy on Laravel Cloud dashboard
```

## Testing CORS from Command Line

```bash
# Test from your local machine
curl -H "Origin: https://your-vercel-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     --verbose \
     https://sosa-be-main-0fch1f.laravel.cloud/api/v1/public/cottages

# Should return 200 with CORS headers:
# Access-Control-Allow-Origin: https://your-vercel-app.vercel.app
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, etc.
```

## Alternative: Quick Fix for Testing (NOT for Production)

If you need to test immediately, temporarily allow all origins:

```php
// config/cors.php
'allowed_origins' => ['*'], // ⚠️ NOT SECURE - Only for testing!
```

Then revert to specific domains for production.

## Vercel-Specific Considerations

### Preview Deployments
Vercel creates unique URLs for each preview deployment (e.g., `app-git-branch-user.vercel.app`). Use patterns:

```php
'allowed_origins_patterns' => [
    '/^https:\/\/sosa-frontend-.*\.vercel\.app$/',
    '/^https:\/\/.*-flavian-jumba\.vercel\.app$/', // Your Vercel username
],
```

### Custom Domain
If you have a custom domain on Vercel:

```php
'allowed_origins' => [
    'https://your-custom-domain.com',
    'https://www.your-custom-domain.com',
],
```

## Environment Variables Summary

**Laravel Cloud (.env):**
```env
APP_URL=https://sosa-be-main-0fch1f.laravel.cloud
FRONTEND_URL=https://your-vercel-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
SESSION_DOMAIN=.vercel.app
```

**Vercel (.env.production):**
```env
VITE_API_BASE_URL=https://sosa-be-main-0fch1f.laravel.cloud
```

## Debugging CORS Issues

### 1. Check Browser Console
Look for errors like:
```
Access to XMLHttpRequest at 'https://sosa-be-main-0fch1f.laravel.cloud/api/v1/...' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

### 2. Check Response Headers
In browser DevTools → Network → Select failed request → Headers:

**Should see:**
```
Access-Control-Allow-Origin: https://your-app.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

**If missing:** CORS not configured properly on backend

### 3. Check Laravel Logs
```bash
# SSH into Laravel Cloud
tail -f storage/logs/laravel.log
```

### 4. Test with CURL
```bash
curl -I -H "Origin: https://your-vercel-app.vercel.app" \
     https://sosa-be-main-0fch1f.laravel.cloud/api/v1/public/cottages

# Should include CORS headers in response
```

## Common CORS Mistakes

❌ **Wrong:** Using wildcards incorrectly
```php
'allowed_origins' => ['*.vercel.app'], // This doesn't work
```

✅ **Correct:** Using patterns
```php
'allowed_origins_patterns' => ['/^https:\/\/.*\.vercel\.app$/'],
```

❌ **Wrong:** Missing protocol
```php
'allowed_origins' => ['your-app.vercel.app'], // Missing https://
```

✅ **Correct:** Full URL
```php
'allowed_origins' => ['https://your-app.vercel.app'],
```

## Step-by-Step Fix Checklist

Backend (Laravel Cloud):
- [ ] Update `config/cors.php` with Vercel domain(s)
- [ ] Add `FRONTEND_URL` environment variable
- [ ] Enable CORS middleware
- [ ] Clear all caches (`php artisan optimize`)
- [ ] Redeploy application
- [ ] Test CORS with curl command
- [ ] Check CORS headers in browser DevTools

Frontend (Vercel):
- [x] `VITE_API_BASE_URL` already set correctly
- [ ] Verify build completes successfully
- [ ] Test API calls in browser console
- [ ] Check Network tab for CORS headers

## Quick Test After Fix

1. **Deploy changes** to Laravel Cloud
2. **Wait 1-2 minutes** for deployment to complete
3. **Open your Vercel app** in browser
4. **Open DevTools** → Network tab
5. **Refresh the page**
6. **Check the API requests** - should be 200 OK with data

If you see **"CORS error"** still:
- Check you spelled the Vercel domain correctly
- Ensure no trailing slashes: `https://app.vercel.app` not `https://app.vercel.app/`
- Clear browser cache and try incognito mode
- Wait a few minutes for Laravel Cloud to fully deploy

## Need Your Vercel Domain?

Get it from:
1. Vercel dashboard → Your project → Domains
2. Or from browser address bar when accessing your deployed app

Format: `https://your-project-name.vercel.app`
