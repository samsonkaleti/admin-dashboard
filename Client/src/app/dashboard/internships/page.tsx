"use client";

import { useState } from "react";
import { Pencil, Trash2, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type Internship = {
  id: number;
  company: string;
  position: string;
  description: string;
  applicants: string[];
};

export default function InternshipPage() {
  const [internships, setInternships] = useState<Internship[]>([
    {
      id: 1,
      company: "Tech Corp",
      position: "Software Engineer Intern",
      description: "Develop web applications",
      applicants: ["Alice Johnson", "Bob Smith"],
    },
    {
      id: 2,
      company: "Innovate Inc",
      position: "Data Science Intern",
      description: "Work on machine learning projects",
      applicants: ["Charlie Brown"],
    },
  ]);
  const [newInternship, setNewInternship] = useState<
    Omit<Internship, "id" | "applicants">
  >({ company: "", position: "", description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);

  const handleAdd = () => {
    setInternships([
      ...internships,
      { ...newInternship, id: Date.now(), applicants: [] },
    ]);
    setNewInternship({ company: "", position: "", description: "" });
  };

  const handleEdit = (id: number) => {
    const internshipToEdit = internships.find(
      (internship) => internship.id === id
    );
    if (internshipToEdit) {
      setNewInternship({
        company: internshipToEdit.company,
        position: internshipToEdit.position,
        description: internshipToEdit.description,
      });
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    setInternships(
      internships.map((internship) =>
        internship.id === editingId
          ? { ...internship, ...newInternship }
          : internship
      )
    );
    setNewInternship({ company: "", position: "", description: "" });
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setInternships(internships.filter((internship) => internship.id !== id));
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Company,Position,Description,Applicants\n" +
      internships
        .map(
          (internship) =>
            `${internship.id},${internship.company},${internship.position},${
              internship.description
            },"${internship.applicants.join(", ")}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "internships.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold text-blue-500">
            Internship/Placement Management
          </CardTitle>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
        <CardDescription className="text-blue-400">
          Manage internship opportunities and view applicants.
        </CardDescription>
      </CardHeader>
      <CardContent>


        <div className="rounded-md border border-gray-300 bg-gray-50">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[200px] text-gray-700">
                  Company
                </TableHead>
                <TableHead className="text-gray-700">Position</TableHead>
                <TableHead className="hidden md:table-cell text-gray-700">
                  Description
                </TableHead>
                <TableHead className="text-gray-700">Applicants</TableHead>
                <TableHead className="text-right text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {internships.map((internship, index) => (
                <TableRow
                  key={internship.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="font-medium text-gray-800">
                    {internship.company}
                  </TableCell>
                  <TableCell>{internship.position}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {internship.description}
                  </TableCell>
                  <TableCell>{internship.applicants.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(internship.id)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(internship.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedInternship(internship)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-6">
                          <DialogHeader>
                            <DialogTitle>
                              Applicants for {selectedInternship?.position}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h3 className="font-semibold mb-2">Applicants:</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {selectedInternship?.applicants.map(
                                (applicant, index) => (
                                  <li key={index} className="text-gray-800">
                                    {applicant}
                                  </li>
                                )
                              )}
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
  );
}
