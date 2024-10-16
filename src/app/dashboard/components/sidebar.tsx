"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  GraduationCap,
  CreditCard,
  FileUp,
  Printer,
  Users,
  Briefcase,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "College Data",
    href: "/dashboard/college-data",
    icon: GraduationCap,
  },
  {
    title: "Card Data",
    href: "/dashboard/card-data",
    icon: CreditCard,
  },
  {
    title: "PDF Uploads",
    href: "/dashboard/pdf-uploads",
    icon: FileUp,
  },
  {
    title: "Print Station",
    href: "/dashboard/print-station",
    icon: Printer,
  },
  {
    title: "Student Details",
    href: "/dashboard/student-details",
    icon: Users,
  },
  {
    title: "Internship/Placement",
    href: "/dashboard/internships",
    icon: Briefcase,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-64 border-r bg-background">
      <ScrollArea className="h-full py-6">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Admin Dashboard
            </h2>
            <div className="space-y-1">
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-muted"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </nav>
  );
}
