'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signUpAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: handleAuthError(error.message) };
  }

  redirect('/auth/confirm');
}

export async function loginAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: handleAuthError(error.message) };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function requestPasswordResetAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'Email is required' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    return { error: handleAuthError(error.message) };
  }

  return { success: true };
}

export async function resetPasswordAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const password = formData.get('password') as string;

  if (!password) {
    return { error: 'Password is required' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long' };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: handleAuthError(error.message) };
  }

  redirect('/login?message=Password updated successfully');
}

function handleAuthError(errorMessage: string): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Email or password is incorrect',
    'Email not confirmed': 'Please verify your email address',
    'User already registered': 'An account with this email already exists',
    'Password should be at least 8 characters': 'Password must be at least 8 characters long',
    'Invalid email': 'Please enter a valid email address',
    'Signup requires a valid password': 'Please enter a valid password',
  };

  return errorMessages[errorMessage] || 'An unexpected error occurred. Please try again.';
}
