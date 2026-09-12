# Supabase Integration Setup Guide

This guide will help you set up Supabase for user authentication and account management in the Cosmix application.

## Prerequisites

- A Supabase account (free at https://supabase.com)
- Node.js installed locally
- Access to the application repository

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in or create an account
2. Click "New Project"
3. Fill in the project details:
   - **Name**: cosmix (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose the region closest to your users
4. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon public key**: This is your `SUPABASE_ANON_KEY`
   - **service_role secret**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 3: Set Up Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Supabase credentials:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. Fill in the other environment variables (SMTP settings, Discord webhooks, etc.)

## Step 4: Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` from this repository
4. Paste it into the SQL editor
5. Click **Run**

This will create:
- `user_profiles` table - stores user profile information
- `reports` table - stores moderation reports
- `auth_logs` table - stores authentication audit logs
- Row-level security (RLS) policies for data protection
- Triggers for automatic timestamp updates

## Step 5: Install Dependencies

```bash
npm install
```

This will install the required packages including:
- `@supabase/supabase-js` - Supabase client library
- `dotenv` - Environment variable loader

## Step 6: Update HTML Files

Add the Supabase client scripts to any HTML files that need authentication. Add these lines in the `<head>` or before the closing `</body>` tag:

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.0"></script>
<script src="/supabase-client.js"></script>
<script src="/auth-controls.js"></script>
```

## Step 7: Configure Email Authentication (Optional)

To enable email-based sign-ups and password resets:

1. In Supabase, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if needed

## Step 8: Test the Integration

1. Start your server:
   ```bash
   npm start
   ```

2. Go to your application in a browser
3. Try creating a new account using the sign-up form
4. You should see Supabase authentication working

## File Structure

- **supabase-config.js** - Server-side Supabase configuration
- **supabase-client.js** - Client-side Supabase utilities
- **supabase-schema.sql** - Database schema and setup
- **auth-controls.js** - Updated auth UI controls (compatible with Supabase)
- **.env** - Environment variables (created from .env.example)

## API Endpoints

### Supabase Configuration
- **GET** `/api/supabase-config` - Returns Supabase URL and anon key to the client

### User Profile Management
- **GET** `/api/supabase/user/profile` - Get current user's profile (requires Bearer token)
- **PUT** `/api/supabase/user/profile` - Update user profile (requires Bearer token)

### Available Auth Functions (Client-Side)

The `SupabaseAuth` object provides these functions:

```javascript
// Sign up
await SupabaseAuth.signUp(email, password, userData);

// Sign in
await SupabaseAuth.signIn(email, password);

// Sign out
await SupabaseAuth.signOut();

// Get current session
const session = await SupabaseAuth.getSession();

// Get current user
const user = await SupabaseAuth.getUser();

// Update profile
await SupabaseAuth.updateProfile(updates);

// Reset password
await SupabaseAuth.resetPassword(email);

// Update password
await SupabaseAuth.updatePassword(newPassword);

// Listen to auth changes
SupabaseAuth.onAuthStateChange((event, session) => {
  // Handle auth changes
});
```

## Security Considerations

1. **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - Never expose this in client-side code or public repositories
2. **Use Row-Level Security (RLS)** - The schema includes RLS policies to protect user data
3. **Validate inputs** - Always validate user inputs on the server side
4. **Use HTTPS** - In production, always use HTTPS to protect authentication tokens

## Database Tables

### user_profiles
Stores user profile information with fields:
- `id` - UUID, references auth.users
- `email` - User email
- `username` - Display name
- `avatar` - Avatar URL
- `role` - Primary role (member, staff, owner, etc.)
- `roles` - Array of all roles
- `permissions` - Array of permissions
- `delete_requested` - Account deletion flag
- `delete_reason` - Reason for account deletion
- `created_at`, `updated_at` - Timestamps

### reports
Stores moderation reports with fields:
- `id` - UUID
- `reporter_id` - User who filed the report
- `reported_user_id` - User being reported
- `reason` - Report category
- `description` - Report details
- `status` - Report status (open, closed, etc.)
- `created_at`, `updated_at` - Timestamps

### auth_logs
Stores authentication audit trail with fields:
- `id` - UUID
- `user_id` - User UUID
- `action` - Action performed (login, logout, password_change, etc.)
- `details` - JSON details
- `ip_address` - IP address
- `created_at` - Timestamp

## Troubleshooting

### "Supabase not initialized" error
- Check that the Supabase client scripts are loaded in your HTML
- Verify that the `/api/supabase-config` endpoint is working
- Check browser console for errors

### Authentication not working
- Verify your `.env` file has the correct Supabase credentials
- Check that email provider is enabled in Supabase Authentication settings
- Look at Supabase logs for error details

### Database errors
- Verify the schema.sql file was executed successfully
- Check Supabase SQL Editor for errors
- Ensure your SUPABASE_SERVICE_ROLE_KEY is correct

## Next Steps

1. Customize the `user_profiles` table with additional fields as needed
2. Implement role-based access control (RBAC) for staff and owner features
3. Set up Discord integration for OAuth authentication
4. Configure email templates for verification and password reset
5. Add two-factor authentication (2FA) if desired

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Supabase Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
