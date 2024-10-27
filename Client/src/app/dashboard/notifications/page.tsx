"use client"
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
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case "warning":
        return (
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
        );
      default:
        return <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
            Notifications
            <Badge
              variant="secondary"
              className="ml-2 bg-primary/10 text-primary text-xs md:text-sm"
            >
              {notifications.length} New
            </Badge>
          </CardTitle>
        </div>
        <CardDescription className="text-sm md:text-base text-gray-400">
          View and manage your system notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            <p className="mt-2 text-base sm:text-lg font-medium text-gray-800">
              No notifications
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              You&apos;re all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start justify-between p-3 sm:p-4 rounded-lg border hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  {getNotificationIcon(notification.type)}
                  <div>
                    <p className="text-sm sm:text-base font-medium">
                      {notification.message}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      {notification.date}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(notification.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
