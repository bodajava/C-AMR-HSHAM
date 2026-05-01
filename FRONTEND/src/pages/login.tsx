import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { AtIcon, LockPasswordIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { AuthDivider } from "@/components/auth-divider";
import { DecorIcon } from "@/components/ui/decor-icon";
import { AuthBackground } from "@/components/ui/auth-background";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema) as any,
  });

  const onSubmit = async (data: LoginValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Logging you in...");
    try {
      const response = await authApi.login(data);
      const { user, accessToken, refreshToken } = response.data;
      
      setAuth(user, accessToken, refreshToken);
      toast.success("Welcome back! Login successful.", { id: toastId });
      
      const isAdmin = user.email === (import.meta.env.VITE_ADMIN_EMAIL || "bbido761@gmail.com");
      setTimeout(() => navigate(isAdmin ? "/admin/workouts" : "/#philosophy"), 1000);
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const toastId = toast.loading("Connecting with Google...");
    try {
      let fcmToken = null;
      try {
        const { requestForToken } = await import("@/lib/firebase");
        fcmToken = await requestForToken();
      } catch (e) {
        console.warn("FCM token request failed:", e);
      }

      const response = await authApi.googleLogin(credentialResponse.credential, fcmToken);
      const { user, accessToken, refreshToken } = response.data; 
      
      setAuth(user, accessToken, refreshToken);
      toast.success("Welcome back! Google Login successful.", { id: toastId });
      
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "bbido761@gmail.com";
      const isAdmin = user.email === adminEmail;
      setTimeout(() => navigate(isAdmin ? "/admin/workouts" : "/#philosophy"), 1000);
    } catch (error: any) {
      toast.error(error.message || "Google Login failed", { id: toastId });
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
              <h1 className="font-bold text-3xl tracking-tight">Welcome Back</h1>
              <p className="text-base text-muted-foreground">
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
              <div className="space-y-1">
                <InputGroup className={cn(errors.email && "border-destructive ring-destructive/20")}>
                  <InputGroupInput
                    {...register("email")}
                    type="email"
                    placeholder="jane@example.com"
                    disabled={isSubmitting}
                  />
                  <InputGroupAddon align="inline-start">
                    <HugeiconsIcon icon={AtIcon} strokeWidth={2} />
                  </InputGroupAddon>
                </InputGroup>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <InputGroup className={cn(errors.password && "border-destructive ring-destructive/20")}>
                  <InputGroupInput
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  <InputGroupAddon align="inline-start">
                    <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} />
                  </InputGroupAddon>
                </InputGroup>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
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
                      Sign In
                      <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              <AuthDivider>Or continue with</AuthDivider>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google Login failed")}
                  useOneTap
                  theme="outline"
                  shape="rectangular"
                  size="large"
                  width="100%"
                />
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground pt-4">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline underline-offset-4">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
}
