import { memo } from "react";
import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/app-shell";

/**
 * DashboardLayout — renders AppShell (sidebar + header) once, then
 * renders child routes inside it via <Outlet />.
 * This guarantees the sidebar persists on ALL nested dashboard routes.
 */
export const DashboardLayout = memo(function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
});
