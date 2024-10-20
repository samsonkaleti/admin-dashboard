"use client";
import { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
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
import { v4 as uuidv4 } from "uuid";
import { saveAs } from "file-saver";

type Program = {
  name: string;
  specializations: string[];
  years: number[];
  regulations: {
    type: string;
    regulation: string;
    validYears: number[];
  }[];
};

type CollegeDetails = {
  address: string;
  contactNumber: string;
  email: string;
};

type CollegeData = {
  id: string;
  collegeName: string;
  regulatoryBody: string;
  domain: string;
  details: CollegeDetails[];
  programs: Program[];
};

const programOptions = [
  {
    name: "B.Tech",
    specializations: ["CSE", "ECE", "EEE"],
    years: [1, 2, 3, 4],
    regulations: [
      {
        type: "JNTUK",
        regulation: "R20",
        validYears: [2020, 2021, 2022, 2023],
      },
      {
        type: "Autonomous",
        regulation: "Autonomous Reg 2023",
        validYears: [2023, 2024],
      },
    ],
  },
  {
    name: "M.Tech",
    specializations: ["CSE", "VLSI", "Power Systems"],
    years: [1, 2],
    regulations: [
      {
        type: "JNTUK",
        regulation: "R19",
        validYears: [2019, 2020, 2021, 2022],
      },
    ],
  },
];

export default function CollegeDataPage() {
  const [collegeData, setCollegeData] = useState<CollegeData[]>([
    {
      id: uuidv4(),
      collegeName: "Greenfield University",
      regulatoryBody: "UGC",
      domain: "greenfield.edu",
      details: [
        {
          address: "123 University Street, Springfield",
          contactNumber: "123-456-7890",
          email: "info@greenfield.edu",
        },
      ],
      programs: [],
    },
    // ... other colleges
  ]);

  const [newData, setNewData] = useState<CollegeData>({
    id: "",
    collegeName: "",
    regulatoryBody: "",
    domain: "",
    details: [{ address: "", contactNumber: "", email: "" }],
    programs: [],
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");

  const handleAddOrUpdate = async () => {
    const updatedPrograms = selectedProgram
      ? [
          {
            name: selectedProgram,
            specializations: programOptions.find(
              (program) => program.name === selectedProgram
            )?.specializations || [],
            years: programOptions.find(
              (program) => program.name === selectedProgram
            )?.years || [],
            regulations: programOptions.find(
              (program) => program.name === selectedProgram
            )?.regulations || [],
          },
        ]
      : [];

    const collegeDataToSave = {
      ...newData,
      programs: updatedPrograms,
    };

    if (editIndex !== null) {
      const updatedData = [...collegeData];
      updatedData[editIndex] = collegeDataToSave;
      setCollegeData(updatedData);
    } else {
      const response = await fetch("/api/college", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collegeDataToSave),
      });
      if (response.ok) {
        const addedData = await response.json();
        setCollegeData([...collegeData, addedData]);
      }
    }
    setEditIndex(null); // Reset edit mode after saving
    setDialogOpen(false); // Close dialog
  };

  const handleEdit = (index: number) => {
    setNewData(collegeData[index]);
    setSelectedProgram(collegeData[index].programs[0]?.name || ""); // Set selected program for edit
    setEditIndex(index); // Set edit mode
    setDialogOpen(true); // Open dialog
  };

  const handleDelete = (index: number) => {
    const updatedData = collegeData.filter((_, i) => i !== index);
    setCollegeData(updatedData);
  };

  const handleDialogOpen = () => {
    setNewData({
      id: "",
      collegeName: "",
      regulatoryBody: "",
      domain: "",
      details: [{ address: "", contactNumber: "", email: "" }],
      programs: [],
    });
    setSelectedProgram(""); // Reset program selection
    setEditIndex(null); // Reset edit mode when adding new
    setDialogOpen(true); // Open dialog
  };

  const exportToCSV = () => {
    const csvData = collegeData.map(
      ({ collegeName, regulatoryBody, domain }) => ({
        collegeName,
        regulatoryBody,
        domain,
      })
    );

    const csvHeader = "College Name,Regulatory Body,Domain\n";
    const csvRows = csvData
      .map((row) => `${row.collegeName},${row.regulatoryBody},${row.domain}`)
      .join("\n");
    const csvContent = csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "college_data.csv"); // Use file-saver to download the CSV
  };

  return (
    <div className="space-y-6 bg-[#f8fafc] p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3b82f6]">
          College Data Management
        </h1>
        <Button
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
          onClick={exportToCSV}
        >
          Export CSV
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            onClick={handleDialogOpen}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Data
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit College Data" : "Add New College Data"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* College Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="collegeName" className="text-right">
                College Name
              </Label>
              <Input
                id="collegeName"
                value={newData.collegeName}
                onChange={(e) =>
                  setNewData({ ...newData, collegeName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            {/* Regulatory Body */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="regulatoryBody" className="text-right">
                Regulatory Body
              </Label>
              <Input
                id="regulatoryBody"
                value={newData.regulatoryBody}
                onChange={(e) =>
                  setNewData({ ...newData, regulatoryBody: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            {/* Domain */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="domain" className="text-right">
                Domain
              </Label>
              <Input
                id="domain"
                value={newData.domain}
                onChange={(e) =>
                  setNewData({ ...newData, domain: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            {/* Address */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                value={newData.details[0].address}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    details: [
                      {
                        ...newData.details[0],
                        address: e.target.value,
                      },
                    ],
                  })
                }
                className="col-span-3"
              />
            </div>
            {/* Contact Number */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactNumber" className="text-right">
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                value={newData.details[0].contactNumber}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    details: [
                      {
                        ...newData.details[0],
                        contactNumber: e.target.value,
                      },
                    ],
                  })
                }
                className="col-span-3"
              />
            </div>
            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newData.details[0].email}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    details: [
                      {
                        ...newData.details[0],
                        email: e.target.value,
                      },
                    ],
                  })
                }
                className="col-span-3"
              />
            </div>
            {/* Program Selector */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program" className="text-right">
                Program
              </Label>
              <select
                id="program"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="col-span-3 p-2 border rounded"
              >
                <option value="">Select Program</option>
                {programOptions.map((program) => (
                  <option key={program.name} value={program.name}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Conditionally Render Fields Based on Selected Program */}
            {selectedProgram && (
              <>
                {/* Specializations */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specialization" className="text-right">
                    Specialization
                  </Label>
                  <select
                    id="specialization"
                    className="col-span-3 p-2 border rounded"
                    defaultValue=""
                  >
                    <option value="">Select Specialization</option>
                    {programOptions
                      .find((program) => program.name === selectedProgram)
                      ?.specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                  </select>
                </div>
                {/* Years */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="year" className="text-right">
                    Year
                  </Label>
                  <select
                    id="year"
                    className="col-span-3 p-2 border rounded"
                    defaultValue=""
                  >
                    <option value="">Select Year</option>
                    {programOptions
                      .find((program) => program.name === selectedProgram)
                      ?.years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </div>
                {/* Regulations */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="regulation" className="text-right">
                    Regulation
                  </Label>
                  <select
                    id="regulation"
                    className="col-span-3 p-2 border rounded"
                    defaultValue=""
                  >
                    <option value="">Select Regulation</option>
                    {programOptions
                      .find((program) => program.name === selectedProgram)
                      ?.regulations.map((reg) => (
                        <option key={reg.type} value={reg.type}>
                          {reg.regulation} ({reg.type})
                        </option>
                      ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
              onClick={handleAddOrUpdate}
            >
              Save
            </Button>
            <Button
              className="bg-gray-300 hover:bg-gray-400"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>College Name</TableHead>
            <TableHead>Regulatory Body</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collegeData.map((college, index) => (
            <TableRow key={college.id}>
              <TableCell>{college.collegeName}</TableCell>
              <TableCell>{college.regulatoryBody}</TableCell>
              <TableCell>{college.domain}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => handleEdit(index)}
                >
                  <Edit className="mr-2 h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(index)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
