"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { AuthLayout } from "@/components/layout/auth-layout";

const authPages = ["/login", "/signup","/privacy"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);

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
            {isAuthPage ? (
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
