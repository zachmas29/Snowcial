# Snowcial

[![Build](https://github.com/csci0312-f25/project-burgundy-binturong/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/csci0312-f25/project-burgundy-binturong/actions/workflows/build.yml)

Snowcial helps Middlebury students connect with fellow skiers and coordinate trips to the Snowbowl. Find your ski buddies and hit the slopes together!

## authors

Casey Adjei, Cam Bitter, Ned Cutler, Zach Okayli Masaryk, Toby Penner
🚀 **[Live Application](https://project-burgundy-binturong.csci312.dev/)**

## Prerequisites

- **Node.js** (version 18 or higher)
- **pnpm** package manager
- **Docker** (required for Supabase local development)

## Getting Started

### 1. Repository Setup

```bash
git clone git@github.com:csci0312-f25/project-burgundy-binturong.git
cd project-burgundy-binturong
pnpm install
```

> **Note:** If you don't have pnpm installed, run `npm install -g pnpm` first.

### 2. Supabase Setup

First, install the Supabase CLI by following the [official documentation](https://supabase.com/docs/guides/local-development/cli/getting-started):

**macOS (Homebrew):**
```bash
brew install supabase/tap/supabase
```

**Windows (Scoop):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

Once the Supabase CLI is installed, initialize and start your local instance:

```bash
supabase init
supabase start
```

### 3. Environment Variables

Create your environment file:

```bash
touch .env.local
```

Add the following variables (values will be displayed after running `supabase start`):

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

For production deployment, you'll also need:

```env
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Google OAuth Configuration

Follow these steps to set up Google OAuth authentication:

1. **Create a Google Cloud Project**
   - Go to the [Google Cloud Platform Dashboard](https://console.cloud.google.com/home/dashboard)
   - Create a new project

2. **Configure OAuth Consent Screen**
   - Navigate to the [Auth Console](https://console.cloud.google.com/auth/overview)
   - Add the `../auth/userinfo.email` scope

3. **Create OAuth Client**
   - Create a new web application client with these settings:
     - **Application type:** Web application
     - **Name:** Your preferred name
     - **Authorized JavaScript origins:** `http://127.0.0.1:3000`
     - **Authorized redirect URIs:** `http://127.0.0.1:54321/auth/v1/callback`

4. **Configure Supabase**
   - Add the Google client secret to `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET` in your `.env.local`
   - The Google OAuth client ID is already configured in `supabase/config.toml`

### 5. Initialize Git Hooks (Optional)

Set up pre-commit hooks for code quality:

```bash
pnpm prepare
```

This will configure Husky to run linting and formatting checks before each commit.

### 6. Start Development

Run the development server:

```bash
pnpm dev
```

Your application will be available at `http://localhost:3000`.

### 7. Run Tests

Execute the test suite:

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Type checking
pnpm typecheck

# Linting and formatting
pnpm lint
pnpm format
```

## You're All Set! 🎿

Your Snowcial development environment is now ready. Start the application and begin connecting with fellow skiers!

## Additional Information

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests with Vitest
- `pnpm test:ui` - Run tests with UI
- `pnpm lint` - Check code with Biome
- `pnpm format` - Format code with Biome
- `pnpm fix` - Auto-fix linting and formatting issues
- `pnpm typecheck` - Run TypeScript type checking

### Tech Stack

- **Frontend:** Next.js 15, React 19, Material-UI
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Testing:** Vitest, Testing Library
- **Linting/Formatting:** Biome
- **Package Manager:** pnpm

### Troubleshooting

**Docker Issues:**
- Ensure Docker is running before starting Supabase
- On Windows, make sure Docker Desktop is properly configured

**Environment Variables:**
- Double-check that your `.env.local` file contains the correct Supabase URL and anon key
- Ensure Google OAuth client secret is properly set
