
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
    
    const checkUser = async () => {
      setIsLoading(true);
      debugAuth('Checking user session');
      
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          debugAuth('Found existing session', { 
            userId: session.user.id, 
            expiresAt: session.expires_at 
          });
          
          try {
            const currentUser = await getCurrentUser();
            debugAuth('User data retrieved', currentUser);
            setUser(currentUser);
          } catch (userError) {
            debugAuth('Error getting user data', userError);
            setUser(null);
          }
        } else {
          debugAuth('No active session found');
          setUser(null);
        }
      } catch (error) {
        debugAuth('Error checking session', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener before checking session
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      debugAuth(`Auth state changed: ${event}`, { 
        hasSession: session ? true : false,
        userId: session?.user?.id 
      });
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          setIsLoading(true);
          const currentUser = await getCurrentUser();
          debugAuth('User data retrieved after auth event', currentUser);
          setUser(currentUser);
        } catch (error) {
          debugAuth('Error getting user data after auth event', error);
          toast({
            title: "Error",
            description: "There was a problem fetching your profile. Please try refreshing the page.",
            variant: "destructive",
          });
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        debugAuth('User signed out');
        setUser(null);
        setIsLoading(false);
      }
    });

    // Then check the session
    checkUser();

    return () => {
      debugAuth('Cleaning up auth listener');
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    debugAuth('Attempting sign in', { email });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        debugAuth('Sign in error', error);
      } else {
        debugAuth('Sign in successful', { 
          userId: data.user?.id,
          sessionExpiresAt: data.session?.expires_at
        });
      }
      
      return { error };
    } catch (error) {
      debugAuth('Exception during sign in', error);
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
      } else {
        debugAuth('Sign up successful');
      }
      
      return { error };
    } catch (error) {
      debugAuth('Exception during sign up', error);
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
      } else {
        debugAuth('Password reset email sent');
      }
      
      return { error };
    } catch (error) {
      debugAuth('Exception during password reset', error);
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
      } else {
        debugAuth('Sign out successful');
      }
      setUser(null);
    } catch (error) {
      debugAuth('Exception during sign out', error);
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
