"use client";

import { useState } from "react";
import { Pencil, Trash2, FileUp } from "lucide-react";
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

type PDFUpload = {
  id: number;
  year: string;
  course: string;
  subject: string;
  fileName: string;
};

export default function PDFUploadPage() {
  const [pdfUploads, setPDFUploads] = useState<PDFUpload[]>([
    {
      id: 1,
      year: "2023",
      course: "Computer Science",
      subject: "Algorithms",
      fileName: "algorithms_2023.pdf",
    },
    {
      id: 2,
      year: "2022",
      course: "Physics",
      subject: "Quantum Mechanics",
      fileName: "quantum_mechanics_2022.pdf",
    },
  ]);
  
  const [newUpload, setNewUpload] = useState<Omit<PDFUpload, "id">>({
    year: "",
    course: "",
    subject: "",
    fileName: "",
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Open the dialog for a new entry and reset the form
  const handleNew = () => {
    setNewUpload({ year: "", course: "", subject: "", fileName: "" });
    setEditingId(null); // Make sure editing mode is off
    setIsDialogOpen(true);
  };

  // Add new PDF upload
  const handleAdd = () => {
    setPDFUploads([...pdfUploads, { ...newUpload, id: Date.now() }]);
    setNewUpload({ year: "", course: "", subject: "", fileName: "" });
    setIsDialogOpen(false); // Close dialog after adding
  };

  // Open the dialog for editing and load the selected entry
  const handleEdit = (id: number) => {
    const uploadToEdit = pdfUploads.find((upload) => upload.id === id);
    if (uploadToEdit) {
      setNewUpload({
        year: uploadToEdit.year,
        course: uploadToEdit.course,
        subject: uploadToEdit.subject,
        fileName: uploadToEdit.fileName,
      });
      setEditingId(id);
      setIsDialogOpen(true); // Open dialog when editing
    }
  };

  // Update existing PDF upload
  const handleUpdate = () => {
    setPDFUploads(
      pdfUploads.map((upload) =>
        upload.id === editingId ? { ...upload, ...newUpload } : upload
      )
    );
    setNewUpload({ year: "", course: "", subject: "", fileName: "" });
    setEditingId(null);
    setIsDialogOpen(false); // Close dialog after updating
  };

  const handleDelete = (id: number) => {
    setPDFUploads(pdfUploads.filter((upload) => upload.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-blue-500">PDF Upload by Year</CardTitle>
        <CardDescription className="text-blue-400">
          Manage PDF uploads for different academic years, courses, and subjects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
            onClick={handleNew} // Trigger the new form
          >
            <FileUp className="mr-2 h-4 w-4" /> Upload New PDF
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit PDF Upload" : "Upload New PDF"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Year
                  </Label>
                  <Select
                    value={newUpload.year}
                    onValueChange={(value) =>
                      setNewUpload({ ...newUpload, year: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {["2022", "2023", "2024"].map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course" className="text-right">
                    Course
                  </Label>
                  <Input
                    id="course"
                    value={newUpload.course}
                    onChange={(e) =>
                      setNewUpload({ ...newUpload, course: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    value={newUpload.subject}
                    onChange={(e) =>
                      setNewUpload({ ...newUpload, subject: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    File
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setNewUpload({
                        ...newUpload,
                        fileName: e.target.files?.[0]?.name || "",
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
                className="w-full"
              >
                {editingId ? "Update" : "Upload"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="hidden md:table-cell">File Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pdfUploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell>{upload.year}</TableCell>
                  <TableCell>{upload.course}</TableCell>
                  <TableCell>{upload.subject}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {upload.fileName}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(upload.id)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(upload.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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
