import { cn } from "@/lib/utils";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";

type Testimonial = {
	quote: string;
	image: string;
	name: string;
	role: string;
	company?: string;
};

const testimonials: Testimonial[] = [
	{
		quote: "The personalized approach changed everything. I'm not just lifting more; I'm sleeping better and have more energy for my business.",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4Z5stuUUCzpQkOnQRbtdwBjzlsqbmO9hCEVldqjky1mR24c1PGYjTVxipvARRdkiu9geMKkHJlzbIutqHsRtvtdlbyn3z1vCF2Ryh_s6u6FsA7G4VrDQt-4Ezuerqsuu1dlH4SuoQUVe3uV5t50ULrX4_6_TCWV5LYSbD34y2LoqSKVpRnwWnXYyGvGEuFjK00yvuxTPqhCKyThVsr3ATcRSbVyf7zzs-zv3tKVd4H7QoPUaDDXK5mQ78ks4xSjQv6xu3j-z5pLcr",
		name: "Sarah Jenkins",
		role: "CEO",
		company: "TechFlow",
	},
	{
		quote: "Lumina doesn't just give you a plan; they give you the science behind it. The dashboard makes tracking my progress feel like a game.",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ3fGxVjQ-7Mw3YzJty4IXJFJiWtRpeqtNws8QeR-RPzvxZ76obPdvRaPzg4gTMV2eUXEY9q_-s6UYwKZi1C0A1a2REmQeNzO2tCAi3o6YrosyE8lIRHtLr1eYsrBxGJ9Kuqa7vBIhwbMlyvbKrvThxoc0AVpquE2_ZItz0-XTLwYtAV0mOFoqPtr5iAbA4vJFKVERHdbxZWMzHVDP6VMSdrQ877Xc4EkyBT3iKpgpQIVNk4QeyKQSfcRgCNGhPkv3vV0yYUKno83D",
		name: "David Chen",
		role: "Senior Architect",
	},
	{
		quote: "I've tried every coach in the city. None of them match the precision and professionalism I found here at Lumina.",
		image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5hEP--AUBWhFdQ0LGY7uuTjzpjMJl05Mcl180fqs3aX0PJ6RnyK3peZZvq-HeKiGeL5luKj0KOKfuc0yOpNYrUuG4Poa9_85qXOAKqjTRu9H3f-ggNdXwJqGShp4dLmS_y25rOQrE2ufFySD0ebJc91tp80oNm7NYeBRYIirnfsBKm5x4hlsT8byuJaB3uKvtwKWWHdHx6VyLEBDEmrEJgACEFHnoE88LmNWAxAuJgMo-bz4HYtLEzKA7VP9PwXJ_qPqXFr2TDhMr",
		name: "Elena Rodriguez",
		role: "Professional Athlete",
	},
];

export function TestimonialsSection() {
	return (
		<section className="relative py-24 sm:py-32 bg-background">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Proof in Motion</h2>
					<p className="mt-4 text-muted-foreground text-lg">
						Hear from the high-performers who have redefined their standards.
					</p>
				</div>

				<div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
					{testimonials.map((testimonial) => (
						<TestimonialsCard
							key={testimonial.name}
							testimonial={testimonial}
							className="h-full"
						/>
					))}
				</div>
			</div>
		</section>
	);
}

function TestimonialsCard({
	testimonial,
	className,
	...props
}: React.ComponentProps<"figure"> & {
	testimonial: Testimonial;
}) {
	const { quote, image, name, role, company } = testimonial;
	return (
		<figure
			className={cn(
				"w-full max-w-xs rounded-3xl border bg-card p-8 shadow-foreground/10 shadow-lg dark:bg-card/20",
				className
			)}
			{...props}
		>
			<blockquote>{quote}</blockquote>
			<figcaption className="mt-5 flex items-center gap-2">
				<Avatar className="size-8 rounded-full">
					<AvatarImage alt={`${name}'s profile picture`} src={image} />
					<AvatarFallback>{name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<cite className="font-medium not-italic leading-5 tracking-tight">
						{name}
					</cite>
					<span className="text-muted-foreground text-sm leading-5 tracking-tight">
						{role} {company && `, ${company}`}
					</span>
				</div>
			</figcaption>
		</figure>
	);
}
