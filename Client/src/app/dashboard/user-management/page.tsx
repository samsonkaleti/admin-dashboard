'use client'

import { useState } from "react"
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useGetUsers } from "@/app/hooks/userMangementData/useGetUsers"
import { useUpdateUser } from "@/app/hooks/userMangementData/useUpdateUser"
import { useDeleteUser } from "@/app/hooks/userMangementData/useDeleteUser"
import { useCreateUser } from "@/app/hooks/userMangementData/useCreateUser"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { UserForm } from "@/app/components/Forms/userForm"
import { toast } from "sonner"

interface User {
  id: string
  username: string
  email: string
  role: "Admin" | "Uploader"
  active: boolean
}

interface UserFormData extends Omit<User, 'id'> {
  password: string
}

const defaultUser: UserFormData = {
  username: "",
  email: "",
  password: "",
  role: "Uploader",
  active: true,
}

export default function UserManagementPage() {
  const { data: fetchedUsers, isLoading: isLoadingUsers } = useGetUsers()
  const updateUserMutation = useUpdateUser()
  const createUserMutation = useCreateUser()
  const deleteUserMutation = useDeleteUser()

  const users = fetchedUsers?.users || []
  const [selectedUser, setSelectedUser] = useState<UserFormData>(defaultUser)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (userId: string) => {
    const userToEdit = users.find((user) => user.id === userId)
    if (userToEdit) {
      setSelectedUser({ ...userToEdit, password: '' })
      setIsEditMode(true)
      setIsDialogOpen(true)
    }
  }

  const handleUpdate = async (userData: UserFormData) => {
    try {
      if (!isEditMode) throw new Error("Not in edit mode")
      await updateUserMutation.mutateAsync({
        userId: users.find(u => u.username === userData.username)?.id || '',
        userData: {
          email: userData.email,
          role: userData.role,
          active: userData.active,
          ...(userData.password ? { password: userData.password } : {})
        },
      })
      toast.success("User updated successfully")
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      )
    }
  }

  const handleCreate = async (userData: UserFormData) => {
    try {
      await createUserMutation.mutateAsync(userData)
      toast.success("User created successfully")
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create user"
      )
    }
  }

  const handleDelete = (userId: string) => {
    if (!userId) return
    deleteUserMutation.mutate(userId)
  }

  const resetForm = () => {
    setSelectedUser(defaultUser)
    setIsEditMode(false)
  }

  if (isLoadingUsers) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
            User Management
          </CardTitle>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-lg text-secondary">
                  {isEditMode ? "Edit User" : "Add New User"}
                </DialogTitle>
              </DialogHeader>
              <UserForm
                user={selectedUser}
                isEditMode={isEditMode}
                isLoading={
                  createUserMutation.isPending || updateUserMutation.isPending
                }
                onSubmit={isEditMode ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="text-sm md:text-base text-gray-400">
          Manage admin and uploader accounts with role-based access control.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.role}
                  </TableCell>
                  <TableCell>{user.active ? "Active" : "Inactive"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(user.id)}
                      className="mr-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}