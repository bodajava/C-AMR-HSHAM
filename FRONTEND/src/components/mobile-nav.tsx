import { cn } from "@/lib/utils";
import React from "react";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { landingNavLinks } from "@/components/landing-shared";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons";

import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);
	const { user, isLoggedIn, logout } = useAuthStore();

	const handleLogout = () => {
		logout();
		setOpen(false);
		toast.success("Logged out successfully");
	};

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				{open ? (
					<HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4.5" />
				) : (
					<HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-4.5" />
				)}
			</Button>
			{open && (
				<Portal className="top-14" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-4"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-2">
							{landingNavLinks.map((link) => (
								<Button
									asChild
									className="justify-start"
									key={link.label}
									variant="ghost"
									onClick={() => setOpen(false)}
								>
									<Link to={link.href}>{link.label}</Link>
								</Button>
							))}
						</div>
						<div className="mt-12 flex flex-col gap-2">
							{!isLoggedIn ? (
								<>
									<Button asChild className="w-full" variant="outline" onClick={() => setOpen(false)}>
										<Link to="/login">Sign In</Link>
									</Button>
									<Button asChild className="w-full" onClick={() => setOpen(false)}>
										<Link to="/register">Get Started</Link>
									</Button>
								</>
							) : (
								<>
									{(user?.email === (import.meta.env.VITE_ADMIN_EMAIL || "amr917151@gmail.com")) ? (
										<Button asChild className="w-full" variant="ghost" onClick={() => setOpen(false)}>
											<Link to="/admin/workouts">Admin Panel</Link>
										</Button>
									) : (
										<Button asChild className="w-full" variant="ghost" onClick={() => setOpen(false)}>
											<Link to="/dashboard">Dashboard</Link>
										</Button>
									)}
									<Button className="w-full" variant="destructive" onClick={handleLogout}>
										Logout
									</Button>
								</>
							)}
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
