"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  User,
  Shield,
  AlertTriangle,
  ExternalLink,
  Info,
} from "lucide-react";
import {
  useUserProfile,
  useUpdateProfile,
  useUpdatePassword,
} from "@/hooks/use-user-api";
import {
  updateProfileSchema,
  updatePasswordSchema,
  type UpdateProfileInput,
  type UpdatePasswordInput,
} from "@/lib/validations/user";

export default function DashboardSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: loadingProfile,
    error: profileError,
  } = useUserProfile();

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  // Profile form
  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    values: userProfile
      ? {
          firstName: userProfile.firstName || "",
          lastName: userProfile.lastName || "",
          email: userProfile.email || "",
        }
      : undefined,
  });

  // Password form
  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onUpdateProfile = (data: UpdateProfileInput) => {
    updateProfileMutation.mutate(data);
  };

  const onUpdatePassword = (data: UpdatePasswordInput) => {
    updatePasswordMutation.mutate(data, {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
  };

  // Generate avatar fallback from name
  const getAvatarFallback = () => {
    if (!userProfile?.name) return "U";
    const names = userProfile.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  // Get OAuth provider display name
  const getProviderDisplayName = (provider: string) => {
    const providers: Record<string, string> = {
      google: "Google",
      github: "GitHub",
      facebook: "Facebook",
      twitter: "Twitter",
    };
    return (
      providers[provider] ||
      provider.charAt(0).toUpperCase() + provider.slice(1)
    );
  };

  // Get OAuth provider settings URL
  const getProviderSettingsUrl = (provider: string) => {
    const urls: Record<string, string> = {
      google: "https://myaccount.google.com/security",
      github: "https://github.com/settings/security",
      facebook: "https://www.facebook.com/settings?tab=security",
      twitter: "https://twitter.com/settings/password",
    };
    return urls[provider];
  };

  if (profileError) {
    return (
      <div className="space-y-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userProfile?.avatar} alt="User avatar" />
          <AvatarFallback className="text-lg">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground text-sm">
            Manage your account settings and preferences
          </p>
          <div className="mt-1 flex items-center space-x-2">
            {userProfile?.role && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  userProfile.role === "ADMIN"
                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                }`}
              >
                {userProfile.role === "ADMIN" ? "Admin" : "User"}
              </span>
            )}
            {userProfile?.isOAuthOnly && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                OAuth Account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Email Verification Warning */}
      {userProfile && !userProfile.emailVerified && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your email address is not verified. Some features may be limited.{" "}
            <Button variant="link" className="h-auto p-0" asChild>
              <a href="/auth/resend-verification">Verify now</a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Profile Details</h2>
            <p className="text-muted-foreground text-sm">
              Update your personal information and email address.
            </p>
          </div>

          {loadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <form
              onSubmit={profileForm.handleSubmit(onUpdateProfile)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...profileForm.register("firstName")}
                    className={
                      profileForm.formState.errors.firstName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...profileForm.register("lastName")}
                    className={
                      profileForm.formState.errors.lastName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email")}
                    className={
                      profileForm.formState.errors.email ? "border-red-500" : ""
                    }
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                  {userProfile?.email !== profileForm.watch("email") && (
                    <p className="text-sm text-amber-600">
                      Changing your email will require re-verification.
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={
                  updateProfileMutation.isPending ||
                  !profileForm.formState.isDirty
                }
              >
                {updateProfileMutation.isPending
                  ? "Updating..."
                  : "Update Profile"}
              </Button>
            </form>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Security Settings</h2>
            <p className="text-muted-foreground text-sm">
              {userProfile?.isOAuthOnly
                ? "Your account security is managed by your OAuth provider."
                : "Change your password to keep your account secure."}
            </p>
          </div>

          {userProfile?.isOAuthOnly ? (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-medium">
                      Password management is handled by your OAuth provider
                    </p>
                    <p className="text-sm">
                      Since you signed in with{" "}
                      {userProfile.oauthProviders
                        .map(getProviderDisplayName)
                        .join(", ")}
                      , your password and security settings are managed through
                      your OAuth provider&apos;s account settings.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.oauthProviders.map((provider) => (
                        <Button
                          key={provider}
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={getProviderSettingsUrl(provider)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Manage {getProviderDisplayName(provider)} Security
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <>
              <form
                onSubmit={passwordForm.handleSubmit(onUpdatePassword)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...passwordForm.register("currentPassword")}
                        className={
                          passwordForm.formState.errors.currentPassword
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <button
                        type="button"
                        aria-label="Toggle current password visibility"
                        onClick={() => setShowCurrentPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <Eye className="text-muted-foreground h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...passwordForm.register("newPassword")}
                        className={
                          passwordForm.formState.errors.newPassword
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <button
                        type="button"
                        aria-label="Toggle new password visibility"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                      >
                        {showNewPassword ? (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <Eye className="text-muted-foreground h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...passwordForm.register("confirmPassword")}
                        className={
                          passwordForm.formState.errors.confirmPassword
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <button
                        type="button"
                        aria-label="Toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <Eye className="text-muted-foreground h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={updatePasswordMutation.isPending}
                    >
                      {updatePasswordMutation.isPending
                        ? "Changing Password..."
                        : "Change Password"}
                    </Button>
                  </div>
                </div>
              </form>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
