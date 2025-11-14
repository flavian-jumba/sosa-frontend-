# Laravel Cloud Image Upload & Display Fix

## Problem Summary
Images are not uploading through Filament admin panel and not displaying on the React frontend when using Laravel Cloud hosting.

## Common Issues & Solutions

### 1. Storage Disk Configuration (Backend - Laravel)

Laravel Cloud typically requires specific storage configuration. Check your backend `config/filesystems.php`:

```php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',
        'visibility' => 'public',
        'throw' => false,
    ],
],
```

**For Laravel Cloud**, you might need to use S3 or configure the public disk differently:

```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('ASSET_URL', env('APP_URL')).'/storage',
    'visibility' => 'public',
    'throw' => false,
],
```

### 2. Storage Symlink (Backend - Laravel)

Laravel Cloud may not persist the storage symlink after deployment. You need to ensure it's created:

**Option A: Run Artisan Command**
```bash
php artisan storage:link
```

**Option B: Add to Laravel Cloud Deployment Script**
In your Laravel Cloud project settings, add this to the deployment hooks:

```bash
php artisan storage:link --force
```

**Option C: Check if Symlink Exists**
```bash
# SSH into your Laravel Cloud instance and run:
ls -la public/storage
# Should show: public/storage -> ../storage/app/public
```

### 3. File Upload Configuration (Backend - Filament)

Ensure your Filament resource is correctly configured to store images:

```php
// In your CottageResource or similar
use Filament\Forms\Components\FileUpload;

FileUpload::make('images')
    ->image()
    ->multiple()
    ->disk('public') // Make sure this is 'public'
    ->directory('cottages') // Images will be stored in storage/app/public/cottages
    ->visibility('public')
    ->maxSize(5120) // 5MB
    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'])
```

### 4. Environment Variables (Backend - Laravel Cloud)

In your Laravel Cloud dashboard, ensure these environment variables are set:

```env
APP_URL=https://sosa-be-main-0fch1f.laravel.cloud
FILESYSTEM_DISK=public
ASSET_URL=https://sosa-be-main-0fch1f.laravel.cloud
```

### 5. CORS Configuration (Backend - Laravel)

Images served from your Laravel backend need proper CORS headers. Update `config/cors.php`:

```php
return [
    'paths' => [
        'api/*', 
        'sanctum/csrf-cookie',
        'storage/*', // Add this line
    ],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:8080',
        'http://localhost:8081',
        'https://your-frontend-domain.com',
        '*', // For development only - remove in production
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### 6. Image Path in API Response (Backend - Laravel)

Your API should return full URLs or proper paths. In your Cottage model or resource:

```php
// Option 1: Return full URLs
protected $appends = ['image_urls'];

public function getImageUrlsAttribute()
{
    if (empty($this->images)) {
        return [];
    }
    
    return collect($this->images)->map(function ($path) {
        return Storage::disk('public')->url($path);
    })->toArray();
}

// Option 2: Use API Resource
class CottageResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            // ... other fields
            'images' => collect($this->images)->map(fn($path) => 
                Storage::disk('public')->url($path)
            )->toArray(),
        ];
    }
}
```

### 7. Frontend Configuration (React - Already Done)

The frontend is already configured to handle image URLs properly in `src/lib/api.ts`:

```typescript
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.svg';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Build full URL from storage path
  return `${API_BASE_URL}/storage/${path}`;
};
```

## Testing Steps

### 1. Test Storage Link
```bash
# Via SSH to Laravel Cloud or locally
php artisan storage:link --force
ls -la public/storage
```

### 2. Test File Upload
1. Go to Filament admin panel
2. Try uploading an image
3. Check browser console for errors
4. Check Laravel logs: `tail -f storage/logs/laravel.log`

### 3. Test Image URL
```bash
# After uploading an image, test the URL directly
curl -I https://sosa-be-main-0fch1f.laravel.cloud/storage/cottages/your-image.jpg

# Should return 200 OK with image content-type
```

### 4. Test API Response
```bash
curl -sS "https://sosa-be-main-0fch1f.laravel.cloud/api/v1/public/cottages/1" | jq '.data.images'

# Should return array of image paths or full URLs
```

## Common Laravel Cloud Specific Issues

### Issue: Storage Link Not Persisting
**Solution:** Add to Laravel Cloud deployment script:
```bash
php artisan storage:link --force
php artisan optimize:clear
```

### Issue: File Permissions
**Solution:** Laravel Cloud usually handles this, but ensure in `.platform.yml` or deployment config:
```yaml
post_deploy: |
  php artisan storage:link --force
  chmod -R 775 storage bootstrap/cache
```

### Issue: Images Upload but Don't Display
**Causes:**
1. Wrong URL format in API response
2. CORS blocking the images
3. Storage symlink broken

**Debug:**
```bash
# Check if image file exists
ls -la storage/app/public/cottages/

# Check if symlink works
ls -la public/storage/cottages/

# Test direct URL access
curl -I https://sosa-be-main-0fch1f.laravel.cloud/storage/cottages/test-image.jpg
```

## Quick Checklist

Backend (Laravel Cloud):
- [ ] Storage symlink created (`php artisan storage:link`)
- [ ] `APP_URL` environment variable set correctly
- [ ] `FILESYSTEM_DISK=public` in environment
- [ ] CORS configured to allow storage/* paths
- [ ] Filament FileUpload uses `disk('public')`
- [ ] API returns proper image paths/URLs
- [ ] Storage directory has write permissions

Frontend (React):
- [x] `VITE_API_BASE_URL` set to Laravel Cloud URL
- [x] Image helper functions implemented (`getImageUrl`)
- [x] Components use image helpers

## Need More Help?

1. **Check Laravel logs:** 
   - SSH into Laravel Cloud
   - Run: `tail -f storage/logs/laravel.log`
   - Try uploading image and watch for errors

2. **Check Filament logs:**
   - Look for specific Filament errors in the log

3. **Test storage directly:**
   ```bash
   php artisan tinker
   Storage::disk('public')->put('test.txt', 'test content');
   Storage::disk('public')->url('test.txt');
   # Should return full URL
   ```

4. **Verify deployment:**
   - Ensure your deployment completes successfully
   - Check Laravel Cloud deployment logs for any errors
   - Verify all artisan commands run successfully

## Example Working Configuration

**Backend - Filament Resource:**
```php
FileUpload::make('images')
    ->image()
    ->multiple()
    ->disk('public')
    ->directory('cottages')
    ->visibility('public')
    ->maxFiles(10)
    ->imageEditor()
    ->imageEditorAspectRatios([
        '16:9',
        '4:3',
        '1:1',
    ])
```

**Backend - API Controller:**
```php
public function index()
{
    $cottages = Cottage::with('amenities')->get()->map(function ($cottage) {
        $cottage->images = collect($cottage->images)->map(function ($path) {
            return Storage::disk('public')->url($path);
        })->toArray();
        return $cottage;
    });
    
    return response()->json([
        'success' => true,
        'data' => $cottages,
    ]);
}
```

This ensures images are returned as full URLs that the frontend can use directly.
