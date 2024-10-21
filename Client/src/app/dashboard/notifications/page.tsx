"use client";

import { useState } from "react";
import { Bell, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: number;
  message: string;
  date: string;
  type: "info" | "success" | "warning";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "New user registered",
      date: "2024-03-15 10:30 AM",
      type: "info",
    },
    {
      id: 2,
      message: "PDF upload completed",
      date: "2024-03-14 2:45 PM",
      type: "success",
    },
    {
      id: 3,
      message: "Print request approved",
      date: "2024-03-13 11:20 AM",
      type: "success",
    },
    {
      id: 4,
      message: "Low paper supply in Printer 2",
      date: "2024-03-12 9:15 AM",
      type: "warning",
    },
  ]);

  const handleDelete = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="space-y-1 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-gray-800">
            Notifications
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {notifications.length} New
          </Badge>
        </div>
        <CardDescription className="text-gray-600">
          View and manage your notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-lg font-medium text-gray-800">
              No notifications
            </p>
            <p className="text-sm text-gray-600">You&aposre all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {getNotificationIcon(notification.type)}
                  <div>
                    <p className="font-medium text-gray-800">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-600">{notification.date}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(notification.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
