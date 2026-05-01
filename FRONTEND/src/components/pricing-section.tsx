import { FullWidthDivider } from "@/components/ui/full-width-divider";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import { subscriptionApi } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

type PricingPlan = {
	_id: string;
	name: string;
	price: number | string;
	period?: string;
	description: string;
	features: string[];
	isPopular?: boolean;
	buttonText?: string;
};

export function PricingSection() {
	const [plans, setPlans] = useState<PricingPlan[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPlans = async () => {
			try {
				const response: any = await subscriptionApi.getPlans();
				if (response.data && response.data.length > 0) {
					setPlans(response.data);
				}
			} catch (error) {
				console.error("Failed to fetch plans:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchPlans();
	}, []);

	return (
		<section className="mx-auto min-h-screen max-w-5xl place-content-center border-x py-4" id="pricing">
			<div className="relative">
				<FullWidthDivider position="top" />
				<FullWidthDivider position="bottom" />

				<div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
					<div className="flex flex-col bg-background p-8 md:col-span-2">
						<p className="mb-6 text-muted-foreground text-sm uppercase tracking-wider">
							INVESTMENT IN EXCELLENCE
						</p>
						<h1 className="font-bold text-3xl leading-tight md:text-5xl">
							Choose the tier that aligns with your ambition.
						</h1>
					</div>

					{isLoading ? (
						<div className="col-span-2 flex items-center justify-center p-12">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
						</div>
					) : (
						plans.map((plan, index) => (
							<PricingCard key={plan._id} plan={{...plan, isPopular: index === 1}} />
						))
					)}
				</div>
			</div>
		</section>
	);
}

function PricingCard({ plan }: { plan: PricingPlan }) {
	const [isLoading] = useState(false);

	const handleCheckout = async () => {
		const WHATSAPP_NUMBER = "+96893865045";
		const message = `I want to subscribe to the ${plan.name} plan`;
		const encodedMessage = encodeURIComponent(message);
		const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
		
		window.open(whatsappUrl, '_blank');
	};

	return (
		<div className="flex flex-col bg-background *:px-4 *:py-6">
			<div className="border-b">
				<p className="mb-6 text-muted-foreground text-sm uppercase tracking-wider">
					{plan.name}
				</p>
				<div className="mb-2 flex items-baseline gap-2">
					<h2 className="font-bold text-4xl">${plan.price}</h2>
					<span className="text-muted-foreground text-xs">/ month</span>
				</div>
				<p className="mb-8 line-clamp-2 text-muted-foreground text-sm min-h-[40px]">
					{plan.description}
				</p>

				<Button
					className="w-full"
					variant={plan.isPopular ? "default" : "outline"}
					onClick={handleCheckout}
					disabled={isLoading}
				>
					{isLoading ? "Processing..." : plan.buttonText || "Get started"}
				</Button>
			</div>

			<div className="space-y-3 text-muted-foreground text-sm">
				<p className="mb-6 text-xs uppercase">INCLUDES:</p>

				{plan.features.map((feature) => (
					<p
						className="flex items-center gap-2 text-foreground/80 text-sm"
						key={feature}
					>
						<HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4 shrink-0 text-primary" />
						{feature}
					</p>
				))}
			</div>
		</div>
	);
}
