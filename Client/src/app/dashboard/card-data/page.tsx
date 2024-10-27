"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCards, useCreateAnnouncement, useDeleteAnnouncement, useUpdateAnnouncement } from "@/app/hooks/cardData/useCardData";
const   API_BASE_URL = 'http://localhost:5001/api';
// Types
type Announcement = {
  id: string;
  title: string;
  description: string;
  imageUrl: string; 
  allowAll: boolean;
  specificCollege: string | null;
  excludeCollege: string | null;
  order: number;
};

type AnnouncementInput = Omit<Announcement, "id">;

// Form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid URL"),
  allowAll: z.boolean(),
  specificCollege: z.string().nullable(),
  excludeCollege: z.string().nullable(),
  order: z.number().int().positive("Order must be a positive integer"),
});

type FormValues = z.infer<typeof formSchema>;


// TechUniversityForm component
type TechUniversityFormProps = {
  initialData?: Announcement | null;
  onSubmit: (data: FormValues) => void;
};

function TechUniversityForm({ initialData, onSubmit }: { initialData?: Announcement | null; onSubmit: (data: FormValues) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      imageUrl: "",
      allowAll: true,
      specificCollege: null,
      excludeCollege: null,
      order: 1,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tech University Form</CardTitle>
        <CardDescription>Enter details for the Tech University announcement</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowAll"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Allow All</FormLabel>
                    <FormDescription>
                      Check this if the announcement is for all colleges
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specificCollege"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific College</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a college" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excludeCollege"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exclude College</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a college to exclude" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// TechUniversityTable component
export default function TechUniversityTable() {
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: cards, isLoading, error } = useCards();
  const createAnnouncementMutation = useCreateAnnouncement();
  const updateAnnouncementMutation = useUpdateAnnouncement();
  const deleteAnnouncementMutation = useDeleteAnnouncement();

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement({
      ...announcement,
      imageUrl: announcement.imageUrl || "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncementMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleSave = async (updatedAnnouncement: AnnouncementInput) => {
    try {
      if (editingAnnouncement) {
        await updateAnnouncementMutation.mutateAsync({
          id: editingAnnouncement.id,
          ...updatedAnnouncement,
        });
        setEditingAnnouncement(null);
      }
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  const handleAdd = async (newAnnouncement: AnnouncementInput) => {
  try {
    await createAnnouncementMutation.mutateAsync(newAnnouncement);
    setIsAddDialogOpen(false);
  } catch (error) {
    console.error("Error adding announcement:", error);
  }
};

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cards</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Card Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Announcement</DialogTitle>
            </DialogHeader>
            <TechUniversityForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Allow All</TableHead>
            <TableHead>Specific College</TableHead>
            <TableHead>Exclude College</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards?.map((announcement: Announcement) => (
            <TableRow key={announcement.id}>
              <TableCell>{announcement.title}</TableCell>
              <TableCell>{announcement.description}</TableCell>
              <TableCell>{announcement.allowAll ? "Yes" : "No"}</TableCell>
              <TableCell>{announcement.specificCollege || "N/A"}</TableCell>
              <TableCell>{announcement.excludeCollege || "N/A"}</TableCell>
              <TableCell>{announcement.order}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Announcement</DialogTitle>
                      </DialogHeader>
                      <TechUniversityForm
                        initialData={editingAnnouncement}
                        onSubmit={handleSave}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
