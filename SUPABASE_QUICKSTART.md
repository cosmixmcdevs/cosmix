# Supabase Integration Quick Start

I've successfully integrated Supabase for account management! Here's what was added:

## New Files

1. **supabase-config.js** - Server-side configuration for Supabase clients
2. **supabase-client.js** - Browser-side authentication utilities
3. **supabase-schema.sql** - Database schema to run in Supabase dashboard
4. **.env.example** - Template for environment variables
5. **.gitignore** - Git ignore file (includes .env for security)
6. **SUPABASE_SETUP.md** - Complete setup guide

## Updated Files

1. **package.json** - Added `@supabase/supabase-js` and `dotenv` dependencies
2. **server.js** - Added Supabase configuration and API endpoints
3. **auth-controls.js** - Updated to work with Supabase authentication

## New API Endpoints

- `GET /api/supabase-config` - Get Supabase public config for the frontend
- `GET /api/supabase/user/profile` - Get user profile (requires auth token)
- `PUT /api/supabase/user/profile` - Update user profile (requires auth token)

## Quick Setup Steps

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env` and add your Supabase credentials
3. Run the SQL schema from `supabase-schema.sql` in your Supabase dashboard
4. Add the Supabase scripts to your HTML files (see SUPABASE_SETUP.md)
5. Start using `SupabaseAuth` functions in your application

## Available Auth Functions

```javascript
// Sign up
SupabaseAuth.signUp(email, password, userData)

// Sign in
SupabaseAuth.signIn(email, password)

// Sign out
SupabaseAuth.signOut()

// Get session
SupabaseAuth.getSession()

// Get current user
SupabaseAuth.getUser()

// Update profile
SupabaseAuth.updateProfile(updates)

// Reset password
SupabaseAuth.resetPassword(email)

// Update password
SupabaseAuth.updatePassword(newPassword)

// Listen to auth state changes
SupabaseAuth.onAuthStateChange(callback)
```

## Database Schema

The schema includes:
- **user_profiles** - User account information
- **reports** - Moderation reports
- **auth_logs** - Authentication audit trail
- Row-level security (RLS) policies for data protection
- Automatic timestamp management

## Important Security Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (never commit to git)
- The `.env` file is in `.gitignore` - create it locally
- All database access is protected by RLS policies
- The `service_role_key` is only for server-side operations

## Next Steps

1. See `SUPABASE_SETUP.md` for detailed setup instructions
2. Configure your Supabase project with the schema
3. Update your HTML files to include the Supabase scripts
4. Test authentication with your application

All dependencies have been installed and the code is ready to use!
