import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Overview from "./dashboard/components/overview";
import RecentUploads from "./dashboard/components/recent-uploads";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-[#1e293b]">
          Dashboard Overview
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            "Total Uploads",
            "Total Students",
            "Active Internships",
            "Print Jobs",
          ].map((title, index) => (
            <Card
              key={index}
              className="bg-white border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[#3b82f6]">
                  {title}
                </CardTitle>
                {/* Icon component here */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1e293b]">1,234</div>
                <p className="text-xs text-[#6366f1]">+20.1% from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 bg-white border-[#e2e8f0] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3b82f6]">Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3 bg-white border-[#e2e8f0] shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#3b82f6]">Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentUploads />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t border-[#e2e8f0] bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <p className="text-sm text-[#6366f1]">
            © {new Date().getFullYear()} College Admin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
