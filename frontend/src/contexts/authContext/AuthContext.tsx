'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { BasicUser } from '@/interfaces/basicUser';
import api from '../../../axiosInstance';

interface AuthContextType {
  user: BasicUser | null;
  setUser: (user: BasicUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<BasicUser | null>(null);

  const getUser = async () => {
    try {
      const response = await api.get<BasicUser>('/auth/profile');
      setUser(response.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
