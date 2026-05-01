import { memo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { navLinks } from "@/components/app-shared";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Notification03Icon, CustomerSupportIcon } from "@hugeicons/core-free-icons";
import { useLocation } from "react-router-dom";

export const AppHeader = memo(function AppHeader() {
  const location = useLocation();

  // Exact match first, then startsWith for nested routes (e.g. /workouts/monday)
  const activeItem =
    navLinks.find((item) => item.url === location.pathname) ??
    navLinks.find((item) => item.url !== "/" && location.pathname.startsWith(item.url + "/")) ??
    navLinks.find((item) => item.url !== "/" && location.pathname.startsWith(item.url));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/80 backdrop-blur-md px-4 md:px-8"
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Separator
          className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-2">
        <Button aria-label="Search" size="icon" variant="ghost">
          <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
        </Button>
        <Button aria-label="Notifications" size="icon" variant="ghost">
          <HugeiconsIcon icon={Notification03Icon} strokeWidth={2} />
        </Button>
        <Button aria-label="Support" size="icon" variant="ghost">
          <HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={2} />
        </Button>
      </div>
    </header>
  );
});
