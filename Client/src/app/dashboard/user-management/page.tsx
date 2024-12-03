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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface User {
  id: string
  username: string
  email: string
  role: "Admin" | "Uploader"
  active: boolean
}

interface UserFormData {
  id?: string
  username: string
  email: string
  password: any
  role: "Admin" | "Uploader"
  active: boolean
}

const defaultUser: UserFormData = {
  username: "",
  email: "",
  password: "",
  role: "Uploader",
  active: true,
}

function UserForm({ 
  user, 
  isEditMode, 
  isLoading, 
  onSubmit, 
  onCancel 
}: {
  user: UserFormData
  isEditMode: boolean
  isLoading: boolean
  onSubmit: (userData: UserFormData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<UserFormData>(user)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      {!isEditMode && (
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password || ""}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!isEditMode}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: "Admin" | "Uploader") =>
            setFormData({ ...formData, role: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Uploader">Uploader</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Switch
          id="status"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isEditMode ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  )
}

export default function Component() {
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
      setSelectedUser({ ...userToEdit, password: undefined })
      setIsEditMode(true)
      setIsDialogOpen(true)
    }
  }

  const handleUpdate = async (userData: UserFormData) => {
    try {
      if (!isEditMode || !userData.id) throw new Error("Invalid edit operation")
      await updateUserMutation.mutateAsync({
        userId: userData.id,
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
              {users?.map((user) => (
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