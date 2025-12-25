/**
 * Translates Supabase auth error messages to localized keys
 */
export function getAuthErrorKey(error: Error | string): string {
  const message = typeof error === 'string' ? error : error.message;
  const lowerMessage = message.toLowerCase();

  // Map common Supabase error messages to translation keys
  if (lowerMessage.includes('invalid login credentials') || 
      lowerMessage.includes('invalid email or password')) {
    return 'auth.errors.invalidCredentials';
  }
  
  if (lowerMessage.includes('user already registered') || 
      lowerMessage.includes('email already exists')) {
    return 'auth.errors.emailExists';
  }
  
  if (lowerMessage.includes('password') && lowerMessage.includes('weak')) {
    return 'auth.errors.weakPassword';
  }
  
  if (lowerMessage.includes('invalid email')) {
    return 'auth.errors.invalidEmail';
  }
  
  if (lowerMessage.includes('user not found')) {
    return 'auth.errors.userNotFound';
  }
  
  if (lowerMessage.includes('too many requests') || 
      lowerMessage.includes('rate limit')) {
    return 'auth.errors.tooManyRequests';
  }
  
  if (lowerMessage.includes('network') || 
      lowerMessage.includes('fetch failed')) {
    return 'auth.errors.networkError';
  }
  
  if (lowerMessage.includes('email not confirmed') || 
      lowerMessage.includes('email confirmation')) {
    return 'auth.errors.emailNotConfirmed';
  }

  // Default to unknown error
  return 'auth.errors.unknownError';
}
