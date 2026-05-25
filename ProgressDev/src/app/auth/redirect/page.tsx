"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as any).role || "stakeholder";
      router.push(`/${role}/dashboard`);
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-[#13131a] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-[#7c5dfa] animate-spin" />
      <p className="text-[#888eb0] text-sm animate-pulse">Redirecting you to dashboard...</p>
    </div>
  );
}
