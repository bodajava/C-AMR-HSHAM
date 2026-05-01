import { memo, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { userApi } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Camera01Icon, Logout01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import axios from "axios";
import { Loader2 } from "lucide-react";

const SettingsPage = memo(function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading profile image...");
    try {
      // 1. Get presigned URL from backend
      const response = await userApi.getPresignedUrl({
        ContentType: file.type,
        originalname: file.name
      });

      const { url, Key } = response.data;
      
      // 2. Upload to S3
      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3. Update database with the new key
      await userApi.updateProfileImage(Key);

      // 4. Update local state for immediate display
      const previewUrl = URL.createObjectURL(file);
      updateUser({ profilePicture: previewUrl });
      
      toast.success("Profile image updated successfully!", { id: toastId });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image. Please try again.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading("Logging out...");
    try {
      await userApi.logout(0); // Logout from this device
      toast.success("Logged out successfully", { id: toastId });
      logout();
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      toast.error("Logout failed, but clearing session...", { id: toastId });
      logout(); // Force logout on frontend anyway
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 pt-0">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences.</p>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          className="rounded-xl font-bold"
        >
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <HugeiconsIcon icon={Logout01Icon} className="mr-2 h-4 w-4" />
          )}
          Log Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
            <CardDescription>Update your personal details and avatar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-muted overflow-hidden border-2 border-border flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                         // Fallback for broken S3 links or private URLs
                         (e.target as any).src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;
                      }}
                    />
                  ) : (
                    <HugeiconsIcon icon={UserIcon} className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <HugeiconsIcon icon={Camera01Icon} className="h-6 w-6" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <p className="text-xs font-bold uppercase text-muted-foreground">First Name</p>
                   <p className="font-medium">{user?.firstName}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold uppercase text-muted-foreground">Last Name</p>
                   <p className="font-medium">{user?.lastName}</p>
                </div>
              </div>
              <div className="space-y-1">
                 <p className="text-xs font-bold uppercase text-muted-foreground">Email Address</p>
                 <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-destructive">Danger Zone</CardTitle>
            <CardDescription>Actions that cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/5 border border-destructive/10">
              <div className="space-y-0.5">
                <p className="text-sm font-bold">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently remove your data and subscription.</p>
              </div>
              <Button variant="destructive" size="sm" className="rounded-xl font-bold shadow-sm">
                <HugeiconsIcon icon={Delete02Icon} className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default SettingsPage;
