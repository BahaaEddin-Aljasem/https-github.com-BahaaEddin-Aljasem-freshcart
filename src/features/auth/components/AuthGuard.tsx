"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Spinner } from "@/components/shared/Loading/Spinner";
import { useSession } from "../hooks/useAuthMutations";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.authenticated) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/login?next=${next}`);
    }
  }, [isPending, pathname, router, session?.authenticated]);

  if (isPending || !session?.authenticated) return <Spinner label="Checking your account" />;
  return children;
}
