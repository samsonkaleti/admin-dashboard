"use client";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Sidebar } from "./dashboard/components/sidebar";
import { Navbar } from "./dashboard/components/user-nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-14 items-center justify-between py-4 lg:pl-64">
        <p className="text-sm text-muted-foreground">
          © 2024 College Admin. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

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
            <div className="relative min-h-screen flex flex-col">
              {/* Header */}
              <header className="sticky top-0 z-50 w-full border-b bg-background">
                <Navbar />
              </header>

              <div className="flex-1 flex">
                {/* Sidebar - Hidden on mobile/tablet */}
                <aside className="hidden lg:block fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background">
                  <Sidebar />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-64">
                  <div className="container py-0">{children}</div>
                </main>
              </div>

              {/* Footer */}
              <Footer />
            </div>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
