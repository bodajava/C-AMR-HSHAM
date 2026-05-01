"use client";

import { memo } from "react";
import { Logo } from "@/components/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { footerNavLinks, navGroups } from "@/components/app-shared";
import { NavUser } from "@/components/nav-user";
import { useAuthStore } from "@/store/auth-store";

export const AppSidebar = memo(function AppSidebar() {
	const location = useLocation();
	const { user } = useAuthStore();

	const isActive = (url: string) =>
		location.pathname === url ||
		(url !== "/" && location.pathname.startsWith(url + "/"));

	const filteredGroups = navGroups.filter(group => {
		if (group.roles && (!user || !group.roles.includes(user.role!))) return false;
		return true;
	});

	return (
		<Sidebar
			className="static min-h-full *:data-[slot=sidebar-inner]:bg-background"
			collapsible="offcanvas"
			variant="sidebar"
		>
			<SidebarHeader className="relative h-14 justify-center px-2 py-0">
				<a
					className="rounded-2xl flex h-10 w-max items-center justify-center px-3 hover:bg-muted dark:hover:bg-muted/50"
					href="#link"
				>
					<Logo className="h-4" />
					<span className="sr-only">Efferd</span>
				</a>
			</SidebarHeader>
			<SidebarContent>
				{filteredGroups.map((group, index) => (
					<SidebarGroup key={`sidebar-group-${index}`}>
						{group.label && (
							<SidebarGroupLabel className="font-normal">
								{group.label}
							</SidebarGroupLabel>
						)}
						<SidebarMenu>
							{group.items.filter(item => !item.roles || (user && item.roles.includes(user.role!))).map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={isActive(item.url)}
										tooltip={item.title}
									>
										<Link to={item.url}>
											{item.icon}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter className="gap-0 p-0">
				<SidebarMenu className="border-t p-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className="text-muted-foreground"
								isActive={isActive(item.url)}
								size="sm"
							>
								<Link to={item.url}>
									{item.icon}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
});
