import { Navbar } from "@/app/dashboard/components/user-nav";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <Navbar />
      </header>
      <main className=" flex-1 flex items-center justify-center">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
