import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStudent: (registerNo: string, password: string) => Promise<void>;
  loginStaff: (employeeId: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  updateUserProfile: (updatedData: Partial<User>) => Promise<User>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('smart_campus_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smart_campus_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveAuthData = (newToken: string, userObj: User) => {
    setToken(newToken);
    setUser(userObj);
    localStorage.setItem('smart_campus_token', newToken);
    localStorage.setItem('smart_campus_user', JSON.stringify(userObj));
  };

  useEffect(() => {
    const initAuth = async () => {
      let currentToken = token;

      if (currentToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            const fetchedUser = res.data.data;
            const userObj: User = {
              id: fetchedUser.id,
              name: fetchedUser.name,
              email: fetchedUser.email,
              role: fetchedUser.role,
              avatar: fetchedUser.avatar,
              registerNo: fetchedUser.registerNo || fetchedUser.studentProfile?.registerNo,
              employeeId: fetchedUser.employeeId || fetchedUser.staffProfile?.employeeId,
              department: fetchedUser.department || fetchedUser.studentProfile?.department || fetchedUser.staffProfile?.department || fetchedUser.adminProfile?.department,
              phone: fetchedUser.phone || fetchedUser.studentProfile?.phone || fetchedUser.staffProfile?.phone || fetchedUser.adminProfile?.phone,
              year: fetchedUser.year || fetchedUser.studentProfile?.year,
              college: fetchedUser.college || fetchedUser.studentProfile?.college,
              position: fetchedUser.position || fetchedUser.staffProfile?.position
            };
            setUser(userObj);
            localStorage.setItem('smart_campus_user', JSON.stringify(userObj));
          }
        } catch (e) {
          console.error('Session verify failed', e);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loginStudent = async (registerNo: string, password: string) => {
    try {
      const res = await api.post('/auth/student/login', { registerNo, password });
      if (res.data.success) {
        saveAuthData(res.data.data.token, res.data.data.user);
      } else {
        throw new Error(res.data.message || 'Login failed.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed. Check your credentials.';
      throw new Error(message);
    }
  };

  const loginStaff = async (employeeId: string, password: string) => {
    try {
      const res = await api.post('/auth/staff/login', { employeeId, password });
      if (res.data.success) {
        saveAuthData(res.data.data.token, res.data.data.user);
      } else {
        throw new Error(res.data.message || 'Login failed.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed. Check your credentials.';
      throw new Error(message);
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/admin/login', { email, password });
      if (res.data.success) {
        saveAuthData(res.data.data.token, res.data.data.user);
      } else {
        throw new Error(res.data.message || 'Login failed.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed. Check your credentials.';
      throw new Error(message);
    }
  };

  const updateUserProfile = async (updatedData: Partial<User>): Promise<User> => {
    try {
      const res = await api.put('/auth/profile', updatedData);
      if (res.data.success) {
        const updatedUserObj: User = res.data.data;
        setUser(updatedUserObj);
        localStorage.setItem('smart_campus_user', JSON.stringify(updatedUserObj));
        return updatedUserObj;
      } else {
        throw new Error(res.data.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update profile.';
      throw new Error(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('smart_campus_token');
    localStorage.removeItem('smart_campus_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user ? user.role : null,
        isAuthenticated: !!token && !!user,
        isLoading,
        loginStudent,
        loginStaff,
        loginAdmin,
        updateUserProfile,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
