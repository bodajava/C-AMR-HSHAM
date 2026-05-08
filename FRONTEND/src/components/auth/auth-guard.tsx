import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { userApi } from "@/api/user";
import { requestForToken } from "@/utils/firebase";

import { RoleEnum } from "@/types/roles";
import { isAdminEmail } from "@/constants";

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
      const userRole = Number(user.role);
      const userEmail = user.email?.toLowerCase().trim();
      const isAdminRoute = allowedRoles.includes(RoleEnum.ADMIN);

      // Strict Admin check: Role must be ADMIN/COACH AND Email must be in whitelist for ADMIN routes
      if (isAdminRoute) {
        if (userRole !== RoleEnum.ADMIN && userRole !== RoleEnum.COACH) {
          navigate("/dashboard");
          return;
        }
        if (!isAdminEmail(userEmail)) {
          navigate("/dashboard");
          return;
        }
      } else if (!allowedRoles.includes(userRole as RoleEnum)) {
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
  // if (allowedRoles && user && !allowedRoles.includes(user.role!)) return null;

  return <>{children}</>;
}
