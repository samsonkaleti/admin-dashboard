import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Overview from "./dashboard/components/overview";
import RecentUploads from "./dashboard/components/recent-uploads";
import {
  ArrowUpIcon,
  UploadIcon,
  UserIcon,
  BriefcaseIcon,
  PrinterIcon,
} from "lucide-react";

const statsData = [
  {
    title: "Total Uploads",
    value: "1,234",
    change: "+20.1%",
    icon: UploadIcon,
  },
  {
    title: "Total Students",
    value: "856",
    change: "+12.5%",
    icon: UserIcon,
  },
  {
    title: "Active Internships",
    value: "342",
    change: "+8.2%",
    icon: BriefcaseIcon,
  },
  {
    title: "Print Jobs",
    value: "648",
    change: "+15.3%",
    icon: PrinterIcon,
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor your key metrics and recent activities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h2 className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentUploads />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
