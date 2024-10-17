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
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

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

  const collegeList = ["College of Engineering", "Business School", "Arts and Sciences", "Medical School"];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-blue-500">Student Details</CardTitle>
        <CardDescription className="text-blue-400">
          View and manage student information, print documents, and internship applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4 justify-between">
          {/* Dropdown for selecting college */}
          <div className="w-1/3">
            <Label htmlFor="college-select">Select College</Label>
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

          {/* Search box */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search by name, registration ID, or course"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Student Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Registration ID</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.registrationId}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.course}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {/* Print Documents Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Print Documents</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h3 className="font-semibold mb-2">
                              Documents for {selectedStudent?.name}
                            </h3>
                            <ul className="list-disc pl-4">
                              {selectedStudent?.printDocuments.map((doc, index) => (
                                <li key={index}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Internship Applications Button */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Briefcase className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Internship Applications</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <h3 className="font-semibold mb-2">
                              Applications for {selectedStudent?.name}
                            </h3>
                            <ul className="list-disc pl-4">
                              {selectedStudent?.internshipApplications.map((app, index) => (
                                <li key={index}>{app}</li>
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
  );
}
