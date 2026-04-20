import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  can: {
    addStudent: boolean;
    editStudent: boolean;
    deleteStudent: boolean;
    addActivity: boolean;
    editActivity: boolean;
    deleteActivity: boolean;
    addTeacher: boolean;
    editTeacher: boolean;
    deleteTeacher: boolean;
    manageAttendance: boolean;
    managePayments: boolean;
    manageAgreements: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('GUARDIAN_TOKEN');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem('GUARDIAN_TOKEN');
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('GUARDIAN_TOKEN');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    const { access_token, user: userData } = await res.json();
    localStorage.setItem('GUARDIAN_TOKEN', access_token);
    setUser(userData);
  };

  const signup = async (email: string, password: string, role: string, firstName: string, lastName: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, firstName, lastName }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Signup failed');
    }

    const { access_token, user: userData } = await res.json();
    localStorage.setItem('GUARDIAN_TOKEN', access_token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('GUARDIAN_TOKEN');
    setUser(null);
  };

  const hasRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  };

  // Compute permissions based on user role
  const getPermissions = () => {
    if (!user) {
      return {
        addStudent: false,
        editStudent: false,
        deleteStudent: false,
        addActivity: false,
        editActivity: false,
        deleteActivity: false,
        addTeacher: false,
        editTeacher: false,
        deleteTeacher: false,
        manageAttendance: false,
        managePayments: false,
        manageAgreements: false,
      };
    }

    const isAdmin = user.role === 'admin';
    const isTeacher = user.role === 'teacher';
    const isStudent = user.role === 'student';

    return {
      addStudent: isAdmin, // Only ADMIN can create students
      editStudent: isAdmin || isStudent, // ADMIN or own profile (STUDENT)
      deleteStudent: isAdmin, // Only ADMIN can delete
      addActivity: isAdmin || isTeacher, // TEACHER or ADMIN
      editActivity: isAdmin || isTeacher, // TEACHER or ADMIN
      deleteActivity: isAdmin || isTeacher, // TEACHER or ADMIN
      addTeacher: isAdmin, // Only ADMIN
      editTeacher: isAdmin, // Only ADMIN
      deleteTeacher: isAdmin, // Only ADMIN
      manageAttendance: isAdmin || isTeacher, // TEACHER or ADMIN
      managePayments: isAdmin || isTeacher, // TEACHER or ADMIN
      manageAgreements: isAdmin || isTeacher, // TEACHER or ADMIN
    };
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, hasRole, can: getPermissions() }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
