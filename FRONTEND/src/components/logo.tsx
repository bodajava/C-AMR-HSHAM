import type React from "react";
import logoUrl from "@/assets/WhatsApp_Image_2026-04-28_at_01.31.54-removebg-preview.png";

export const LogoIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<img 
		src={logoUrl} 
		alt="PlusBeat Logo" 
		className={`h-8 w-auto ${props.className}`} 
		{...props} 
	/>
);

export const Logo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
	<div className="flex items-center gap-2">
		<img 
			src={logoUrl} 
			alt="PlusBeat Logo" 
			className={`h-8 w-auto ${props.className}`} 
			{...props} 
		/>
		<span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
			PlusBeat
		</span>
	</div>
);
