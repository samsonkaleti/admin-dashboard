"use client";

import { useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Notification = {
  id: number;
  message: string;
  date: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "New user registered", date: "2024-03-15 10:30 AM" },
    { id: 2, message: "PDF upload completed", date: "2024-03-14 2:45 PM" },
    { id: 3, message: "Print request approved", date: "2024-03-13 11:20 AM" },
  ]);

  const handleDelete = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Notifications</CardTitle>
        <CardDescription>View and manage your notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-4">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-lg font-medium">No notifications</p>
            <p className="text-sm text-muted-foreground">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.date}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(notification.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
