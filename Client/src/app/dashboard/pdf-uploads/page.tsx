"use client"

import { useEffect, useState } from "react"
import { Pencil, Trash2, FileUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCreatePdf } from "@/app/hooks/pdfUploads/useCreatePdfUpload"
import { useGetAllPdfs } from "@/app/hooks/pdfUploads/useGetAllPdfs"
import { useUpdatePdf } from "@/app/hooks/pdfUploads/useUpdatePdf"
import { useDeletePdf } from "@/app/hooks/pdfUploads/useDeletePdf"
import { useDownloadPdf } from "@/app/hooks/pdfUploads/useDownloadPdf"

type PDFUpload = {
  id: number
  academicYear: {
    year: string
    semester: string
  }
  regulation: string
  course: string
  subject: string
  files: File[]
  uploadDate: string
}

const PDFUploadPage = () => {
  const [newUpload, setNewUpload] = useState<Omit<PDFUpload, "id" | "files" | "uploadDate">>({
    academicYear: { year: "", semester: "" },
    regulation: "",
    course: "",
    subject: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
  const semesters = ["1st Semester", "2nd Semester"]
  const regulations = ["R24", "R20", "R19", "R16", "R13"]
  
  const { data: pdfUploads, isLoading, isError, error } = useGetAllPdfs()
  const createPdfMutation = useCreatePdf()
  const updatePdfMutation = useUpdatePdf()
  const deletePdfMutation = useDeletePdf()
  const { downloadPdf, isDownloading } = useDownloadPdf()

  const handleNew = () => {
    setNewUpload({
      academicYear: { year: "", semester: "" },
      regulation: "",
      course: "",
      subject: "",
    })
    setSelectedFiles([])
    setEditingId(null)
    setIsDialogOpen(true)
  }
  useEffect(() => {
    setIsClient(true)
  }, [])

   const handleAdd = async () => {
    try {
      if (selectedFiles.length === 0) {
        throw new Error("Please upload at least one PDF file")
      }

      const formData = new FormData()
      formData.append("academicYear.year", newUpload.academicYear.year)
      formData.append("academicYear.semester", newUpload.academicYear.semester)
      formData.append("regulation", newUpload.regulation)
      formData.append("course", newUpload.course)
      formData.append("subject", newUpload.subject)
      selectedFiles.forEach((file) => formData.append("files", file))

      await createPdfMutation.mutateAsync(formData)

      setIsDialogOpen(false)
      setNewUpload({
        academicYear: { year: "", semester: "" },
        regulation: "",
        course: "",
        subject: "",
      })
      setSelectedFiles([])

      
    } catch (error) {
      console.error("Error uploading PDF:", error)
    }
  }

  const handleEdit = (id: number) => {
    const pdfToEdit = pdfUploads?.find(pdf => pdf.id === id)
    if (pdfToEdit) {
      setNewUpload({
        academicYear: pdfToEdit.academicYear,
        regulation: pdfToEdit.regulation,
        course: pdfToEdit.course,
        subject: pdfToEdit.subject,
      })
      setEditingId(id)
      setIsDialogOpen(true)
    }
  }

  const handleUpdate = async () => {
    if (editingId === null) return

    try {
      const updatedPdf: PDFUpload = {
        id: editingId,
        ...newUpload,
        files: selectedFiles,
        uploadDate: new Date().toISOString(),
      }

      await updatePdfMutation.mutateAsync(updatedPdf)

      setIsDialogOpen(false)
      setEditingId(null)
      setNewUpload({
        academicYear: { year: "", semester: "" },
        regulation: "",
        course: "",
        subject: "",
      })
      setSelectedFiles([])
    } catch (error) {
      console.error("Error updating PDF:", error)
    }
  }
  const handleDeleteConfirmation = (id: number) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (deletingId === null) return

    try {
      await deletePdfMutation.mutateAsync(deletingId)
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
    } catch (error) {
      console.error("Error deleting PDF:", error)
     }
  }

   

  const handleDownload = async (id: number, fileIndex: number) => {
    try {
      await downloadPdf(id, fileIndex)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      // Handle error (e.g., show error message to user)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

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
                  value={newUpload.academicYear.year}
                  onValueChange={(value) =>
                    setNewUpload({
                      ...newUpload,
                      academicYear: { ...newUpload.academicYear, year: value },
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="semester"
                  className="text-right text-sm font-medium"
                >
                  Semester
                </Label>
                <Select
                  value={newUpload.academicYear.semester}
                  onValueChange={(value) =>
                    setNewUpload({
                      ...newUpload,
                      academicYear: { ...newUpload.academicYear, semester: value },
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="regulation"
                  className="text-right text-sm font-medium"
                >
                  Regulation
                </Label>
                <Select
                  value={newUpload.regulation}
                  onValueChange={(value) =>
                    setNewUpload({ ...newUpload, regulation: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select regulation" />
                  </SelectTrigger>
                  <SelectContent>
                    {regulations.map((regulation) => (
                      <SelectItem key={regulation} value={regulation}>
                        {regulation}
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
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="file"
                  className="text-right text-sm font-medium"
                >
                  File(s)
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    setSelectedFiles(Array.from(e.target.files || []))
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button
              onClick={editingId ? handleUpdate : handleAdd}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={createPdfMutation.isPending || updatePdfMutation.isPending}
            >
              {createPdfMutation.isPending || updatePdfMutation.isPending
                ? "Processing..."
                : editingId
                ? "Update PDF"
                : "Upload PDF"}
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this PDF? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deletePdfMutation.isPending}>
                {deletePdfMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="rounded-md border border-border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Year</TableHead>
                  <TableHead className="font-semibold">Semester</TableHead>
                  <TableHead className="font-semibold hidden sm:table-cell">
                    Regulation
                  </TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">
                    Course
                  </TableHead>
                  <TableHead className="font-semibold">Subject</TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">
                    Files
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfUploads?.map((upload) => (
                  <TableRow key={upload.id}>
                    <TableCell>{upload.academicYear.year}</TableCell>
                    <TableCell>{upload.academicYear.semester}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {upload.regulation}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {upload.course}
                    </TableCell>
                    <TableCell>{upload.subject}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {upload.files.length} file(s)
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        className="text-green-500"
                        onClick={() => handleEdit(upload.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDeleteConfirmation(upload.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {upload.files.map((file, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="text-blue-500"
                          onClick={() => handleDownload(upload.id, index)}
                          disabled={isDownloading}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PDFUploadPage;