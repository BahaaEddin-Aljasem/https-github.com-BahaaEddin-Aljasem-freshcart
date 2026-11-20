import type { Metadata } from "next";
import { AccountSettings } from "@/features/account/components/AccountSettings";
import { AccountShell } from "@/features/account/components/AccountShell";

export const metadata: Metadata = { title: "My Account" };

export default function ProfilePage() {
  return (
    <AccountShell activeSection="settings">
      <AccountSettings />
    </AccountShell>
  );
}
