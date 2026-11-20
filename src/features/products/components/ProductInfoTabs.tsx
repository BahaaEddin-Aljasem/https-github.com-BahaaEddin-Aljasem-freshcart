"use client";

import { useState } from "react";
import { Check, Package, Star, Truck } from "lucide-react";
import type { Product } from "@/services/catalog.service";
import { RatingStars } from "@/components/products/RatingStars/RatingStars";

const tabs = [
  { id: "details", label: "Product Details", icon: Package },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "shipping", label: "Shipping & Returns", icon: Truck },
] as const;

type TabId = (typeof tabs)[number]["id"];
const keyFeatures = [
  "Premium Quality Product",
  "100% Authentic Guarantee",
  "Fast & Secure Packaging",
  "Quality Tested",
];

export function ProductInfoTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const soldCount = typeof product.sold === "number" && Number.isSafeInteger(product.sold) && product.sold >= 0
    ? product.sold
    : undefined;
  const productInfo = [
    { label: "Category", value: product.categoryName || "—" },
    { label: "Subcategory", value: product.subcategoryName || "—" },
    { label: "Brand", value: product.brandName || "—" },
    { label: "Items Sold", value: soldCount === undefined ? "—" : `${soldCount.toLocaleString("en-US")}+ sold` },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
      <div role="tablist" aria-label="Product information" className="flex overflow-x-auto border-b border-line px-4 sm:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
          <button
            key={tab.id}
            id={`product-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`product-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "border-brand bg-emerald-50/50 text-brand" : "border-transparent text-slate-500 hover:text-ink"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {tab.label}
            {tab.id === "reviews" && <span className="text-xs">({product.ratingCount})</span>}
          </button>
          );
        })}
      </div>

      <div
        id={`product-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`product-tab-${activeTab}`}
        className="min-h-40 px-5 py-5 sm:px-6 sm:py-6"
      >
        {activeTab === "details" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-ink">About this Product</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                {product.description || "No detailed description was provided for this product."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <section className="rounded-lg bg-slate-50 p-4">
                <h3 className="text-sm font-medium text-ink">Product Information</h3>
                <dl className="mt-3 space-y-2 text-xs sm:text-sm">
                  {productInfo.map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <dt className="shrink-0 text-slate-500">{label}</dt>
                      <dd className="text-right font-medium text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <section className="rounded-lg bg-slate-50 p-4">
                <h3 className="text-sm font-medium text-ink">Key Features</h3>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 sm:text-sm">
                  {keyFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-ink">Customer Reviews</h2>
            <RatingStars average={product.ratingAverage} count={product.ratingCount} size="detail" />
            {product.ratingCount > 0 ? (
              <p className="text-sm leading-6 text-slate-600">
                Based on {product.ratingCount} {product.ratingCount === 1 ? "rating" : "ratings"}. The product API provides rating summaries but no written review details.
              </p>
            ) : (
              <p className="text-sm text-slate-600">There are no customer ratings for this product yet.</p>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="grid gap-5 text-sm leading-6 text-slate-600 sm:grid-cols-2">
            <div>
              <h2 className="font-semibold text-ink">Shipping Information</h2>
              <p className="mt-2">Available delivery options, fees, and estimated arrival dates are confirmed at checkout for your address.</p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">Returns</h2>
              <p className="mt-2">For help with an order or return, contact customer support with your order details.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
