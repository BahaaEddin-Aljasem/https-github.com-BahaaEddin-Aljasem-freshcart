import Link from "next/link";
import { Headset } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar/SearchBar";
import { TopBar } from "./TopBar";
import { Logo } from "./Logo";
import { MainNavigation } from "./MainNavigation";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[1860px] pt-0 lg:w-[calc(100%-60px)]">
        <TopBar />
        <div className="relative mx-auto flex min-h-12 max-w-265 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 py-1 md:min-h-17.5 md:px-4 md:py-3 xl:h-12.5 xl:min-h-12.5 xl:flex-nowrap xl:gap-5 xl:px-4 xl:py-0 2xl:px-0">
          <div className="order-1 shrink-0"><Logo /></div>
          <SearchBar
            id="header-search"
            className="order-3 hidden basis-full md:flex md:max-w-sm md:flex-1 xl:order-2 xl:basis-auto xl:max-w-md 2xl:max-w-161.25"
          />
          <div className="order-2 ml-auto flex shrink-0 items-center gap-2 md:gap-3 xl:order-3 xl:ml-0 xl:gap-5">
            <MainNavigation />
            <Link href="mailto:support@freshcart.com" className="hidden items-center gap-2 border-r border-slate-200 pr-5 xl:flex">
              <span className="grid size-9 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <Headset className="size-4" aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-[10px] text-slate-500">Support</span>
                <span className="block text-xs font-semibold text-slate-800">24/7 Help</span>
              </span>
            </Link>
            <HeaderActions />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
