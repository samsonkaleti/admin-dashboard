import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./dashboard/components/sidebar";
import { UserNav } from "./dashboard/components/user-nav"; 
import { Search } from "./dashboard/components/search";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "College Admin Dashboard",
  description: "Admin dashboard for college management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
