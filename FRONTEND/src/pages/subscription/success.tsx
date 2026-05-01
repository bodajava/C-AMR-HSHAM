import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { AuthBackground } from "@/components/ui/auth-background";
import { DecorIcon } from "@/components/ui/decor-icon";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      toast.success("Payment successful! Your subscription is now active.");
    }
  }, [sessionId]);

  return (
    <AuthBackground>
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 py-12">
        <div className="relative flex w-full max-w-lg flex-col items-center justify-center border bg-background p-10 text-center">
          <DecorIcon position="top-left" />
          <DecorIcon position="bottom-right" />
          
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="h-10 w-10" />
          </div>

          <h1 className="mb-4 text-3xl font-bold tracking-tight">Payment Successful!</h1>
          <p className="mb-8 text-muted-foreground text-lg">
            Thank you for your purchase. Your account has been upgraded and you now have full access to all features.
          </p>

          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AuthBackground>
  );
}
