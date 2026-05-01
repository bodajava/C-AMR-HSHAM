import { memo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

/**
 * PublicLayout — renders the landing Header + Footer once, then
 * renders child routes via <Outlet />.
 * This guarantees the top navbar persists on ALL public sub-routes
 * (e.g. any future /about, /pricing, etc.)
 */
export const PublicLayout = memo(function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
});
