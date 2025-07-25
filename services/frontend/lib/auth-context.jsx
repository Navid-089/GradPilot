"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerUser,
  loginMentor,
  registerMentor,
  logoutUser,
  getCurrentUser,
} from "@/lib/auth-service";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAuthenticatedMentor: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  loginAsMentor: async () => {},
  registerAsMentor: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      console.log(response);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsMentor = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await loginMentor(email, password);
      console.log(response);
      setMentor(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Mentor login error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await registerUser(userData);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const registerAsMentor = async (userData) => {
    setIsLoading(true);
    try {
      const response = await registerMentor(userData);
      setMentor(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Mentor registration error:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setMentor(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        mentor,
        isAuthenticated: !!user,
        isAuthenticatedMentor: !!mentor,
        isLoading,
        login,
        register,
        loginAsMentor,
        registerAsMentor,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
