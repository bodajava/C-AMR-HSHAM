import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { AuthBackground } from "@/components/ui/auth-background";
import { DecorIcon } from "@/components/ui/decor-icon";

export default function CancelPage() {
  const navigate = useNavigate();

  return (
    <AuthBackground>
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-12">
        <div className="relative flex w-full max-w-lg flex-col items-center justify-center border bg-background p-10 text-center">
          <DecorIcon position="top-left" />
          <DecorIcon position="bottom-right" />
          
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="h-10 w-10" />
          </div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight">Payment Cancelled</h1>
          <p className="mb-8 text-muted-foreground text-lg">
            The payment process was cancelled. No charges were made to your account.
          </p>

          <Button 
            className="w-full gap-2" 
            variant="outline"
            size="lg"
            onClick={() => navigate("/")}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </AuthBackground>
  );
}
