"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthLayout } from "@/components/layout/auth-layout";

const authPages = ["/", "/signup", "/privacy","/login",];
const validRoutes = [
  "/dashboard",
  "/dashboard/college-data",
  "/dashboard/card-data",
  "/dashboard/pdf-uploads",
  "/dashboard/print-station",
  "/dashboard/student-details",
  "/dashboard/internships",
  "/dashboard/user-management",
  "/dashboard/events",
  "/dashboard/notifications",
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);
  const isValidRoute = validRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            {/* Show AuthLayout if it's an auth page or if the route is invalid */}
            {isAuthPage || !isValidRoute ? (
              <AuthLayout>{children}</AuthLayout>
            ) : (
              <AppLayout>{children}</AppLayout>
            )}
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
