import { cn } from "@/lib/utils";
import { LazyImage } from "@/components/lazy-image";
import { FullWidthDivider } from "@/components/ui/full-width-divider";

type BlogType = {
	title: string;
	href: string;
	description: string;
	author: string;
	createdAt: string;
	readTime: string;
	image: string;
};

const blogs: BlogType[] = [
	{
		title: "Design Systems That Scale",
		href: "#",
		description:
			"Learn how to build and maintain scalable design systems that empower teams to move faster while staying consistent.",
		image: "https://storage.efferd.com/creative/beams.webp",
		createdAt: "2025-08-25",
		author: "Ava Mitchell",
		readTime: "7 min read",
	},
	{
		title: "The Psychology of Color in UI",
		href: "#",
		description:
			"Explore how different colors influence user perception, emotion, and conversion in digital product design.",
		image: "https://storage.efferd.com/creative/plasma.webp",
		createdAt: "2025-07-14",
		author: "Liam Carter",
		readTime: "5 min read",
	},
	{
		title: "Microinteractions That Delight",
		href: "#",
		description:
			"Discover how subtle animations and interactions can enhance usability and bring joy to your users.",
		image: "https://storage.efferd.com/creative/ripple-grid.webp",
		createdAt: "2025-06-30",
		author: "Sophia Kim",
		readTime: "6 min read",
	},
	{
		title: "Accessibility Beyond Compliance",
		href: "#",
		description:
			"Practical steps to make your UI accessible, not just legally compliant, but genuinely inclusive for everyone.",
		image: "https://storage.efferd.com/creative/silk.webp",
		createdAt: "2025-06-18",
		author: "Ethan Rodriguez",
		readTime: "8 min read",
	},
	{
		title: "Dark Mode Done Right",
		href: "#",
		description:
			"Tips and tricks to design beautiful and functional dark mode experiences that users will love.",
		image: "https://storage.efferd.com/creative/dark-veil.webp",
		createdAt: "2025-05-20",
		author: "Maya Chen",
		readTime: "4 min read",
	},
	{
		title: "Typography That Speaks",
		href: "#",
		description:
			"How to select and pair typefaces that enhance readability, hierarchy, and brand personality.",
		image: "https://storage.efferd.com/creative/threads.webp",
		createdAt: "2025-05-02",
		author: "Noah Patel",
		readTime: "9 min read",
	},
	{
		title: "The Future of UI Animation",
		href: "#",
		description:
			"From motion guidelines to advanced prototyping—discover where UI animation is headed in 2025.",
		image: "https://storage.efferd.com/creative/hyperspeed.webp",
		createdAt: "2025-04-15",
		author: "Chloe Ramirez",
		readTime: "10 min read",
	},
	{
		title: "Minimalism vs Maximalism",
		href: "#",
		description:
			"A deep dive into two opposing design philosophies and how to decide which fits your product.",
		image: "https://storage.efferd.com/creative/pixel-blast.webp",
		createdAt: "2025-04-01",
		author: "Benjamin Scott",
		readTime: "6 min read",
	},
	{
		title: "Designing for Mobile-First",
		href: "#",
		description:
			"Best practices for mobile-first design, from layout decisions to performance optimization.",
		image: "https://storage.efferd.com/creative/floating-lines.webp",
		createdAt: "2025-03-22",
		author: "Isabella White",
		readTime: "7 min read",
	},
	{
		title: "Figma Hacks for Power Users",
		href: "#",
		description:
			"Hidden features, shortcuts, and workflows in Figma that can dramatically speed up your design process.",
		image: "https://storage.efferd.com/creative/color-bends.webp",
		createdAt: "2025-03-09",
		author: "James Walker",
		readTime: "5 min read",
	},
	{
		title: "Designing With AI Tools",
		href: "#",
		description:
			"A practical look at how AI tools are shaping UI/UX workflows—from ideation to final delivery.",
		image: "https://storage.efferd.com/creative/light-rays.webp",
		createdAt: "2025-02-28",
		author: "Olivia Brooks",
		readTime: "8 min read",
	},
	{
		title: "The Art of Prototyping",
		href: "#",
		description:
			"How to create prototypes that effectively communicate your ideas and speed up stakeholder feedback.",
		image: "https://storage.efferd.com/creative/orb.webp",
		createdAt: "2025-02-14",
		author: "Daniel Green",
		readTime: "6 min read",
	},
];

export function BlogsSection() {
	return (
		<div className="mx-auto w-full max-w-5xl grow">
			<div className="space-y-1 px-4 py-8 md:px-6">
				<h1 className="font-semibold text-2xl tracking-wide md:text-4xl">
					Blog Section
				</h1>
				<p className="text-muted-foreground text-sm md:text-base">
					Discover the latest trends and insights in the world of design and
					technology.
				</p>
			</div>
			<FullWidthDivider contained={true} />
			<div className="z-10 grid p-4 md:grid-cols-2 lg:grid-cols-3">
				{blogs.map((blog) => (
					<BlogCard {...blog} key={blog.title} />
				))}
			</div>
		</div>
	);
}

function BlogCard({
	title,
	description,
	createdAt,
	readTime,
	image,
	author,
	className,
	...props
}: React.ComponentProps<"a"> & BlogType) {
	return (
		<a
			className={cn(
				"rounded-2xl group flex flex-col gap-2 p-3 hover:bg-muted/50 active:bg-muted",
				className
			)}
			key={title}
			{...props}
		>
			<LazyImage
				alt={title}
				className="transition-all duration-500 group-hover:scale-105"
				containerClassName="cn-rounded shadow-md outline outline-offset-3 outline-border/50"
				fallback="https://placehold.co/640x360?text=fallback-image"
				inView={true}
				ratio={16 / 9}
				src={image}
			/>
			<div className="space-y-2 px-2 pb-2">
				<div className="flex items-center gap-2 text-[11px] text-muted-foreground group-hover:text-foreground sm:text-xs">
					<p>by {author}</p>
					<div className="size-1 rounded-full bg-muted-foreground" />
					<p>{createdAt}</p>
					<div className="size-1 rounded-full bg-muted-foreground" />
					<p>{readTime}</p>
				</div>
				<h2 className="line-clamp-2 font-semibold text-lg">{title}</h2>
				<p className="line-clamp-3 text-muted-foreground text-sm group-active:text-foreground">
					{description}
				</p>
			</div>
		</a>
	);
}
