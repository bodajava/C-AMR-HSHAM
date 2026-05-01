import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { PublicLayout } from "./layouts/public-layout";
import { AuthGuard } from "./components/auth-guard";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ── Non-lazy imports for core pages to avoid hydration/suspense issues during debug ────
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import VerifyOTPPage from "./pages/verify-otp";

// ── Lazy-loaded dashboard pages ──────────────────────────────────────────────
const DashboardPage   = lazy(() => import("./pages/dashboard"));
const WorkoutsPage    = lazy(() => import("./pages/workouts"));
const DayPage         = lazy(() => import("./pages/day-page"));
const MealsPage       = lazy(() => import("./pages/meals"));
const MealDetailPage  = lazy(() => import("./pages/meal-detail"));
const ProgressPage    = lazy(() => import("./pages/progress"));
const CommunityPage   = lazy(() => import("./pages/community"));
const SettingsPage    = lazy(() => import("./pages/settings"));
const AdminWorkoutsPage = lazy(() => import("./pages/admin/workouts"));
const AdminMealsPage    = lazy(() => import("./pages/admin/meals"));
const AdminMetricsPage  = lazy(() => import("./pages/admin/metrics"));
const AdminPlansPage    = lazy(() => import("./pages/admin/plans"));
const SubscriptionSuccessPage = lazy(() => import("./pages/subscription/success"));
const SubscriptionCancelPage  = lazy(() => import("./pages/subscription/cancel"));
const PhilosophyPage          = lazy(() => import("./pages/philosophy"));

import { RoleEnum } from "@/types/roles";

function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh]" aria-label="Loading…">
      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "798161535011-ea65kahdtke6sjstdpg0ha7efkjn866c.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <TooltipProvider>
        <Toaster richColors closeButton position="top-right" />
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Auth pages ────────────────────────────────────────────── */}
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOTPPage />} />

              {/* ── Public / Landing ───────────────────────────────────────── */}
              <Route element={<PublicLayout />}>
                <Route path="/"                  element={<HomePage />} />
                <Route path="/workouts"          element={<WorkoutsPage />} />
                <Route path="/workouts/:day"     element={<DayPage />} />
                <Route path="/meals"             element={<MealsPage />} />
                <Route path="/meals/:mealId"     element={<MealDetailPage />} />
                <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
                <Route path="/subscription/cancel"  element={<SubscriptionCancelPage />} />
                <Route path="/philosophy"           element={<PhilosophyPage />} />
              </Route>

              {/* ── Admin Dashboard ───────────────────────────────────────── */}
              <Route 
                path="/admin" 
                element={
                  <AuthGuard allowedRoles={[RoleEnum.ADMIN, RoleEnum.COACH]}>
                    <DashboardLayout />
                  </AuthGuard>
                }
              >
                <Route path="workouts" element={<AdminWorkoutsPage />} />
                <Route path="meals"    element={<AdminMealsPage />} />
                <Route path="metrics"  element={<AdminMetricsPage />} />
                <Route path="plans"    element={<AdminPlansPage />} />
              </Route>

              {/* ── User Dashboard ────────────────────────────────────────── */}
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard>
                    <DashboardLayout />
                  </AuthGuard>
                }
              >
                <Route index                      element={<DashboardPage />} />
                <Route path="workouts"           element={<WorkoutsPage />} />
                <Route path="workouts/:day"      element={<DayPage />} />
                <Route path="meals"              element={<MealsPage />} />
                <Route path="meals/:mealId"      element={<MealDetailPage />} />
                <Route path="progress"           element={<ProgressPage />} />
                <Route path="community"          element={<CommunityPage />} />
                <Route path="settings"           element={<SettingsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </TooltipProvider>
    </GoogleOAuthProvider>
  );
}
