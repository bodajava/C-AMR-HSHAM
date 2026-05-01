

export function Footer() {
	return (
		<footer className="w-full py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
			<div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4 font-['Inter'] text-sm text-slate-500">
				<div className="flex items-center gap-4">
					<span className="font-bold text-slate-900 dark:text-slate-100">Lumina Coach</span>
					<span>© 2024 Lumina Coach. Built for precision.</span>
				</div>
				<div className="flex items-center gap-8">
					<a className="text-slate-500 hover:text-teal-600 transition-colors hover:underline underline-offset-4" href="#">Terms</a>
					<a className="text-slate-500 hover:text-teal-600 transition-colors hover:underline underline-offset-4" href="#">Privacy</a>
					<a className="text-slate-500 hover:text-teal-600 transition-colors hover:underline underline-offset-4" href="#">Support</a>
					<a className="text-slate-500 hover:text-teal-600 transition-colors hover:underline underline-offset-4" href="#">Contact</a>
				</div>
			</div>
		</footer>
	);
}
