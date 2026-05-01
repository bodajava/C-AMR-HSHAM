import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon, ArrowRight01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api-client";
import { toast } from "sonner";
import { DecorIcon } from "@/components/ui/decor-icon";
import { AuthBackground } from "@/components/ui/auth-background";
import { Loader2 } from "lucide-react";

const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 characters long"),
});

type OTPValues = z.infer<typeof otpSchema>;

export default function VerifyOTPPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing. Redirecting to register.");
      navigate("/register");
    }
  }, [email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OTPValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Verifying code...");
    try {
      await authApi.confirmEmail({ email, otp: data.otp });
      toast.success("Email verified successfully! You can now login.", { id: toastId });
      
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    const toastId = toast.loading("Resending code...");
    try {
      await authApi.resendOtp(email);
      toast.success("A new code has been sent to your email.", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code", { id: toastId });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthBackground>
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-6 md:px-8 py-12">
        <div className={cn(
          "relative flex w-full max-w-lg flex-col justify-between p-6 md:p-10",
          "dark:bg-[radial-gradient(50%_80%_at_20%_0%,rgba(249,115,22,0.05),transparent)]"
        )}>
          <div className="absolute -inset-y-6 -left-px w-px bg-border" />
          <div className="absolute -inset-y-6 -right-px w-px bg-border" />
          <div className="absolute -inset-x-6 -top-px h-px bg-border" />
          <div className="absolute -inset-x-6 -bottom-px h-px bg-border" />
          <DecorIcon position="top-left" />
          <DecorIcon position="bottom-right" />

          <div className="w-full animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col space-y-2 text-center md:text-left">
              <h1 className="font-bold text-3xl tracking-tight">Verify Email</h1>
              <p className="text-base text-muted-foreground">
                We've sent a 4-digit verification code to <span className="text-foreground font-medium">{email}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
              <div className="space-y-1">
                <InputGroup className={cn(errors.otp && "border-destructive ring-destructive/20")}>
                  <InputGroupInput
                    {...register("otp")}
                    placeholder="Enter 4-digit code"
                    maxLength={4}
                    disabled={isSubmitting}
                    className="text-center tracking-[0.5em] font-bold text-xl"
                  />
                  <InputGroupAddon align="inline-start">
                    <HugeiconsIcon icon={Tick01Icon} strokeWidth={2} />
                  </InputGroupAddon>
                </InputGroup>
                {errors.otp && <p className="text-xs text-destructive mt-1">{errors.otp.message}</p>}
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full h-11 text-base font-semibold group" 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Verify Account
                      <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="flex flex-col items-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={isResending || isSubmitting}
                className="flex items-center gap-2"
              >
                {isResending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={RefreshIcon} className="h-4 w-4" />
                )}
                Resend Code
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
}
