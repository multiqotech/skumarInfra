"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Configure Axios globally to always send cookies with every request
  axios.defaults.withCredentials = true;

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API}/api/career/auth/me`);
      setUser(res.data);
      if (res.data) {
        try {
          const profileRes = await axios.get(`${API}/api/career/auth/profile`);
          setProfile(profileRes.data);
        } catch (profileErr) {
          console.error("Error fetching profile on checkAuth", profileErr);
        }
      }
    } catch (error) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await axios.get(`${API}/api/career/auth/profile`);
      setProfile(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching profile", error);
      setProfile(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const isMultipart = profileData instanceof FormData;
      const headers = isMultipart ? { "Content-Type": "multipart/form-data" } : {};
      const res = await axios.put(`${API}/api/career/auth/profile`, profileData, { headers });
      setProfile(res.data.candidate);
      if (res.data.profileCompleted && user) {
        setUser(prev => ({ ...prev, profileCompleted: true }));
      }
      return { success: true, profile: res.data.candidate };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Profile update failed" };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/api/career/auth/login`, {
        email,
        password,
      });
      setUser(res.data);
      try {
        const profileRes = await axios.get(`${API}/api/career/auth/profile`);
        setProfile(profileRes.data);
      } catch (e) {}
      router.push("/");
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post(`${API}/api/career/auth/signup`, {
        name,
        email,
        password,
      });
      setUser(res.data);
      setProfile(null);
      router.push("/");
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/api/career/auth/logout`);
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setUser(null);
      setProfile(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, profile, profileLoading, fetchProfile, updateProfile, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
