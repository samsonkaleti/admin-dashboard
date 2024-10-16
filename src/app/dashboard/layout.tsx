import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Sidebar } from "./components/sidebar";
import { UserNav } from "./components/user-nav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard for college management",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-50 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="College Logo"
                width={32}
                height={32}
              />
              <span className="font-bold">College Admin</span>
            </Link>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 container py-8">{children}</main>
        <footer className="border-t bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} College Admin. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
