import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { PublicLayout } from "./layouts/public-layout";
import { AuthGuard } from "./components/auth/auth-guard";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ── Non-lazy imports for core pages to avoid hydration/suspense issues during debug ────
import { AssignmentProvider } from './context/assignment-context';
import HomePage from "./pages/public/home";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import VerifyOTPPage from "./pages/auth/verify-otp";

// ── Lazy-loaded dashboard pages ──────────────────────────────────────────────
const DashboardPage   = lazy(() => import("./pages/client/dashboard"));
const WorkoutsPage    = lazy(() => import("./pages/client/workouts"));
const DayPage         = lazy(() => import("./pages/client/day-page"));
const MealsPage       = lazy(() => import("./pages/client/meals"));
const MealDetailPage  = lazy(() => import("./pages/client/meal-detail"));
const ProgressPage    = lazy(() => import("./pages/client/progress"));
const CommunityPage   = lazy(() => import("./pages/client/community"));
const SettingsPage    = lazy(() => import("./pages/client/settings"));
const AdminWorkoutsPage = lazy(() => import("./pages/admin/workouts"));
const AdminMealsPage    = lazy(() => import("./pages/admin/meals"));
const AdminMetricsPage  = lazy(() => import("./pages/admin/metrics"));
const AdminPlansPage    = lazy(() => import("./pages/admin/plans"));
const AdminWeeklyPlanPage = lazy(() => import("./pages/admin/weekly-plan"));
const AdminClientProgramPage = lazy(() => import("./pages/admin/client-program"));
const AdminClientsPage    = lazy(() => import("./pages/admin/clients"));
const SubscriptionSuccessPage = lazy(() => import("./pages/subscription/success"));
const SubscriptionCancelPage  = lazy(() => import("./pages/subscription/cancel"));
const PhilosophyPage          = lazy(() => import("./pages/client/philosophy"));
const NotFoundPage            = lazy(() => import("./pages/public/not-found"));

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
            <AssignmentProvider>
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
                    <Route path="weekly-plan" element={<AdminWeeklyPlanPage />} />
                    <Route path="clients/:clientId/program" element={<AdminClientProgramPage />} />
                    <Route path="clients"  element={<AdminClientsPage />} />
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

                  {/* ── 404 Fallback ────────────────────────────────────────── */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </AssignmentProvider>
          </Router>
        </TooltipProvider>
    </GoogleOAuthProvider>
  );
}
