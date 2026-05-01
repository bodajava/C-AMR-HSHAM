import { HugeiconsIcon } from "@hugeicons/react";
import { 
	DashboardSquare01Icon, 
	Analytics02Icon, 
	Settings01Icon, 
	Dumbbell01Icon,
	AppleIcon,
	CreditCardIcon,
} from "@hugeicons/core-free-icons";

import { RoleEnum } from "@/types/roles";

export type SidebarNavItem = {
	title: string;
	url: string;
	icon: React.ReactNode;
	isActive?: boolean;
	roles?: RoleEnum[];
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
	roles?: RoleEnum[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Admin Controls",
		roles: [RoleEnum.ADMIN, RoleEnum.COACH],
		items: [
			{
				title: "Manage Workouts",
				url: "/admin/workouts",
				icon: <HugeiconsIcon icon={Dumbbell01Icon} strokeWidth={2} />,
			},
			{
				title: "Manage Meals",
				url: "/admin/meals",
				icon: <HugeiconsIcon icon={AppleIcon} strokeWidth={2} />,
			},
			{
				title: "Manage Plans",
				url: "/admin/plans",
				icon: <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />,
			},
			{
				title: "Manage Metrics",
				url: "/admin/metrics",
				icon: <HugeiconsIcon icon={Analytics02Icon} strokeWidth={2} />,
			},
		],
	},
	{
		label: "Training",
		items: [
			{
				title: "Overview",
				url: "/dashboard",
				icon: <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />,
				isActive: true,
			},
			{
				title: "Workouts",
				url: "/dashboard/workouts",
				icon: <HugeiconsIcon icon={Dumbbell01Icon} strokeWidth={2} />,
			},
			{
				title: "Meals",
				url: "/dashboard/meals",
				icon: <HugeiconsIcon icon={AppleIcon} strokeWidth={2} />,
			},
			// {
			// 	title: "Progress",
			// 	url: "/dashboard/progress",
			// 	icon: <HugeiconsIcon icon={Analytics02Icon} strokeWidth={2} />,
			// },
		],
	},
	// {
	// 	label: "Community",
	// 	items: [
	// 		{
	// 			title: "Feed",
	// 			url: "/dashboard/community",
	// 			icon: <HugeiconsIcon icon={UserMultipleIcon} strokeWidth={2} />,
	// 		},
	// 	],
	// },
	{
		label: "System",
		items: [
			{
				title: "Settings",
				url: "/dashboard/settings",
				icon: <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />,
			},
		],
	},
	{
		label: "Weekly Plan",
		items: [
			{ title: "Monday", url: "/dashboard/workouts/monday", icon: <div className="h-2 w-2 rounded-full bg-primary" /> },
			{ title: "Tuesday", url: "/dashboard/workouts/tuesday", icon: <div className="h-2 w-2 rounded-full bg-primary" /> },
			{ title: "Wednesday", url: "/dashboard/workouts/wednesday", icon: <div className="h-2 w-2 rounded-full bg-primary" /> },
			{ title: "Thursday", url: "/dashboard/workouts/thursday", icon: <div className="h-2 w-2 rounded-full bg-primary" /> },
			{ title: "Friday", url: "/dashboard/workouts/friday", icon: <div className="h-2 w-2 rounded-full bg-primary" /> },
			{ title: "Saturday", url: "/dashboard/workouts/saturday", icon: <div className="h-2 w-2 rounded-full bg-primary" /> },
			{ title: "Sunday", url: "/dashboard/workouts/sunday", icon: <div className="h-2 w-2 rounded-full bg-primary" /> },
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	// {
	// 	title: "Feedback",
	// 	url: "/feedback",
	// 	icon: <HugeiconsIcon icon={Navigation03Icon} strokeWidth={2} />,
	// },
	// {
	// 	title: "Help Center",
	// 	url: "/help",
	// 	icon: <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />,
	// },
	// {
	// 	title: "Documentation",
	// 	url: "/docs",
	// 	icon: <HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} />,
	// },
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) => group.items),
	...footerNavLinks,
];
