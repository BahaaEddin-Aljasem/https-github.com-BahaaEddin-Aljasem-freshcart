"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { CountryCode } from "libphonenumber-js";
import { Building2, MapPin, Pencil, Phone, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { PhoneNumberField } from "@/components/ui/PhoneNumberField";
import { Spinner } from "@/components/shared/Loading/Spinner";
import { useSession } from "@/features/auth/hooks/useAuthMutations";
import { getCountryName, isCountryCode, isValidInternationalPhoneNumber, normalizePhoneNumber } from "@/lib/phone";
import {
  readSavedAddresses,
  writeSavedAddresses,
  type SavedAddress,
} from "@/features/account/address-storage";

interface AddressDraft {
  label: string;
  fullName: string;
  phone: string;
  country: CountryCode;
  city: string;
  address: string;
}

const emptyDraft: AddressDraft = {
  label: "",
  fullName: "",
  phone: "",
  country: "EG",
  city: "",
  address: "",
};

function formInputClass() {
  return "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15";
}

export function AccountAddresses() {
  const { data: session, isPending } = useSession();
  const userId = session?.user?._id;
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loadedForUser, setLoadedForUser] = useState<string>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(emptyDraft);

  useEffect(() => {
    if (isPending || !userId) return;
    try {
      setAddresses(readSavedAddresses(window.localStorage, userId));
    } catch (error) {
      console.error("Could not load saved addresses:", error);
      toast.error(error instanceof Error ? error.message : "Saved addresses could not be loaded.");
      setAddresses([]);
    } finally {
      setLoadedForUser(userId);
    }
  }, [isPending, userId]);

  const openNewAddress = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setDialogOpen(true);
  };

  const openEditAddress = (address: SavedAddress) => {
    setEditingId(address.id);
    setDraft({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      country: address.country && isCountryCode(address.country) ? address.country : "EG",
      city: address.city,
      address: address.address,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const updateDraft = (field: keyof AddressDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      toast.error("Sign in to save an address.");
      return;
    }
    const phone = normalizePhoneNumber(draft.phone, draft.country);
    if (!isValidInternationalPhoneNumber(phone)) {
      toast.error("Enter a valid international phone number.");
      return;
    }

    const savedAddress: SavedAddress = {
      id: editingId ?? globalThis.crypto.randomUUID(),
      ...draft,
      label: draft.label.trim(),
      fullName: draft.fullName.trim(),
      phone,
      city: draft.city.trim(),
      address: draft.address.trim(),
    };
    const nextAddresses = editingId
      ? addresses.map((address) => address.id === editingId ? savedAddress : address)
      : [savedAddress, ...addresses];

    try {
      writeSavedAddresses(window.localStorage, userId, nextAddresses);
      setAddresses(nextAddresses);
      closeDialog();
      toast.success(editingId ? "Address updated." : "Address saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Address could not be saved.");
    }
  };

  const deleteAddress = (addressId: string) => {
    if (!userId || !window.confirm("Delete this saved address?")) return;
    const nextAddresses = addresses.filter((address) => address.id !== addressId);
    try {
      writeSavedAddresses(window.localStorage, userId, nextAddresses);
      setAddresses(nextAddresses);
      toast.success("Address deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Address could not be deleted.");
    }
  };

  const isReady = !isPending && Boolean(userId) && loadedForUser === userId;

  return (
    <>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">My Addresses</h2>
          <p className="mt-1 text-xs text-slate-500">Manage your saved delivery addresses</p>
        </div>
        <Button type="button" onClick={openNewAddress} className="h-8 w-auto rounded-md px-3 text-[11px]">
          <Plus className="size-3.5" aria-hidden />
          Add Address
        </Button>
      </header>

      {!isReady ? (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <Spinner label="Loading addresses" />
        </div>
      ) : addresses.length === 0 ? (
        <section className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
          <span className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-brand">
            <MapPin className="size-5" aria-hidden />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-slate-800">No saved addresses yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">Add an address to make future checkouts faster.</p>
          <Button type="button" onClick={openNewAddress} className="mt-4 h-8 w-auto rounded-md px-3 text-[11px]">
            <Plus className="size-3.5" aria-hidden />
            Add Address
          </Button>
        </section>
      ) : (
        <ul className="max-w-md space-y-3">
          {addresses.map((address) => (
            <li key={address.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-brand">
                <MapPin className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xs font-bold text-slate-900">{address.label}</h3>
                <p className="mt-1 text-xs text-slate-600">{address.address}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Phone className="size-3" aria-hidden />
                    {address.phone}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="size-3" aria-hidden />
                    {[address.city, getCountryName(address.country)].filter(Boolean).join(", ")}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label={`Edit ${address.label}`}
                  onClick={() => openEditAddress(address)}
                  className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-emerald-50 hover:text-brand"
                >
                  <Pencil className="size-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${address.label}`}
                  onClick={() => deleteAddress(address.id)}
                  className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-dialog-title"
            className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"
          >
            <header className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 id="address-dialog-title" className="text-sm font-bold text-slate-900">
                  {editingId ? "Edit Address" : "Add Address"}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500">Your address is saved in this browser.</p>
              </div>
              <button type="button" aria-label="Close" onClick={closeDialog} className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
                <X className="size-4" aria-hidden />
              </button>
            </header>

            <form onSubmit={saveAddress} className="space-y-3">
              <label className="block space-y-1 text-[11px] font-medium text-slate-700">
                Address Label
                <input
                  required
                  minLength={2}
                  maxLength={40}
                  autoFocus
                  value={draft.label}
                  onChange={(event) => updateDraft("label", event.target.value)}
                  placeholder="Home"
                  className={formInputClass()}
                />
              </label>
              <label className="block space-y-1 text-[11px] font-medium text-slate-700">
                Full Name
                <input
                  required
                  minLength={3}
                  maxLength={80}
                  autoComplete="name"
                  value={draft.fullName}
                  onChange={(event) => updateDraft("fullName", event.target.value)}
                  placeholder="Enter your full name"
                  className={formInputClass()}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <PhoneNumberField
                  label="Phone Number"
                  required
                  value={draft.phone}
                  onChange={(phone) => updateDraft("phone", phone)}
                  defaultCountry={draft.country}
                />
                <label className="block space-y-1 text-[11px] font-medium text-slate-700">
                  City
                  <input
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="address-level2"
                    value={draft.city}
                    onChange={(event) => updateDraft("city", event.target.value)}
                    placeholder="Enter your city"
                    className={formInputClass()}
                  />
                </label>
                <CountrySelect
                  value={draft.country}
                  onChange={(country) => {
                    if (isCountryCode(country)) updateDraft("country", country);
                  }}
                  className="h-9 text-xs"
                />
              </div>
              <label className="block space-y-1 text-[11px] font-medium text-slate-700">
                Street Address
                <textarea
                  required
                  minLength={5}
                  maxLength={240}
                  autoComplete="street-address"
                  value={draft.address}
                  onChange={(event) => updateDraft("address", event.target.value)}
                  placeholder="Street, building, floor, apartment..."
                  className="min-h-20 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  onClick={closeDialog}
                  className="h-8 w-auto border border-slate-200 bg-white px-3 text-[11px] text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </Button>
                <Button type="submit" className="h-8 w-auto px-3 text-[11px]">
                  {editingId ? "Save Changes" : "Save Address"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
