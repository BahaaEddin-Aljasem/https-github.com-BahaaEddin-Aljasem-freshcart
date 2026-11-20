"use client";

import { forwardRef, useEffect, useId, useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Banknote,
  Bookmark,
  Check,
  ClipboardList,
  CreditCard,
  Info,
  MapPin,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";
import { Spinner } from "@/components/shared/Loading/Spinner";
import { Button } from "@/components/ui/Button";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { PhoneNumberField } from "@/components/ui/PhoneNumberField";
import { hasCommerceSession, useSession } from "@/features/auth/hooks/useAuthMutations";
import { cartApi, mergeGuestCart, type CartSnapshot } from "@/features/cart/api/cart.api";
import { useRemoteCart } from "@/features/cart/hooks/useCart";
import { getCartTotals } from "@/features/cart/utils";
import { usePlaceOrder } from "@/features/orders/hooks/useOrders";
import { useHydrated } from "@/hooks/useHydrated";
import { toApiError } from "@/lib/axios";
import { checkoutSchema, type CheckoutInput } from "@/schemas/checkout";
import { useCartStore } from "@/store/cart.store";
import { readSavedAddresses, writeSavedAddresses, type SavedAddress } from "@/features/account/address-storage";
import { getCountryName, isCountryCode, normalizePhoneNumber } from "@/lib/phone";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";

type CheckoutInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon: LucideIcon;
};

const CheckoutInput = forwardRef<HTMLInputElement, CheckoutInputProps>(
  function CheckoutInput({ label, error, icon: Icon, ...props }, ref) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-700">
        {label} <span className="text-red-500" aria-hidden>*</span>
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md bg-slate-100 text-slate-500">
          <Icon className="size-3.5" aria-hidden />
        </span>
        <input
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`w-full rounded-lg border bg-white py-2.5 pl-11 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15 ${
            error ? "border-red-500" : "border-slate-200"
          }`}
          {...props}
        />
      </div>
      {error && <p id={errorId} role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
CheckoutInput.displayName = "CheckoutInput";

type CheckoutTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  icon: LucideIcon;
  optional?: boolean;
};

const CheckoutTextarea = forwardRef<HTMLTextAreaElement, CheckoutTextareaProps>(
  function CheckoutTextarea({ label, error, icon: Icon, optional = false, ...props }, ref) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-700">
        {label} {!optional && <span className="text-red-500" aria-hidden>*</span>}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-2.5 grid size-6 place-items-center rounded-md bg-slate-100 text-slate-500">
          <Icon className="size-3.5" aria-hidden />
        </span>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`min-h-18 w-full resize-y rounded-lg border bg-white py-2.5 pl-11 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15 ${
            error ? "border-red-500" : "border-slate-200"
          }`}
          {...props}
        />
      </div>
      {error && <p id={errorId} role="alert" className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
CheckoutTextarea.displayName = "CheckoutTextarea";

function CheckoutSectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <header className="bg-linear-to-r from-brand to-green-700 px-4 py-3.5 text-white">
      <h2 className="flex items-center gap-2 text-sm font-bold">
        <Icon className="size-4" aria-hidden />
        {title}
      </h2>
      <p className="mt-1 text-[10px] text-white/85">{description}</p>
    </header>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const localItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const { data: session } = useSession();
  const commerceSession = hasCommerceSession(session);
  const remoteCart = useRemoteCart(commerceSession);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  const userId = session?.user?._id;
  const placeOrder = usePlaceOrder(session?.user?.name, session?.localOnly ? userId : undefined);

  const { control, register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "EG", payment: "cash" },
  });
  const payment = watch("payment");
  const deliveryCountry = watch("country");

  useEffect(() => {
    if (!userId) {
      setSavedAddresses([]);
      return;
    }
    try {
      setSavedAddresses(readSavedAddresses(window.localStorage, userId));
    } catch (error) {
      console.error("Could not load saved addresses:", error);
      toast.error(error instanceof Error ? error.message : "Saved addresses could not be loaded.");
      setSavedAddresses([]);
    }
  }, [userId]);

  useEffect(() => {
    const name = session?.user?.name;
    if (name && !getValues("fullName")) {
      setValue("fullName", name, { shouldDirty: false });
    }
    const phone = session?.user?.phone;
    if (phone && !getValues("phone")) {
      setValue("phone", phone, { shouldDirty: false });
    }
  }, [getValues, session?.user?.name, session?.user?.phone, setValue]);

  if (!hydrated) return <Spinner label="Loading checkout" />;
  const items = remoteCart.data?.items.length ? remoteCart.data.items : localItems;
  if (commerceSession && remoteCart.isLoading && localItems.length === 0) return <Spinner label="Loading checkout" />;
  if (commerceSession && remoteCart.isError && localItems.length === 0) {
    return <ErrorState message="We couldn't load your cart." onRetry={() => void remoteCart.refetch()} />;
  }
  if (items.length === 0) {
    return <EmptyState title="Nothing to check out" description="Your cart is empty." action={{ label: "Back to shop", href: "/products" }} />;
  }

  const totals = getCartTotals(items);

  const fillSavedAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find((item) => item.id === addressId);
    if (!address) {
      setValue("fullName", session?.user?.name ?? "");
      setValue("phone", "");
      setValue("country", "EG");
      setValue("city", "");
      setValue("address", "");
      return;
    }
    const country = address.country && isCountryCode(address.country) ? address.country : "EG";
    setValue("fullName", address.fullName, { shouldValidate: true });
    setValue("phone", normalizePhoneNumber(address.phone, country), { shouldValidate: true });
    setValue("country", country, { shouldValidate: true });
    setValue("city", address.city, { shouldValidate: true });
    setValue("address", address.address, { shouldValidate: true });
  };

  const onSubmit = async ({ payment: selectedPayment, ...address }: CheckoutInput) => {
    if (selectedPayment === "card") {
      toast.error("Online payment is unavailable until a payment provider is connected. Choose Cash on Delivery.");
      return;
    }
    if (session?.localOnly && !userId) {
      toast.error("The signed-in account could not be identified. Sign in again and retry.");
      return;
    }

    let cart: CartSnapshot;
    try {
      if (session?.localOnly) {
        const localItems = useCartStore.getState().items;
        cart = { items: localItems, totalPrice: getCartTotals(localItems).total };
      } else {
        const currentGuestItems = useCartStore.getState().items;
        cart = currentGuestItems.length > 0
          ? await mergeGuestCart(currentGuestItems)
          : await cartApi.get();
      }
    } catch (error) {
      toast.error(toApiError(error).message);
      return;
    }
    if (cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    try {
      await placeOrder.mutateAsync({ cart, address });
      if (saveAddress && userId) {
        try {
          const existing = readSavedAddresses(window.localStorage, userId);
          const duplicate = existing.some((item) =>
            item.phone === address.phone &&
            item.country === address.country &&
            item.city === address.city &&
            item.address === address.address,
          );
          if (!duplicate) {
            writeSavedAddresses(window.localStorage, userId, [
              {
                id: globalThis.crypto.randomUUID(),
                label: address.city,
                fullName: address.fullName,
                phone: address.phone,
                country: address.country,
                city: address.city,
                address: address.address,
              },
              ...existing,
            ]);
          }
        } catch (error) {
          console.error("Order placed, but the address could not be saved:", error);
          toast.error("Order placed, but this address could not be saved.");
        }
      }
      clearCart();
      router.push("/profile/orders");
    } catch {
      return;
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand text-white shadow-sm">
            <ClipboardList className="size-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Complete Your Order</h1>
            <p className="mt-0.5 text-xs text-slate-500">Review your items and complete your purchase</p>
          </div>
        </div>
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark">
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to Cart
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem]">
        <div className="space-y-4">
          <section aria-label="Shipping address" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <CheckoutSectionHeader
              icon={MapPin}
              title="Shipping Address"
              description="Where should we deliver your order?"
            />
            <div className="space-y-4 p-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Bookmark className="size-3.5 text-brand" aria-hidden />
                  Saved Addresses
                </p>
                {savedAddresses.length > 0 ? (
                  <select
                    aria-label="Choose a saved address"
                    value={selectedAddressId}
                    onChange={(event) => fillSavedAddress(event.target.value)}
                    className="mt-2 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-brand"
                  >
                    <option value="">Enter a new delivery address</option>
                    {savedAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.label} — {address.city}{address.country ? `, ${getCountryName(address.country)}` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    No saved addresses yet. Add a delivery address below.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => fillSavedAddress("")}
                className="flex w-full items-center gap-3 rounded-lg border border-dashed border-emerald-400 bg-emerald-50/70 p-3 text-left"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-emerald-500 text-white">
                  <Plus className="size-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-emerald-800">New delivery address</span>
                  <span className="block text-[10px] text-slate-500">Add your delivery details below</span>
                </span>
              </button>

              <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50/80 p-3 text-[11px] text-blue-700">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>
                  <span className="block font-semibold">Delivery Information</span>
                  Please make sure your address and phone number are accurate.
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <CheckoutInput
                  label="Full name"
                  icon={UserRound}
                  autoComplete="name"
                  error={errors.fullName?.message}
                  {...register("fullName")}
                />
                <CheckoutInput
                  label="City"
                  icon={MapPin}
                  autoComplete="address-level2"
                  maxLength={80}
                  placeholder="e.g. Cairo, Alexandria, Giza"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <CountrySelect
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <div className="sm:col-span-2">
                  <CheckoutTextarea
                    label="Street address"
                    icon={MapPin}
                    autoComplete="street-address"
                    maxLength={240}
                    placeholder="Street name, building number, floor, apartment..."
                    error={errors.address?.message}
                    {...register("address")}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneNumberField
                        label="Phone number"
                        required
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name={field.name}
                        defaultCountry={isCountryCode(deliveryCountry) ? deliveryCountry : "EG"}
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </div>
                <div className="sm:col-span-2">
                  <CheckoutTextarea
                    label="Order notes (optional)"
                    icon={Info}
                    optional
                    maxLength={200}
                    placeholder="Add delivery instructions if needed"
                    {...register("notes")}
                  />
                </div>
                {userId && (
                  <label className="sm:col-span-2 flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(event) => setSaveAddress(event.target.checked)}
                      className="size-4 rounded accent-brand"
                    />
                    Save this address to My Addresses
                  </label>
                )}
              </div>
            </div>
          </section>

          <section aria-label="Payment method" className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <CheckoutSectionHeader
              icon={CreditCard}
              title="Payment Method"
              description="Choose how you'd like to pay"
            />
            <div className="space-y-3 p-4">
              <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                payment === "cash" ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200"
              }`}>
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Banknote className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-emerald-800">Cash on Delivery</span>
                  <span className="block text-[10px] leading-4 text-slate-500">Pay when your order arrives at your doorstep</span>
                </span>
                <input type="radio" value="cash" className="sr-only" {...register("payment")} />
                <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                  payment === "cash" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-white"
                }`}>
                  {payment === "cash" && <Check className="size-3" aria-hidden />}
                </span>
              </label>

              <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                payment === "card" ? "border-emerald-500 bg-emerald-50/70" : "border-slate-200"
              }`}>
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                  payment === "card" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}>
                  <CreditCard className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-xs font-semibold ${payment === "card" ? "text-emerald-800" : "text-slate-700"}`}>Pay Online</span>
                  <span className="block text-[10px] leading-4 text-slate-500">Payment provider is not connected yet</span>
                </span>
                <input type="radio" value="card" className="sr-only" {...register("payment")} />
                <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                  payment === "card" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white text-white"
                }`}>
                  {payment === "card" && <Check className="size-3" aria-hidden />}
                </span>
              </label>

              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-[10px] text-emerald-800">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-brand">
                  <ShieldCheck className="size-4" aria-hidden />
                </span>
                <span>
                  <span className="block font-medium">Secure &amp; Encrypted</span>
                  Your information is protected during checkout.
                </span>
              </div>
            </div>
          </section>
        </div>

        <CheckoutOrderSummary items={items} totals={totals}>
          <Button type="submit" loading={placeOrder.isPending} className="min-h-10 shadow-sm">
            Place Order
          </Button>
        </CheckoutOrderSummary>
      </form>
    </div>
  );
}
