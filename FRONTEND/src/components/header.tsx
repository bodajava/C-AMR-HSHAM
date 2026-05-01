"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { Link, useNavigate } from "react-router-dom";

import { landingNavLinks } from "@/components/landing-shared";
import { useAuthStore } from "@/store/auth-store";

export function Header() {
	const scrolled = useScroll(10);
	const navigate = useNavigate();
	const { isLoggedIn, logout, user } = useAuthStore();
	
	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b transition-all duration-300", {
				"border-border bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/50 py-1":
					scrolled,
				"py-3": !scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-8">
				<Link
					className="text-2xl font-bold tracking-tighter text-primary flex items-center gap-2"
					to="/"
				>
					<Logo className="h-6" />
					<span className="hidden sm:inline">Lumina Coach</span>
				</Link>
				<div className="hidden items-center gap-8 md:flex">
					{landingNavLinks.map((link) => (
						<Link
							className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold tracking-wide"
							to={link.href}
							key={link.label}
						>
							{link.label}
						</Link>
					))}
					<div className="flex items-center gap-3 ml-4">
						{!isLoggedIn ? (
							<>
								<Button asChild size="sm" variant="ghost" className="font-semibold">
									<Link to="/login">Sign In</Link>
								</Button>
								<Button asChild size="sm" className="bg-primary text-primary-foreground rounded-full px-6 font-bold hover:scale-105 transition-transform">
									<Link to="/register">Get Started</Link>
								</Button>
							</>
						) : (
							<>
								{(user?.email === (import.meta.env.VITE_ADMIN_EMAIL || "bbido761@gmail.com")) ? (
									<Button asChild size="sm" variant="ghost" className="font-semibold">
										<Link to="/admin/workouts">Admin Panel</Link>
									</Button>
								) : (
									<Button asChild size="sm" variant="ghost" className="font-semibold">
										<Link to="/philosophy">Philosophy</Link>
									</Button>
								)}
								<Button size="sm" variant="outline" className="rounded-full px-6 font-bold" onClick={handleLogout}>
									Logout
								</Button>
							</>
						)}
					</div>
				</div>
				<div className="flex items-center gap-4 md:hidden">
					{!isLoggedIn ? (
						<Button asChild size="sm" className="bg-primary text-primary-foreground rounded-full px-5 text-xs font-bold">
							<Link to="/register">Join</Link>
						</Button>
					) : (
						<Button size="sm" variant="outline" className="rounded-full px-5 text-xs font-bold" onClick={handleLogout}>
							Logout
						</Button>
					)}
					<MobileNav />
				</div>
			</nav>
		</header>
	);
}
