
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'));
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock implementation - will be replaced with real implementation
    setLoading(true);
    try {
      // Here we'd make the actual login API call
      console.log("Login with:", email, password);
      const user = await getCurrentUser();
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock implementation - will be replaced with real implementation
    setLoading(true);
    try {
      // Here we'd make the actual signup API call
      console.log("Signup with:", email, password, name);
      const user = await getCurrentUser();
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to signup'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Mock implementation - will be replaced with real implementation
    setLoading(true);
    try {
      // Here we'd make the actual logout API call
      console.log("Logging out");
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to logout'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    // Mock implementation - will be replaced with real implementation
    setLoading(true);
    try {
      // Here we'd make the actual reset password API call
      console.log("Reset password for:", email);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset password'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
