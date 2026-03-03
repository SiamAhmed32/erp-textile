"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { TOKEN_NAME } from "@/lib/constants";

import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

import { navMain } from "@/lib/navigation";
import { PageLoader } from "@/components/reusables";

// Define module mapping based on shared navigation data
const MODULE_ROUTES: { [key: string]: string } = navMain.reduce(
  (acc, item) => {
    if (item.url) acc[item.url] = item.module;
    if (item.items) {
      item.items.forEach((subItem) => {
        if (subItem.url) acc[subItem.url] = item.module;
      });
    }
    return acc;
  },
  {} as { [key: string]: string },
);

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // @ts-ignore
  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem(TOKEN_NAME);

    if (!token) {
      router.push("/login");
      setIsLoading(false);
      return;
    }

    // RBAC Check
    if (user) {
      const isDashboard = pathname === "/";
      const userModules = user.modules || [];

      if (user.role !== "admin") {
        // Find required module for current path
        const requiredModule = Object.entries(MODULE_ROUTES).find(
          ([route, module]) =>
            pathname === route || pathname.startsWith(route + "/"),
        )?.[1];

        if (requiredModule && !userModules.includes(requiredModule)) {
          // Special case: if on dashboard and no access, redirect to first allowed route
          if (isDashboard) {
            const firstAllowedItem = navMain.find(
              (item) => item.module && userModules.includes(item.module),
            );
            const firstAllowedRoute =
              firstAllowedItem?.url ||
              navMain.find((item) =>
                item.items?.some(() => userModules.includes(item.module)),
              )?.items?.[0]?.url;

            if (firstAllowedRoute) {
              router.push(firstAllowedRoute);
              return;
            }
          }

          setIsUnauthorized(true);
          setIsLoading(false);
          return;
        }
      }
    }

    setIsUnauthorized(false);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router, pathname, user]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isUnauthorized) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <div className="flex flex-col items-center gap-4 text-center p-4">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-alert"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            You do not have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-secondary text-primary-foreground rounded-md hover:opacity-90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
