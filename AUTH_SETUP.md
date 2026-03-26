# AMPLIFI.AI Authentication Setup Guide

This guide walks you through setting up Supabase authentication and the profiles system for AMPLIFI.AI.

## Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Save your credentials from **Settings → API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Add Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database

Go to your Supabase project's **SQL Editor** and run all the SQL from the [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) file.

This creates:
- `profiles` table with user profile data
- Row Level Security (RLS) policies
- Auto-update trigger for `updated_at` timestamp

### 4. Start the Development Server

```bash
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000)

## How Authentication Works

### Sign-Up Flow

```
User fills signup form
    ↓
POST /auth/signup
    ↓
Supabase creates auth.users entry
    ↓
Auto-create profiles row linked to user ID
    ↓
Redirect to login page
    ↓
User logs in
```

**File**: [src/app/auth/signup/page.tsx](../src/app/auth/signup/page.tsx)

**Key Function**: `signUp(email, password, name, neighborhood)`
- Creates Supabase auth user
- Automatically creates profile with empty skills arrays

### Login Flow

```
User enters credentials
    ↓
Authenticate with Supabase
    ↓
Session token stored in cookies
    ↓
Redirect to profile page
    ↓
useAuth() hook detects logged-in user
```

**File**: [src/app/auth/login/login-content.tsx](../src/app/auth/login/login-content.tsx)

**Key Function**: `signIn(email, password)`
- Authenticates user with Supabase
- Returns session data

### Profile Loading

1. User navigates to `/profile`
2. `useAuth()` hook checks if user is logged in
3. If not logged in, redirects to `/auth/login`
4. Loads user profile from `profiles` table
5. Displays profile data; allows editing

**File**: [src/app/profile/page.tsx](../src/app/profile/page.tsx)

## Code Files Reference

### Authentication Library
**File**: [src/lib/supabase.ts](../src/lib/supabase.ts)

Exports:
- `getSupabase()` - Get initialized Supabase client
- `signUp(email, password, name, neighborhood)` - Register new user
- `signIn(email, password)` - Log in user
- `signOut()` - Log out user
- `getUser()` - Get current authenticated user
- `getUserProfile(userId)` - Get user's profile data

### Authentication Hook
**File**: [src/lib/useAuth.ts](../src/lib/useAuth.ts)

Custom React hook that:
- Checks if user is logged in on mount
- Subscribes to auth state changes
- Returns `{ user, loading, error }`

Usage:
```typescript
const { user, loading, error } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <Navigate to="/auth/login" />;
```

### Navbar Component
**File**: [src/components/Navbar.tsx](../src/components/Navbar.tsx)

- Uses `useAuth()` to display auth status
- Shows different navigation based on login state
- Authenticated users see: Directory, Block Party, Messages, Profile
- Unauthenticated users see: Sign Up, Log In links
- Includes Sign Out button

### Sign-Up Page
**File**: [src/app/auth/signup/page.tsx](../src/app/auth/signup/page.tsx)

Form fields:
- Full Name (required)
- Neighborhood (required)
- Email (required)
- Password (required, min 6 characters)
- Confirm Password (must match)

On successful signup:
- Auth user created in Supabase
- Profile record auto-created
- Redirects to login page with success message

### Login Page
**File**: [src/app/auth/login/login-content.tsx](../src/app/auth/login/login-content.tsx)

Form fields:
- Email (required)
- Password (required)

On successful login:
- Session established
- Redirects to `/profile`

### Profile Page
**File**: [src/app/profile/page.tsx](../src/app/profile/page.tsx)

Features:
- Display user profile data
- Edit mode with form inputs
- Update: name, neighborhood, bio, skills_have, skills_need
- Save changes back to database

## Database Schema

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,                    -- Linked to auth.users(id)
  name TEXT NOT NULL,                     -- User full name
  neighborhood TEXT NOT NULL,             -- Neighborhood identifier
  bio TEXT DEFAULT '',                    -- User bio/description
  skills_have TEXT[] DEFAULT ARRAY[],     -- Skills user has (array)
  skills_need TEXT[] DEFAULT ARRAY[],     -- Skills user needs (array)
  avatar_url TEXT,                        -- Avatar image URL
  created_at TIMESTAMP,                   -- Auto-set on creation
  updated_at TIMESTAMP                    -- Auto-updated on changes
);
```

## Protecting Routes

To protect routes so only authenticated users can access them:

```typescript
'use client';

import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return <div>Protected content</div>;
}
```

## Working with Profiles

### Update Profile

```typescript
import { supabase } from '@/lib/supabase';

const { error } = await supabase
  .from('profiles')
  .update({
    bio: 'New bio',
    skills_have: ['Gardening', 'Cooking']
  })
  .eq('id', userId);
```

### Fetch Profile

```typescript
import { getUserProfile } from '@/lib/supabase';

const profile = await getUserProfile(userId);
console.log(profile.name, profile.skills_have);
```

### Working with Arrays

```typescript
// Add to array
const { data } = await supabase
  .from('profiles')
  .select('skills_have')
  .eq('id', userId)
  .single();

const updatedSkills = [...data.skills_have, 'New Skill'];

await supabase
  .from('profiles')
  .update({ skills_have: updatedSkills })
  .eq('id', userId);
```

## Common Issues

### Issue: Supabase not configured
**Error**: "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solution**: 
- Check `.env.local` exists and has both variables
- Reload development server after adding .env.local
- Don't forget `NEXT_PUBLIC_` prefix

### Issue: Can't sign up
**Error**: "User already exists"

**Solution**:
- The email is already registered
- Try a different email address
- Or delete the user from Supabase auth panel

### Issue: Profiles table not found
**Error**: "relation 'profiles' does not exist"

**Solution**:
- Run the SQL setup script from SUPABASE_SETUP.md
- Verify table exists in Supabase Table Editor

### Issue: "Permission denied" on profile update
**Error**: "new row violates row-level security policy"

**Solution**:
- Check RLS policy allows UPDATE for authenticated users
- Verify auth.uid() matches the profile.id being updated

### Issue: useSearchParams() error during build
**Solution**: Already fixed - use Suspense boundary around components using useSearchParams()

## Testing Authentication

### Test Sign Up
1. Go to http://localhost:3000
2. Click "Sign Up" button
3. Fill in form with test data
4. Should be redirected to login with success message
5. Check Supabase dashboard → Authentication to see new user

### Test Profile Creation
1. In Supabase dashboard, go to Table Editor
2. Open `profiles` table
3. Should see new row with matching user ID

### Test Login
1. Go to http://localhost:3000/auth/login
2. Enter test credentials
3. Should redirect to profile page
4. Profile page should load user's data

### Test Profile Update
1. While logged in, go to /profile
2. Click "Edit Profile"
3. Update fields
4. Click "Save Changes"
5. Verify changes appear in Supabase dashboard

## Advanced: Real-time Updates

To listen for real-time profile changes:

```typescript
const channel = supabase
  .channel('profiles-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
    (payload) => {
      console.log('Profile updated:', payload.new);
      setProfile(payload.new);
    }
  )
  .subscribe();

// Cleanup
return () => channel.unsubscribe();
```

## Next Steps

1. **Email Verification**: Add email verification during signup
2. **Social Auth**: Add Google/GitHub login buttons
3. **Password Reset**: Add password recovery flow
4. **Profile Pictures**: Add avatar upload functionality
5. **2FA**: Add two-factor authentication
6. **Rate Limiting**: Add rate limiting to auth endpoints

## Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/overview)
- [Supabase Database](https://supabase.com/docs/guides/database/overview)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/nextjs)
