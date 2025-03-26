
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { getCurrentUser } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, meta?: { [key: string]: any }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug auth status - include timestamps for better debugging
  const debugAuth = (message: string, data?: any) => {
    console.log(`Auth Debug [${new Date().toISOString()}]: ${message}`, data || '');
  };

  useEffect(() => {
    debugAuth('Auth provider mounted');
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    
    const initializeAuth = async () => {
      setIsLoading(true);
      debugAuth('Initializing auth');
      
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          debugAuth(`Auth state changed: ${event}`, { 
            hasSession: session ? true : false,
            userId: session?.user?.id 
          });
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            try {
              debugAuth('User signed in or token refreshed, fetching user data');
              const currentUser = await getCurrentUser();
              debugAuth('User data retrieved after auth event', currentUser);
              setUser(currentUser);
              setIsLoading(false);
            } catch (error) {
              debugAuth('Error getting user data after auth event', error);
              setUser(null);
              setIsLoading(false);
              toast({
                title: "Error",
                description: "There was a problem fetching your profile. Please try refreshing the page.",
                variant: "destructive",
              });
            }
          } else if (event === 'SIGNED_OUT') {
            debugAuth('User signed out');
            setUser(null);
            setIsLoading(false);
          }
        });
        
        authListener = { subscription };
        
        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          debugAuth('Found existing session', { 
            userId: session.user.id, 
            expiresAt: session.expires_at 
          });
          
          try {
            const currentUser = await getCurrentUser();
            debugAuth('User data retrieved for existing session', currentUser);
            setUser(currentUser);
          } catch (userError) {
            debugAuth('Error getting user data for existing session', userError);
            setUser(null);
          }
        } else {
          debugAuth('No active session found');
          setUser(null);
        }
      } catch (error) {
        debugAuth('Error during auth initialization', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      debugAuth('Cleaning up auth listener');
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    debugAuth('Attempting sign in', { email });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        debugAuth('Sign in error', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        debugAuth('Sign in successful', { 
          userId: data.user?.id,
          sessionExpiresAt: data.session?.expires_at
        });
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
      
      return { error };
    } catch (error) {
      debugAuth('Exception during sign in', error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, meta?: { [key: string]: any }) => {
    setIsLoading(true);
    debugAuth('Attempting sign up', { email, meta });
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: meta
        }
      });
      
      if (error) {
        debugAuth('Sign up error', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        debugAuth('Sign up successful');
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
      }
      
      return { error };
    } catch (error) {
      debugAuth('Exception during sign up', error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    debugAuth('Attempting password reset', { email });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        debugAuth('Password reset error', error);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        debugAuth('Password reset email sent');
        toast({
          title: "Password reset initiated",
          description: "Check your email for instructions",
        });
      }
      
      return { error };
    } catch (error) {
      debugAuth('Exception during password reset', error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    debugAuth('Attempting sign out');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        debugAuth('Sign out error', error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        debugAuth('Sign out successful');
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
        setUser(null);
      }
    } catch (error) {
      debugAuth('Exception during sign out', error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
