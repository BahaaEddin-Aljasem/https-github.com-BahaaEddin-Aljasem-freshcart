import type { Metadata } from "next";
import { AccountShell } from "@/features/account/components/AccountShell";
import { AccountAddresses } from "@/features/account/components/AccountAddresses";

export const metadata: Metadata = { title: "My Addresses" };

export default function AddressesPage() {
  return (
    <AccountShell activeSection="addresses">
      <AccountAddresses />
    </AccountShell>
  );
}
