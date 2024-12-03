"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useGetAllPdfs } from '../hooks/pdfUploads/useGetAllPdfs'
import { useGetUsers } from '../hooks/userMangementData/useGetUsers'

type Notification = {
  id: string
  message: string
  date: string
  type: "info" | "success" | "warning"
}

type NotificationContextType = {
  notifications: Notification[]
  deleteNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { data: pdfData } = useGetAllPdfs()
  const { data: userData } = useGetUsers()

  useEffect(() => {
    if (pdfData) {
      const newPdfNotifications = pdfData?.map((pdf) => ({
        id: `pdf-${pdf.id}`,
        message: `New PDF uploaded: ${pdf.files[0]?.fileName || 'Unnamed PDF'}`,
        date: new Date(pdf.uploadDate).toLocaleString(),
        type: "success" as const,
      }))
      setNotifications((prev) => [
        ...newPdfNotifications.filter((newNotif) => !prev.some((prevNotif) => prevNotif.id === newNotif.id)),
        ...prev,
      ])
    }
  }, [pdfData])

  useEffect(() => {
    if (userData?.users) {
      const newUserNotifications = userData.users?.map((user) => ({
        id: `user-${user.id}`,
        message: `New user registered: ${user.username}`,
        date: new Date().toLocaleString(),
        type: "info" as const,
      }))
      setNotifications((prev) => [
        ...newUserNotifications.filter((newNotif) => !prev.some((prevNotif) => prevNotif.id === newNotif.id)),
        ...prev,
      ])
    }
  }, [userData])

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}