import { Headset, RotateCcw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

const BENEFITS: { title: string; text: string; Icon: LucideIcon; iconColor: string; iconBackground: string }[] = [
  { title: "Free Shipping", text: "On orders over 500 EGP", Icon: Truck, iconColor: "text-green-600", iconBackground: "bg-green-100" },
  { title: "Easy Returns", text: "14-day return policy", Icon: RotateCcw, iconColor: "text-green-600", iconBackground: "bg-green-100" },
  { title: "Secure Payment", text: "100% secure checkout", Icon: ShieldCheck, iconColor: "text-green-600", iconBackground: "bg-green-100" },
  { title: "24/7 Support", text: "Contact us anytime", Icon: Headset, iconColor: "text-green-600", iconBackground: "bg-green-100" },
];

export function BenefitsSection() {
  return (
    <section aria-label="Shopping benefits" className="border-y border-green-100 bg-green-50 py-3">
      <ul className="mx-auto grid max-w-page grid-cols-2 gap-3 px-4 md:grid-cols-4 md:gap-6">
        {BENEFITS.map(({ title, text, Icon, iconColor, iconBackground }) => (
          <li key={title} className="flex min-h-10 items-center gap-2">
            <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${iconBackground} ${iconColor}`}>
              <Icon className="size-4" strokeWidth={2.5} aria-hidden />
            </span>
            <div>
              <h3 className="text-[10px] font-semibold leading-4 text-slate-800 sm:text-xs">{title}</h3>
              <p className="text-[9px] leading-3 text-slate-500 sm:text-[10px]">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
