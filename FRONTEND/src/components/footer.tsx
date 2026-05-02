import { Link } from "react-router-dom";
import logoUrl from "@/assets/WhatsApp_Image_2026-04-28_at_01.31.54-removebg-preview.png";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
	Facebook02Icon, 
	InstagramIcon, 
	TwitterIcon,
	Mail01Icon,
	SmartPhone01Icon,
	Location01Icon
} from "@hugeicons/core-free-icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="PlusBeat Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                PlusBeat
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 max-w-xs">
              Elevate your fitness journey with precision coaching and personalized nutrition. Your goals, our mission.
            </p>
            <div className="flex gap-x-6">
              <a href="#" className="text-slate-400 hover:text-teal-500 transition-colors">
                <HugeiconsIcon icon={Facebook02Icon} className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-teal-500 transition-colors">
                <HugeiconsIcon icon={InstagramIcon} className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-teal-500 transition-colors">
                <HugeiconsIcon icon={TwitterIcon} className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link to="/workouts" className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-teal-500">
                      Workouts
                    </Link>
                  </li>
                  <li>
                    <Link to="/meals" className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-teal-500">
                      Nutrition
                    </Link>
                  </li>
                  <li>
                    <Link to="/philosophy" className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-teal-500">
                      Philosophy
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a href="#" className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-teal-500">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-teal-500">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-slate-600 dark:text-slate-400 hover:text-teal-500">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">Contact</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <HugeiconsIcon icon={Mail01Icon} className="h-4 w-4 text-teal-500" />
                    support@plusbeat.com
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <HugeiconsIcon icon={SmartPhone01Icon} className="h-4 w-4 text-teal-500" />
                    +20 123 456 7890
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <HugeiconsIcon icon={Location01Icon} className="h-4 w-4 text-teal-500" />
                    Cairo, Egypt
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">
            &copy; {currentYear} PlusBeat. All rights reserved. Built for precision and performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
