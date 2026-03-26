'use client';

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function initSupabase(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}

export function getSupabase(): SupabaseClient {
  return initSupabase();
}

export const supabase = (() => {
  try {
    return initSupabase();
  } catch {
    // Return a dummy client during build time
    return null as any;
  }
})();

export function validateSupabaseConfig() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  }
}

// Authentication functions
export async function signUp(email: string, password: string, name: string, neighborhood: string) {
  const client = getSupabase();
  
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    // Create profile on successful sign up
    const { error: profileError } = await client.from("profiles").insert([
      {
        id: data.user.id,
        name,
        neighborhood,
        bio: "",
        skills_have: [],
        skills_need: [],
        avatar_url: null,
      },
    ]);

    if (profileError) throw profileError;
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const client = getSupabase();
  
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOut() {
  const client = getSupabase();
  
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const client = getSupabase();
  
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) throw error;

  return user;
}

export async function getUserProfile(userId: string) {
  const client = getSupabase();
  
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}
