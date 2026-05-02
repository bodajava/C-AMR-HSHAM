import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { userApi } from "@/lib/api-client";
import { requestForToken } from "@/lib/firebase";

import { RoleEnum } from "@/types/roles";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: RoleEnum[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, token, setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (token && user && allowedRoles) {
      const isAdminRoute = allowedRoles.includes(RoleEnum.ADMIN);
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "amr917151@gmail.com";
      
      if (isAdminRoute && user.email !== adminEmail) {
        navigate("/dashboard");
        return;
      }

      if (!allowedRoles.includes(user.role!)) {
        navigate("/dashboard");
        return;
      }
    }

    // Register FCM Token
    const registerNotifications = async () => {
      const fcmToken = await requestForToken();
      if (fcmToken) {
        try {
          await userApi.registerFcmToken(fcmToken);
        } catch (e) {
          console.error("FCM registration failed:", e);
        }
      }
    };

    // Refresh user profile data to ensure it's up to date
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        setAuth(response.data, token, useAuthStore.getState().refreshToken!);
        registerNotifications();
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    if (token && !user) {
      fetchProfile();
    }
  }, [token, user, navigate, setAuth]);

  if (!token) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role!)) return null;

  return <>{children}</>;
}
