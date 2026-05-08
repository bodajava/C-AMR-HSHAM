import { FullWidthDivider } from "@/components/ui/full-width-divider";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

export function CallToAction() {
	return (
		<div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-6 border-x bg-secondary/80 px-2 py-8 md:px-4 dark:bg-secondary/40">
			<FullWidthDivider className="-top-px" />

			<div className="space-y-1">
				<h2 className="text-center font-semibold text-2xl tracking-tight md:text-4xl">
					Ready to define your new standard?
				</h2>
				<p className="text-balance text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
					Join an elite community of high-performers. Spots are limited to ensure the highest quality of personalized coaching.
				</p>
			</div>
			<div className="flex items-center justify-center gap-2">
				<Button asChild size="lg" className="rounded-full px-12 py-6 text-lg">
					<a href="/login">
						Apply for Coaching{" "}
						<HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} data-icon="inline-end" />
					</a>
				</Button>
			</div>


			<FullWidthDivider className="-bottom-px" />
		</div>
	);
}
