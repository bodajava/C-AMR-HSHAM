import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import logoUrl from "@/assets/WhatsApp_Image_2026-04-28_at_01.31.54-removebg-preview.png";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <img src={logoUrl} alt="AMR-HESHAM Logo" className="h-16 w-auto animate-pulse" />
        </div>
        
        <p className="text-base font-semibold text-teal-600 dark:text-teal-400">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn't exist anymore.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link to="/">
            <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/20 border-0">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
      
      <div className="mt-16 text-center text-sm text-slate-500 dark:text-slate-500">
        <p>© 2024 AMR-HESHAM. All rights reserved.</p>
      </div>
    </div>
  );
}
