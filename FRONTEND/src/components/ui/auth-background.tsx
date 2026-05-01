import { cn } from "@/lib/utils";

/** Wrap auth pages (Login / Register) with this background.
 *  Do NOT use in dashboard, meals, workouts, or any internal pages. */
export function AuthBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen w-full relative bg-background", className)}>
      {/* Soft yellow glow — light mode only */}
      <div
        className="absolute inset-0 z-0 dark:opacity-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #FFF991 0%, transparent 70%)",
          opacity: 0.45,
          mixBlendMode: "multiply",
        }}
      />
      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(75,85,99,0.06) 20px, rgba(75,85,99,0.06) 21px),
            repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(107,114,128,0.05) 30px, rgba(107,114,128,0.05) 31px)
          `,
        }}
      />
      {/* Dark mode radial accent */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 dark:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 0%, rgba(249,115,22,0.07) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
