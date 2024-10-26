"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./dashboard/components/sidebar";
import { UserNav } from "./dashboard/components/user-nav"; 
import { Search } from "./dashboard/components/search";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden ">
              <header className="sticky top-0 z-50 border-b bg-background px-4">
                <div className="container flex h-16 items-center justify-between py-4">
                  <h1 className="text-2xl font-bold">College Admin</h1> 
                  <Search />
                  <UserNav />
                </div>
              </header>
              <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}