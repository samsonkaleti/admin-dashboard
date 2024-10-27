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
  DialogDescription,
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

  const handleNew = () => {
    setNewUpload({ year: "", course: "", subject: "", fileName: "" });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setPDFUploads([...pdfUploads, { ...newUpload, id: Date.now() }]);
    setNewUpload({ year: "", course: "", subject: "", fileName: "" });
    setIsDialogOpen(false);
  };

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
      setIsDialogOpen(true);
    }
  };

  const handleUpdate = () => {
    setPDFUploads(
      pdfUploads.map((upload) =>
        upload.id === editingId ? { ...upload, ...newUpload } : upload
      )
    );
    setNewUpload({ year: "", course: "", subject: "", fileName: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setPDFUploads(pdfUploads.filter((upload) => upload.id !== id));
  };

  return (
    <Card className="w-full max-w-[95vw] mx-auto">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
          PDF Upload Manager
        </CardTitle>
        <CardDescription className="text-sm md:text-base text-muted-foreground">
          Organize and manage PDF uploads across different academic years,
          courses, and subjects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <Button
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleNew}
          >
            <FileUp className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Upload New PDF</span>
            <span className="sm:hidden">Upload</span>
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-primary">
                {editingId ? "Edit PDF Upload" : "Upload New PDF"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingId
                  ? "Modify the existing PDF details"
                  : "Add a new PDF to the collection"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="year"
                  className="text-right text-sm font-medium"
                >
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
                <Label
                  htmlFor="course"
                  className="text-right text-sm font-medium"
                >
                  Course
                </Label>
                <Input
                  id="course"
                  value={newUpload.course}
                  onChange={(e) =>
                    setNewUpload({ ...newUpload, course: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Enter course name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="subject"
                  className="text-right text-sm font-medium"
                >
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={newUpload.subject}
                  onChange={(e) =>
                    setNewUpload({ ...newUpload, subject: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Enter subject name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="file"
                  className="text-right text-sm font-medium"
                >
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
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {editingId ? "Update PDF" : "Upload PDF"}
            </Button>
          </DialogContent>
        </Dialog>

        <div className="rounded-md border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Year</TableHead>
                  <TableHead className="font-semibold hidden sm:table-cell">
                    Course
                  </TableHead>
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">
                    File Name
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfUploads.map((upload) => (
                  <TableRow key={upload.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{upload.year}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {upload.course}
                    </TableCell>
                    <TableCell>{upload.subject}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                      {upload.fileName}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(upload.id)}
                          className="h-8 w-8 hover:bg-primary/10"
                        >
                          <Pencil className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(upload.id)}
                          className="h-8 w-8 hover:bg-destructive/10"
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
        </div>
      </CardContent>
    </Card>
  );
}
