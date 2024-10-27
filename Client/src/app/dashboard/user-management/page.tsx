"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "uploader";
  active: boolean;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      active: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "uploader",
      active: true,
    },
  ]);

  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    role: "uploader",
    active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resetForm = () => {
    setNewUser({ name: "", email: "", role: "uploader", active: true });
    setEditingId(null);
    setIsEditMode(false);
    setIsDialogOpen(false);
  };

  const handleAdd = () => {
    setUsers([...users, { ...newUser, id: Date.now() }]);
    resetForm();
  };

  const handleEdit = (id: number) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setNewUser({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        active: userToEdit.active,
      });
      setEditingId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    }
  };

  const handleUpdate = () => {
    setUsers(
      users.map((user) =>
        user.id === editingId ? { ...user, ...newUser } : user
      )
    );
    resetForm();
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleToggleActive = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
            User Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <div className="grid gap-4 py-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium "
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium "
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="role"
                    className="text-sm font-medium"
                  >
                    Role
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "admin" | "uploader") =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="uploader">Uploader</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newUser.active}
                    onCheckedChange={(checked) =>
                      setNewUser({ ...newUser, active: checked })
                    }
                  />
                  <Label
                    htmlFor="active"
                    className="text-sm font-medium "
                  >
                    Active Status
                  </Label>
                </div>
              </div>
              <Button
                onClick={isEditMode ? handleUpdate : handleAdd}
                className="w-full"
              >
                {isEditMode ? "Update User" : "Add User"}
              </Button>
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
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>{user.name}</div>
                    <div className="text-sm text-muted-foreground sm:hidden">
                      {user.email}
                    </div>
                    <div className="text-sm text-muted-foreground md:hidden sm:block">
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.role}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.active}
                      onCheckedChange={() => handleToggleActive(user.id)}
                      className="h-5 w-9"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(user.id)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4 text-secondary" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
