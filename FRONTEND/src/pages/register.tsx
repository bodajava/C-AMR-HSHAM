import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  UserIcon, 
  AtIcon, 
  LockPasswordIcon, 
  ArrowRight01Icon,
  SmartPhone01Icon,
  Calendar03Icon,
  UserAccountIcon
} from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { AuthDivider } from "@/components/auth-divider";
import { DecorIcon } from "@/components/ui/decor-icon";
import { AuthBackground } from "@/components/ui/auth-background";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const registerSchema = z.object({
  userName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  phone: z.string().optional().or(z.literal("")),
  gender: z.coerce.number().default(0),
  role: z.coerce.number().default(0),
  provider: z.coerce.number().default(0),
  DOB: z.string().min(1, "Date of birth is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      gender: 0,
      role: 0,
      provider: 0,
      DOB: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your account...");
    try {
      const payload = {
        userName: data.userName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        gender: data.gender,
        role: data.role,
        provider: data.provider,
        DOB: data.DOB,
        profilePicture: "https://ui-avatars.com/api/?name=" + data.userName.split(" ").join("+"),
        profileCoverPictures: []
      };
      
      await authApi.register(payload);
      toast.success("Account created! Please verify your email.", { id: toastId });
      
      setTimeout(() => navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`), 1500);
    } catch (error: any) {
      console.error("Register Error:", error);
      const errorMsg = error.message || (error.data?.message) || "Registration failed. Please check all fields.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const toastId = toast.loading("Connecting with Google...");
    try {
      const response = await authApi.googleLogin(credentialResponse.credential);
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
          "relative flex w-full max-w-2xl flex-col justify-between p-6 md:p-10",
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
              <h1 className="font-bold text-3xl tracking-tight">Create Account</h1>
              <p className="text-base text-muted-foreground">
                Join our community and start your fitness journey today.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <InputGroup className={cn(errors.userName && "border-destructive ring-destructive/20")}>
                    <InputGroupInput
                      {...register("userName")}
                      placeholder="First and Last Name"
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="inline-start">
                      <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.userName && <p className="text-[10px] text-destructive font-medium ml-1">{errors.userName.message}</p>}
                </div>

                {/* Email */}
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
                  {errors.email && <p className="text-[10px] text-destructive font-medium ml-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <InputGroup className={cn(errors.password && "border-destructive ring-destructive/20")}>
                    <InputGroupInput
                      {...register("password")}
                      type="password"
                      placeholder="Password"
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="inline-start">
                      <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.password && <p className="text-[10px] text-destructive font-medium ml-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <InputGroup className={cn(errors.confirmPassword && "border-destructive ring-destructive/20")}>
                    <InputGroupInput
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="Confirm Password"
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="inline-start">
                      <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.confirmPassword && <p className="text-[10px] text-destructive font-medium ml-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <InputGroup className={cn(errors.phone && "border-destructive ring-destructive/20")}>
                    <InputGroupInput
                      {...register("phone")}
                      placeholder="Phone (+20...)"
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="inline-start">
                      <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.phone && <p className="text-[10px] text-destructive font-medium ml-1">{errors.phone.message}</p>}
                </div>

                {/* DOB */}
                <div className="space-y-1">
                  <InputGroup className={cn(errors.DOB && "border-destructive ring-destructive/20")}>
                    <InputGroupInput
                      {...register("DOB")}
                      type="date"
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="inline-start">
                      <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.DOB && <p className="text-[10px] text-destructive font-medium ml-1">{errors.DOB.message}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <InputGroup>
                    <select 
                      {...register("gender")}
                      className="w-full h-full bg-transparent outline-none text-sm px-2"
                      disabled={isSubmitting}
                    >
                      <option value={0}>Male</option>
                      <option value={1}>Female</option>
                    </select>
                    <InputGroupAddon align="inline-start">
                      <HugeiconsIcon icon={UserAccountIcon} strokeWidth={2} />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
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
                      Create Account
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
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
}
