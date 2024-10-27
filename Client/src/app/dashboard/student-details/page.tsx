"use client";

import { useState } from "react";
import { Search, FileText, Briefcase } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

type Student = {
  id: number;
  name: string;
  registrationId: string;
  course: string;
  printDocuments: string[];
  internshipApplications: string[];
};

export default function StudentDetailsPage() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Alice Johnson",
      registrationId: "REG001",
      course: "Computer Science",
      printDocuments: ["Thesis.pdf", "Assignment1.pdf"],
      internshipApplications: ["Tech Corp", "Innovate Inc"],
    },
    {
      id: 2,
      name: "Bob Smith",
      registrationId: "REG002",
      course: "Physics",
      printDocuments: ["Lab Report.pdf"],
      internshipApplications: ["Research Lab"],
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

  const collegeList = [
    "College of Engineering",
    "Business School",
    "Arts and Sciences",
    "Medical School",
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
          Student Details
        </CardTitle>
        <CardDescription className="text-sm md:text-base text-gray-400">
          View and manage student information, print documents, and internship
          applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Responsive Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* College Select */}
          <div className="w-full sm:w-1/3">
            <Label
              htmlFor="college-select"
              className="text-sm font-medium mb-1.5 block text-secondary"
            >
              Select College
            </Label>
            <Select onValueChange={(value) => setSelectedCollege(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a College" />
              </SelectTrigger>
              <SelectContent>
                {collegeList.map((college, index) => (
                  <SelectItem key={index} value={college}>
                    {college}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Section */}
          <div className="flex-1">
            <Label
              htmlFor="search"
              className="text-sm font-medium mb-1.5 block text-secondary"
            >
              Search Students
            </Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Search by name, ID, or course"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="icon" className="shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Registration ID
                </TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div>{student.name}</div>
                    <div className="text-sm text-muted-foreground sm:hidden">
                      {student.registrationId}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {student.registrationId}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.course}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedStudent(student)}
                            className="h-8 w-8"
                          >
                            <FileText className="h-4 w-4 text-secondary" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-lg">
                              Print Documents
                            </DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h3 className="font-medium text-base mb-3">
                              Documents for {selectedStudent?.name}
                            </h3>
                            <ul className="space-y-2">
                              {selectedStudent?.printDocuments.map(
                                (doc, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    {doc}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedStudent(student)}
                            className="h-8 w-8"
                          >
                            <Briefcase className="h-4 w-4 text-primary" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-lg">
                              Internship Applications
                            </DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h3 className="font-medium text-base mb-3">
                              Applications for {selectedStudent?.name}
                            </h3>
                            <ul className="space-y-2">
                              {selectedStudent?.internshipApplications.map(
                                (app, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    {app}
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
