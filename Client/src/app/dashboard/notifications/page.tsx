"use client"

import { Bell, Trash2, Upload, UserPlus, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from '@/app/context/notifcation'

export default function NotificationsPage() {
  const { notifications, deleteNotification } = useNotifications()

  const getNotificationIcon = (type: "info" | "success" | "warning") => {
    switch (type) {
      case "success":
        return <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
      case "info":
        return <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
    }
  }

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
                  onClick={() => deleteNotification(notification.id)}
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
  )
}