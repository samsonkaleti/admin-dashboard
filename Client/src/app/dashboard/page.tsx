import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Overview from "./components/overview";
import RecentUploads from "./components/recent-uploads";
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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
            Dashboard Overview
          </CardTitle>
        </div>
        <p className="text-sm md:text-base text-gray-400">
          Monitor your key metrics and recent activities
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between space-x-2">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {stat.change}
                  </span>
                </div>
                <div className="mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-400">
                    {stat.title}
                  </p>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                    {stat.value}
                  </h2>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-secondary">
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Overview />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-secondary">
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <RecentUploads />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
