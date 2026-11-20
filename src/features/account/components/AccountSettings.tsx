"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, LockKeyhole, Save, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PhoneNumberField } from "@/components/ui/PhoneNumberField";
import { useSession } from "@/features/auth/hooks/useAuthMutations";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { profileUpdateSchema } from "@/schemas/auth";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[11px] font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={6}
          required
          placeholder={placeholder}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        <button
          type="button"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {visible ? <EyeOff className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}
        </button>
      </div>
    </div>
  );
}

export function AccountSettings() {
  const { data: session } = useSession();
  const { updateProfile } = useAuthContext();
  const [profile, setProfile] = useState<ProfileForm>({ name: "", email: "", phone: "" });

  useEffect(() => {
    setProfile((current) => ({
      ...current,
      name: session?.user?.name ?? current.name,
      email: session?.user?.email ?? current.email,
      phone: session?.user?.phone ?? current.phone,
    }));
  }, [session?.user?.email, session?.user?.name, session?.user?.phone]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.localOnly) {
      toast.info("Profile updates are not available through the configured API yet.");
      return;
    }
    const result = profileUpdateSchema.safeParse(profile);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Enter valid profile information.");
      return;
    }
    try {
      await updateProfile(result.data);
      toast.success("Profile information updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Profile information could not be updated.");
    }
  };

  const changePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("new-password") !== formData.get("confirm-password")) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.info("Password changes are not available through the configured API yet.");
  };

  return (
    <>
      <header className="mb-4">
        <h2 className="text-base font-bold text-slate-800">Account Settings</h2>
        <p className="mt-1 text-xs text-slate-500">Update your profile information and change your password</p>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-brand">
              <UserRound className="size-4" aria-hidden />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-800">Profile Information</h3>
              <p className="mt-0.5 text-[10px] text-slate-500">Update your personal details</p>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="account-name" className="text-[11px] font-medium text-slate-700">Full Name</label>
              <input
                id="account-name"
                name="name"
                autoComplete="name"
                required
                value={profile.name}
                onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                placeholder="Enter your name"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="account-email" className="text-[11px] font-medium text-slate-700">Email Address</label>
              <input
                id="account-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={profile.email}
                onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                placeholder="Enter your email"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="account-phone" className="text-[11px] font-medium text-slate-700">Phone Number</label>
              <PhoneNumberField
                value={profile.phone}
                onChange={(phone) => setProfile((current) => ({ ...current, phone }))}
                label="Phone Number"
              />
            </div>
            <Button type="submit" className="h-8 w-auto rounded-md px-3 text-[11px]">
              <Save className="size-3" aria-hidden />
              Save Changes
            </Button>
          </form>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
          <h3 className="text-xs font-bold text-slate-800">Account Information</h3>
          <dl className="mt-2 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">User ID</dt>
              <dd className="truncate text-slate-400">{session?.user?._id ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Role</dt>
              <dd>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-medium text-emerald-700">
                  {session?.user?.role ?? "User"}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600">
            <LockKeyhole className="size-4" aria-hidden />
          </span>
          <div>
            <h3 className="text-xs font-bold text-slate-800">Change Password</h3>
            <p className="mt-0.5 text-[10px] text-slate-500">Update your account password</p>
          </div>
        </div>

        <form onSubmit={changePassword} className="space-y-3">
          <PasswordField
            id="current-password"
            label="Current Password"
            placeholder="Enter your current password"
            autoComplete="current-password"
          />
          <PasswordField
            id="new-password"
            label="New Password"
            placeholder="Enter your new password"
            autoComplete="new-password"
          />
          <p className="-mt-2 text-[9px] text-slate-400">Must be at least 6 characters</p>
          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            autoComplete="new-password"
          />
          <Button type="submit" className="h-8 w-auto rounded-md bg-amber-600 px-3 text-[11px] hover:bg-amber-700">
            <LockKeyhole className="size-3" aria-hidden />
            Change Password
          </Button>
        </form>
      </section>
    </>
  );
}
