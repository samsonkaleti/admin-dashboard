"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

type TechUniversityFormProps = {
  initialData?: Announcement | null;
  onSubmit: (data: FormValues) => void;
};

const TechUniversityForm = ({
  initialData,
  onSubmit,
}: TechUniversityFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "Welcome to Tech University",
      description:
        "Discover the latest updates and courses offered at Tech University.",
      imageUrl: "https://example.com/images/welcome-tech-university.jpg",
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
        <CardDescription>
          Enter details for the Tech University announcement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
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
};

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Welcome to Tech University",
    description:
      "Discover the latest updates and courses offered at Tech University.",
    imageUrl: "https://example.com/images/welcome-tech-university.jpg",
    allowAll: true,
    specificCollege: null,
    excludeCollege: null,
    order: 1,
  },
  {
    id: "2",
    title: "New Computer Science Course",
    description: "Enroll in our new AI and Machine Learning course.",
    imageUrl: "https://example.com/images/cs-course.jpg",
    allowAll: false,
    specificCollege: "engineering",
    excludeCollege: null,
    order: 2,
  },
];

export function TechUniversityTable() {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(mockAnnouncements);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const handleSave = (updatedAnnouncement: Announcement) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === updatedAnnouncement.id ? updatedAnnouncement : a
      )
    );
    setEditingAnnouncement(null);
  };

  return (
    <div className="container mx-auto py-10">
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
          {announcements.map((announcement) => (
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
                        onSubmit={(data: FormValues) =>
                          handleSave({ ...data, id: announcement.id })
                        }
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
