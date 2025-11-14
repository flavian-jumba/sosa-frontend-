# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4a342442-28b2-4e99-9f6f-c3dd7b902969

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4a342442-28b2-4e99-9f6f-c3dd7b902969) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Backend API Configuration

This frontend connects to a Laravel backend hosted on Laravel Cloud. The API connection is configured through environment variables.

### Environment Variables

Create a `.env` file in the root directory (already created with default values):

```env
VITE_API_BASE_URL=https://sosa-be-main-0fch1f.laravel.cloud
```

**Important Security Note:** 
- ⚠️ **NEVER** put your Laravel `APP_KEY` in the frontend `.env` file
- The `APP_KEY` is a server-side encryption secret and must remain on the backend only
- If your backend requires a public API token, create a separate token and set it as `VITE_API_KEY`

### Testing the API Connection

Visit `http://localhost:8081/api-test` after starting the dev server to verify the backend connection is working properly. This page will show:
- Current API base URL configuration
- Connection status (success/error)
- Sample data from the backend

### Deployment Configuration

When deploying to production (Netlify, Vercel, etc.), set the environment variable in your hosting provider's dashboard:

```
VITE_API_BASE_URL=https://sosa-be-main-0fch1f.laravel.cloud
```

### Troubleshooting

**No data showing on the frontend?**
1. Check the backend is running: `curl https://sosa-be-main-0fch1f.laravel.cloud/api/v1/public/cottages`
2. Visit `/api-test` route to see detailed connection status
3. Check browser console for CORS or network errors
4. Verify `.env` file exists and has correct `VITE_API_BASE_URL`

**CORS errors?**
- Ensure your Laravel backend has proper CORS configuration
- The frontend domain must be allowed in backend's CORS settings

## Environment variables (backend URL / API key)

This frontend reads the backend base URL and an optional public API key from Vite environment variables.

Create a file named `.env` (or set these in your deployment provider) with the following values:

- `VITE_API_BASE_URL` - the base URL of the Laravel backend (example: `https://sosa-be-main-0fch1f.laravel.cloud`)
- `VITE_API_KEY` - optional public API token required by the backend for requests (NOT the Laravel `APP_KEY`).

An example file is provided at `.env.example`.

Important: Do NOT expose your Laravel `APP_KEY` in the frontend. `APP_KEY` is a server-side secret and should never be embedded in client code.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4a342442-28b2-4e99-9f6f-c3dd7b902969) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
# Sosa-FE
# sosa-frontend-
