"use client";


import React, { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { saveAs } from "file-saver";
import { useCreateCollege } from "@/app/hooks/colleges/useCreateCollege";
import { useDeleteCollege } from "@/app/hooks/colleges/useDeleteCollege";
import { useGetColleges } from "@/app/hooks/colleges/useGetColleges";
import { useUpdateCollege } from "@/app/hooks/colleges/useUpdateCollege";
import {
  CollegeData,
  Regulation,
  Program,
  CollegeDetails,
  CollegeExportData,
} from "@/app/@types/college";

const programOptions = [
  {
    name: "B.Tech",
    specializations: ["CSE", "ECE", "EEE", "CSM", "Civil", "Mechanical"],
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
  const [newData, setNewData] = useState<CollegeData>({
    collegeName: "",
    regulatoryBody: "",
    domain: "",
    details: [{ address: "", contactNumber: "", email: "" }],
    programs: [],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedRegulations, setSelectedRegulations] = useState<Regulation[]>(
    []
  );

  const {
    data: collegeData,
    isLoading,
    error,
  } = useGetColleges();
  const createCollegeMutation = useCreateCollege();
  const updateCollegeMutation = useUpdateCollege();
  const deleteCollegeMutation = useDeleteCollege();

  const handleAddOrUpdate = async () => {
    const updatedPrograms: Program[] = [
      {
        name: selectedProgram,
        specializations: selectedSpecializations,
        years: selectedYears,
        regulations: selectedRegulations,
      },
    ];

    const collegeDataToSave = {
      ...newData,
      programs: updatedPrograms,
    };

    if (editId) {
      updateCollegeMutation.mutate({ id: editId, ...collegeDataToSave });
    } else {
      createCollegeMutation.mutate(collegeDataToSave);
    }

    setEditId(null);
    setDialogOpen(false);
  };

  const handleEdit = (college: CollegeData) => {
    setNewData(college);
    setSelectedProgram(college.programs[0]?.name || "");
    setSelectedSpecializations(college.programs[0]?.specializations || []);
    setSelectedYears(college.programs[0]?.years || []);
    setSelectedRegulations(college.programs[0]?.regulations || []);
    setEditId(college._id || null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteCollegeMutation.mutate(id);
  };

  const handleDialogOpen = () => {
    setNewData({
      collegeName: "",
      regulatoryBody: "",
      domain: "",
      details: [{ address: "", contactNumber: "", email: "" }],
      programs: [],
    });
    setSelectedProgram("");
    setSelectedSpecializations([]);
    setSelectedYears([]);
    setSelectedRegulations([]);
    setEditId(null);
    setDialogOpen(true);
  };

  const exportToCSV = () => {
    const csvData = collegeData?.map(
      ({ collegeName, regulatoryBody, domain }: CollegeExportData) => ({
        collegeName,
        regulatoryBody,
        domain,
      })
    );

    const csvHeader = "College Name,Regulatory Body,Domain\n";
    const csvRows = csvData
      ?.map(
        (row: CollegeExportData) =>
          `${row.collegeName},${row.regulatoryBody},${row.domain}`
      )
      .join("\n");
    const csvContent = csvHeader + (csvRows || "");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "college_data.csv");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

return (
  <div className="container mx-auto px-4 py-6 space-y-8">
    <Card>
      <CardHeader className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
              College Data Management
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and organize college information
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              className="w-full sm:w-aut"
              onClick={exportToCSV}
            >
              Export CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto" onClick={handleDialogOpen}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {editId ? "Edit College Data" : "Add New College Data"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Basic Information</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="collegeName">College Name</Label>
                          <Input
                            id="collegeName"
                            value={newData.collegeName}
                            onChange={(e) =>
                              setNewData({
                                ...newData,
                                collegeName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="regulatoryBody">
                            Regulatory Body
                          </Label>
                          <Input
                            id="regulatoryBody"
                            value={newData.regulatoryBody}
                            onChange={(e) =>
                              setNewData({
                                ...newData,
                                regulatoryBody: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="domain">Domain</Label>
                          <Input
                            id="domain"
                            value={newData.domain}
                            onChange={(e) =>
                              setNewData({ ...newData, domain: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Contact Details</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
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
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactNumber">Contact Number</Label>
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
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
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
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Program Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="program">Program</Label>
                        <select
                          id="program"
                          value={selectedProgram}
                          onChange={(e) => setSelectedProgram(e.target.value)}
                          className="w-full p-2 border rounded-md bg-background text-foreground"
                        >
                          <option value="">Select Program</option>
                          {programOptions.map((program) => (
                            <option key={program.name} value={program.name}>
                              {program.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedProgram && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Specializations</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {programOptions
                                .find(
                                  (program) => program.name === selectedProgram
                                )
                                ?.specializations.map((spec) => (
                                  <label
                                    key={spec}
                                    className="flex items-center space-x-2 text-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      value={spec}
                                      checked={selectedSpecializations.includes(
                                        spec
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedSpecializations([
                                            ...selectedSpecializations,
                                            spec,
                                          ]);
                                        } else {
                                          setSelectedSpecializations(
                                            selectedSpecializations.filter(
                                              (s) => s !== spec
                                            )
                                          );
                                        }
                                      }}
                                      className="rounded border-input"
                                    />
                                    <span>{spec}</span>
                                  </label>
                                ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Years</Label>
                            <div className="flex flex-wrap gap-2">
                              {programOptions
                                .find(
                                  (program) => program.name === selectedProgram
                                )
                                ?.years.map((year) => (
                                  <label
                                    key={year}
                                    className="flex items-center space-x-2 text-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      value={year}
                                      checked={selectedYears.includes(year)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedYears([
                                            ...selectedYears,
                                            year,
                                          ]);
                                        } else {
                                          setSelectedYears(
                                            selectedYears.filter(
                                              (y) => y !== year
                                            )
                                          );
                                        }
                                      }}
                                      className="rounded border-input"
                                    />
                                    <span>Year {year}</span>
                                  </label>
                                ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Regulations</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {programOptions
                                .find(
                                  (program) => program.name === selectedProgram
                                )
                                ?.regulations.map((reg) => (
                                  <label
                                    key={reg.type}
                                    className="flex items-center space-x-2 text-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      value={reg.type}
                                      checked={selectedRegulations.some(
                                        (r) => r.type === reg.type
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedRegulations([
                                            ...selectedRegulations,
                                            reg,
                                          ]);
                                        } else {
                                          setSelectedRegulations(
                                            selectedRegulations.filter(
                                              (r) => r.type !== reg.type
                                            )
                                          );
                                        }
                                      }}
                                      className="rounded border-input"
                                    />
                                    <span>
                                      {reg.regulation} ({reg.type})
                                    </span>
                                  </label>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddOrUpdate}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-medium">College Name</TableHead>
                  <TableHead className="font-medium">Regulatory Body</TableHead>
                  <TableHead className="font-medium">Domain</TableHead>
                  <TableHead className="font-medium">Programs</TableHead>
                  <TableHead className="font-medium w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collegeData?.map((college: CollegeData) => (
                  <TableRow key={college._id}>
                    <TableCell className="font-medium">
                      {college.collegeName}
                    </TableCell>
                    <TableCell>{college.regulatoryBody}</TableCell>
                    <TableCell>{college.domain}</TableCell>
                    <TableCell>
                      {college.programs.map((p) => p.name).join(", ")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(college)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(college._id!)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
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
  </div>
);
}