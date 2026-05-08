import { memo } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { useAuthStore } from '@/store/auth-store';
import { useAssignment } from '@/context/assignment-context';

/**
 * DashboardLayout — renders AppShell (sidebar + header) once, then
 * renders child routes inside it via <Outlet />.
 * This guarantees the sidebar persists on ALL nested dashboard routes.
 */
export const DashboardLayout = memo(function DashboardLayout() {
  const { targetClientId, targetClientName, clearAssignment } = useAssignment();

  return (
    <AppShell>
      <div className="flex flex-1 flex-col overflow-hidden">
        {targetClientId && (
          <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium">
                  Active Assigned Program For: <span className="text-primary font-bold">{targetClientName}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-bold rounded-xl"
                  onClick={clearAssignment}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="font-black px-6 rounded-xl shadow-lg"
                  onClick={clearAssignment}
                >
                  Save Program
                </Button>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 overflow-y-auto bg-background/50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </AppShell>
  );
});
