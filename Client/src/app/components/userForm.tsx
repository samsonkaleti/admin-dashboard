import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface User {
  id: string;
  username: string;
  email: string;
  role: "Admin" | "Uploader";
  active: boolean;
}

interface UserFormProps {
  user: User;
  isEditMode: boolean;
  isLoading: boolean;
  onSubmit: (userData: User) => void;
  onCancel: () => void;
}

export function UserForm({ 
  user, 
  isEditMode, 
  isLoading, 
  onSubmit, 
  onCancel 
}: UserFormProps) {
  const [formData, setFormData] = useState<User>(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, active: checked })
          }
        />
        <Label htmlFor="active">Active Status</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : (isEditMode ? "Update User" : "Add User")}
        </Button>
      </div>
    </form>
  );
}