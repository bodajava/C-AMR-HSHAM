import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";

export function ProgramsSection() {
	return (
		<section className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-900/50" id="programs">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Select Your Path</h2>
					<p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
						Specialized systems for every stage of your journey.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
					{/* Apex Protocol */}
					<Link to="/workouts" className="md:col-span-8 group relative rounded-2xl overflow-hidden border bg-background shadow-sm transition-all hover:shadow-md cursor-pointer">
						<img 
							src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop" 
							alt="Apex Protocol"
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
						<div className="absolute bottom-0 left-0 p-8 text-white">
							<h3 className="text-2xl font-bold mb-2">The Apex Protocol</h3>
							<p className="text-sm opacity-90 max-w-md mb-6">
								Advanced strength and hypertrophy training for experienced athletes.
							</p>
							<Button variant="secondary" size="sm" className="rounded-full pointer-events-none">
								View Program
							</Button>
						</div>
					</Link>

					{/* Vitality Fuel */}
					<Link to="/meals" className="md:col-span-4 group relative rounded-2xl overflow-hidden border bg-background shadow-sm transition-all hover:shadow-md cursor-pointer">
						<img 
							src="https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop" 
							alt="Vitality Fuel"
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
						<div className="absolute bottom-0 left-0 p-6 text-white">
							<h3 className="text-xl font-bold mb-1">Vitality Fuel</h3>
							<p className="text-xs opacity-90">Personalized nutrition architecture.</p>
						</div>
					</Link>

					{/* Kinetic Reset */}
					<div className="md:col-span-4 group relative rounded-2xl overflow-hidden border bg-background shadow-sm transition-all hover:shadow-md">
						<img 
							src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop" 
							alt="Kinetic Reset"
							className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
						<div className="absolute bottom-0 left-0 p-6 text-white">
							<h3 className="text-xl font-bold mb-1">Kinetic Reset</h3>
							<p className="text-xs opacity-90">Mobility and recovery optimization.</p>
						</div>
					</div>

					{/* Assessment */}
					<div className="md:col-span-8 flex flex-col justify-center rounded-2xl border bg-white dark:bg-slate-950 p-10 shadow-sm transition-all hover:shadow-md">
						<h3 className="text-2xl font-bold text-primary mb-4">Not sure where to start?</h3>
						<p className="text-muted-foreground mb-8 max-w-lg">
							Take our 2-minute assessment and our algorithm will suggest the perfect protocol for your goals and lifestyle.
						</p>
						<a 
							href="#" 
							className="inline-flex items-center gap-2 font-bold text-primary hover:underline group"
						>
							Start Assessment
							<HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} className="size-4 transition-transform group-hover:translate-x-1" />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
