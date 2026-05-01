import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailSend01Icon, Call02Icon } from "@hugeicons/core-free-icons";

const contactInfo = [
	{
		icon: (
			<HugeiconsIcon icon={MailSend01Icon} strokeWidth={2} />
		),
		label: "Email",
		value: "mail@example.com",
	},
	{
		icon: (
			<HugeiconsIcon icon={Call02Icon} strokeWidth={2} />
		),
		label: "Phone",
		value: "+92 312 1234567",
	},
];

export function ContactSection() {
	return (
		<div className="relative mx-auto grid h-full w-full max-w-4xl rounded-2xl border md:grid-cols-[1fr_0.70fr]">
			<div className="col-span-1 flex flex-col space-y-4 p-8 lg:p-10">
				<h1 className="font-medium text-2xl tracking-wide md:text-3xl">
					Contact With Us
				</h1>
				<p className="max-w-md text-muted-foreground text-sm leading-relaxed md:text-base">
					If you have any questions regarding our Services or need help, please
					fill out the form here.
				</p>
				<p className="max-w-md text-muted-foreground text-xs leading-relaxed md:text-sm">
					We do our best to respond within 1 business day.
				</p>
				<div className="grid gap-4">
					{contactInfo?.map((info) => (
						<ContactInfo key={info.label} {...info} />
					))}
				</div>
			</div>
			<div className="col-span-1 flex items-center border-t p-8 md:border-t-0 md:border-l">
				<ContactForm />
			</div>
		</div>
	);
}

function ContactForm() {
	return (
		<form className="w-full">
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="full-name">Full name</FieldLabel>
					<Input autoComplete="off" id="full-name" placeholder="John Doe" />
				</Field>
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input
						autoComplete="off"
						id="email"
						placeholder="johndoe@example.com"
						type="email"
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="phone">Phone</FieldLabel>
					<Input
						autoComplete="off"
						id="phone"
						placeholder="+1 (555) 123-4567"
						type="tel"
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor="message">Message</FieldLabel>
					<Textarea
						autoComplete="off"
						id="message"
						placeholder="Your message"
					/>
				</Field>
			</FieldGroup>
			<Button className="mt-8 w-full" type="button">
				Submit
			</Button>
		</form>
	);
}

type ContactInfoProps = React.ComponentProps<"div"> & {
	icon: React.ReactNode;
	label: string;
	value: string;
};

function ContactInfo({
	icon,
	label,
	value,
	className,
	...props
}: ContactInfoProps) {
	return (
		<div className={cn("flex items-center gap-3 py-3", className)} {...props}>
			<div className="rounded-lg border bg-card p-3 shadow-xs [&_svg]:size-5">
				{icon}
			</div>
			<div>
				<p className="font-medium">{label}</p>
				<p className="text-muted-foreground text-xs">{value}</p>
			</div>
		</div>
	);
}
