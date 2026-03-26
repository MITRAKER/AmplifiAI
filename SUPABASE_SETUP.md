# Supabase Database Setup Guide

This document provides the SQL schema needed to set up the AMPLIFI.AI database in Supabase.

## Setting Up Profiles Table

Copy and paste the following SQL into your Supabase SQL editor to create the necessary tables and policies.

### 1. Create Profiles Table

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  bio TEXT DEFAULT '',
  skills_have TEXT[] DEFAULT ARRAY[]::TEXT[],
  skills_need TEXT[] DEFAULT ARRAY[]::TEXT[],
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Policy 1: Users can view all profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 2. Create Update Trigger for Updated_At

```sql
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on profiles table
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Profiles Table Schema

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key, references auth.users(id) |
| `name` | TEXT | User's full name |
| `neighborhood` | TEXT | Neighborhood name/identifier |
| `bio` | TEXT | User's bio/description |
| `skills_have` | TEXT[] | Array of skills user has |
| `skills_need` | TEXT[] | Array of skills user needs |
| `avatar_url` | TEXT | URL to user's avatar image |
| `created_at` | TIMESTAMP | Auto-set on creation |
| `updated_at` | TIMESTAMP | Auto-updated |

## How It Works

1. **User Sign Up**: When a user creates an account via `/auth/signup`:
   - Supabase creates a user in the `auth.users` table
   - The sign-up handler automatically creates a corresponding row in the `profiles` table
   - The profile is initialized with name, neighborhood, and empty arrays for skills

2. **User Login**: When a user logs in via `/auth/login`:
   - Supabase authenticates against `auth.users`
   - User is redirected to their profile page

3. **Row Level Security (RLS)**:
   - All users can view any profile
   - Users can only update their own profile
   - Profile deletion is prevented (cascaded with user deletion)

## Managing Arrays (Skills)

Example of updating skills:

```javascript
import { supabase } from '@/lib/supabase';

// Add a skill
const { error } = await supabase
  .from('profiles')
  .update({
    skills_have: ['JavaScript', 'React', 'Gardening']
  })
  .eq('id', userId);

// Get current skills
const { data } = await supabase
  .from('profiles')
  .select('skills_have, skills_need')
  .eq('id', userId)
  .single();
```

## 3. Create Messages Table

```sql
-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view messages they sent or received
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy 2: Users can insert messages (send a message)
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Policy 3: Users can update messages they received (mark as read)
CREATE POLICY "Users can update received messages" ON messages
  FOR UPDATE USING (auth.uid() = receiver_id);
```

## 4. Create Party Projects Table

```sql
-- Create party_projects table (for block-party events and community projects)
CREATE TABLE party_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  permit_done BOOLEAN DEFAULT false,
  funding_link TEXT,
  signups JSONB DEFAULT '[]'::jsonb,
  vendors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on party_projects table
ALTER TABLE party_projects ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can view party projects
CREATE POLICY "Party projects are viewable by everyone" ON party_projects
  FOR SELECT USING (true);

-- Policy 2: Users can insert (create) party projects
CREATE POLICY "Users can create party projects" ON party_projects
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Policy 3: Only creator can update their project
CREATE POLICY "Users can update own party projects" ON party_projects
  FOR UPDATE USING (auth.uid() = creator_id);

-- Policy 4: Only creator can delete their project
CREATE POLICY "Users can delete own party projects" ON party_projects
  FOR DELETE USING (auth.uid() = creator_id);

-- Create trigger for party_projects updated_at
CREATE TRIGGER update_party_projects_updated_at BEFORE UPDATE ON party_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Tables Overview

### Profiles Table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key, references auth.users(id) |
| `name` | TEXT | User's full name |
| `neighborhood` | TEXT | Neighborhood name/identifier |
| `bio` | TEXT | User's bio/description |
| `skills_have` | TEXT[] | Array of skills user has |
| `skills_need` | TEXT[] | Array of skills user needs |
| `avatar_url` | TEXT | URL to user's avatar image |
| `created_at` | TIMESTAMP | Auto-set on creation |
| `updated_at` | TIMESTAMP | Auto-updated |

### Messages Table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `sender_id` | UUID | References auth.users(id) |
| `receiver_id` | UUID | References auth.users(id) |
| `content` | TEXT | Message content |
| `read` | BOOLEAN | Whether receiver has read message |
| `created_at` | TIMESTAMP | Auto-set on creation |

**RLS Policies:**
- Users can only view messages they sent or received
- Users can only send messages (insert with auth.uid = sender_id)
- Users can only update messages they received (mark as read)

### Party Projects Table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `creator_id` | UUID | References auth.users(id) - project creator |
| `title` | TEXT | Project/event title |
| `neighborhood` | TEXT | Which neighborhood |
| `permit_done` | BOOLEAN | Whether permit obtained |
| `funding_link` | TEXT | Link to funding page (e.g., GoFundMe) |
| `signups` | JSONB | Array of user IDs who signed up |
| `vendors` | JSONB | Array of vendor information |
| `created_at` | TIMESTAMP | Auto-set on creation |
| `updated_at` | TIMESTAMP | Auto-updated |

**RLS Policies:**
- Everyone can view all party projects
- Users can only create/update/delete their own projects

## Testing Your Setup

1. Navigate to your Supabase project
2. Go to **SQL Editor**
3. Create a new query and paste the SQL above
4. Run the query
5. Check the **Table Editor** to verify tables were created
6. Try signing up on the app to test the profile creation

## Troubleshooting

### Issue: "Permission denied" when signing up
- Check that RLS policies are correctly set
- Ensure the insert policy allows authenticated users

### Issue: Profile not created after sign-up
- Check browser console for errors
- Verify Supabase credentials in `.env.local`
- Check the SQL logs in Supabase dashboard

### Issue: Can't update profile
- Verify the UPDATE policy allows the user (auth.uid() = id)
- Check that you're querying with the correct user ID

## More Resources

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Authentication](https://supabase.com/docs/guides/auth/overview)
- [Supabase Database](https://supabase.com/docs/guides/database/overview)
