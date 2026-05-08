"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, SparklesIcon, UserIcon, Notification03Icon, CreditCardIcon, Settings01Icon, CustomerSupportIcon, Logout02Icon } from "@hugeicons/core-free-icons";

import { useAuthStore } from "@/store/auth-store";
import { Link, useNavigate } from "react-router-dom";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();

	if (!user) return null;

	const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
	const avatarUrl = user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`;

	return (
		<SidebarMenu className="border-t p-2">
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="text-muted-foreground">
							<Avatar className="size-5">
								<AvatarImage alt={fullName} src={avatarUrl} />
								<AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
							</Avatar>
							<span className="font-medium text-sm">
								{user.firstName || fullName.split(" ")[0]}
							</span>
							<HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} className="ml-auto size-3!" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="min-w-48"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link to="/#pricing" className="cursor-pointer">
									<HugeiconsIcon icon={SparklesIcon} strokeWidth={2} />
									Upgrade to Pro
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link to="/dashboard/settings" className="cursor-pointer">
									<HugeiconsIcon icon={UserIcon} strokeWidth={2} />
									Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="opacity-50 cursor-not-allowed">
								<HugeiconsIcon icon={Notification03Icon} strokeWidth={2} />
								Notifications
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/#pricing" className="cursor-pointer">
									<HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
									Billing
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/dashboard/settings" className="cursor-pointer">
									<HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
									Settings
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="opacity-50 cursor-not-allowed">
								<HugeiconsIcon icon={CustomerSupportIcon} strokeWidth={2} />
								Help Center
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem 
							variant="destructive" 
							onClick={() => {
								logout();
								navigate("/");
							}}
						>
							<HugeiconsIcon icon={Logout02Icon} strokeWidth={2} />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
