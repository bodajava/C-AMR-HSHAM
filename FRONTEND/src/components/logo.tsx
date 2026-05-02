import type React from "react";
import logoUrl from "@/assets/WhatsApp_Image_2026-04-28_at_01.31.54-removebg-preview.png";

export const LogoIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img 
		src={logoUrl} 
		alt="AMR-HESHAM Logo" 
		className={`h-12 w-auto ${props.className}`} 
		{...props} 
	/>
);

export const Logo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<div className="flex items-center gap-2">
		<img 
			src={logoUrl} 
			alt="AMR-HESHAM Logo" 
			className={`h-12 w-auto ${props.className}`} 
			{...props} 
		/>
		<span className="font-black text-xl tracking-[0.2em] uppercase text-foreground dark:text-white">
			AMR-HESHAM
		</span>
	</div>
);
