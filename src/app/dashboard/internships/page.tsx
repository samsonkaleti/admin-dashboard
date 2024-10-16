"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Download, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Internship = {
  id: number
  company: string
  position: string
  description: string
  applicants: string[]
}

export default function InternshipPage() {
  const [internships, setInternships] = useState<Internship[]>([
    { id: 1, company: "Tech Corp", position: "Software Engineer Intern", description: "Develop web applications", applicants: ["Alice Johnson", "Bob Smith"] },
    { id: 2, company: "Innovate Inc", position: "Data Science Intern", description: "Work on machine learning projects", applicants: ["Charlie Brown"] },
  ])
  const [newInternship, setNewInternship] = useState<Omit<Internship, "id" | "applicants">>({ company: "", position: "", description: "" })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null)

  const handleAdd = () => {
    setInternships([...internships, { ...newInternship, id: Date.now(), applicants: [] }])
    setNewInternship({ company: "", position: "", description: "" })
  }

  const handleEdit = (id: number) => {
    const internshipToEdit = internships.find(internship => internship.id === id)
    if (internshipToEdit) {
      setNewInternship({ company: internshipToEdit.company, position: internshipToEdit.position, description: internshipToEdit.description })
      setEditingId(id)
    }
  }

  const handleUpdate = () => {
    setInternships(internships.map(internship => 
      internship.id === editingId ? { ...internship, ...newInternship } : internship
    ))
    setNewInternship({ company: "", position: "", description: "" })
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    setInternships(internships.filter(internship => internship.id !== id))
  }

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Company,Position,Description,Applicants\n"
      + internships.map(internship => 
          `${internship.id},${internship.company},${internship.position},${internship.description},"${internship.applicants.join(', ')}"`
        ).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "internships.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Internship/Placement Management</CardTitle>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
        <CardDescription>Manage internship opportunities and view applicants.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Internship
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Internship" : "Add New Internship"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">Company</Label>
                  <Input
                    id="company"
                    value={newInternship.company}
                    onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">Position</Label>
                  <Input
                    id="position"
                    value={newInternship.position}
                    onChange={(e) => setNewInternship({ ...newInternship, position: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    value={newInternship.description}
                    onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={editingId ? handleUpdate : handleAdd} className="w-full">
                {editingId ? "Update" : "Add"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {internships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell className="font-medium">{internship.company}</TableCell>
                  <TableCell>{internship.position}</TableCell>
                  <TableCell className="hidden md:table-cell">{internship.description}</TableCell>
                  <TableCell>{internship.applicants.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(internship.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(internship.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setSelectedInternship(internship)}>
                            <Users className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Applicants for {selectedInternship?.position}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h3 className="font-semibold mb-2">Applicants:</h3>
                            <ul className="list-disc pl-4">
                              {selectedInternship?.applicants.map((applicant, index) => (
                                <li key={index}>{applicant}</li>
                              ))}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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