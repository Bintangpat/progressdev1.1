"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = session?.user;
  const role = (user as any)?.role || "stakeholder";
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const getDashboardRoute = () => {
    return `/${role}/dashboard`;
  };

  const redirectToDashboard = () => {
    const route = getDashboardRoute();
    router.push(route);
  };

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    getDashboardRoute,
    redirectToDashboard,
    session,
  };
};
