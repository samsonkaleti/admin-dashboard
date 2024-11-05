"use client";
import React, { useState } from "react";
import { Plus, Edit, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveAs } from "file-saver";
import { useCreateCollege } from "@/app/hooks/colleges/useCreateCollege";
import { useDeleteCollege } from "@/app/hooks/colleges/useDeleteCollege";
import { useGetColleges } from "@/app/hooks/colleges/useGetColleges";
import { useUpdateCollege } from "@/app/hooks/colleges/useUpdateCollege";

// Types
interface Regulation {
  type: string;
  regulation: string;
  validYears: number[];
}

interface Program {
  name: string;
  specializations: string[];
  years: number[];
  regulations: Regulation[];
}

interface CollegeDetails {
  address: string;
  contactNumber: string;
  email: string;
}

interface CollegeData {
  _id?: string;
  collegeName: string;
  regulatoryBody: string;
  domain: string;
  details: CollegeDetails[];
  programs: Program[];
}

interface CollegeExportData {
  collegeName: string;
  regulatoryBody: string;
  domain: string;
}

// Program options configuration
const programOptions = [
  {
    name: "B.Tech",
    specializations: ["CSE", "ECE", "EEE", "CSM", "Civil", "Mechanical"],
    years: [1, 2, 3, 4],
    regulations: [
      {
        type: "JNTU",
        regulation: "",
        validYears: [2020, 2021, 2022, 2023],
      },
      {
        type: "Autonomous",
        regulation: "",
        validYears: [2021, 2022, 2023, 2024],
      },
    ],
  },
  {
    name: "M.Tech",
    specializations: ["CSE", "VLSI", "Power Systems"],
    years: [1, 2],
    regulations: [
      {
        type: "JNTU",
        regulation: "N/A",
        validYears: [2019, 2020],
      },
    ],
  },
];

export default function CollegeDataPage() {
  // State management
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
  const [newSpecialization, setNewSpecialization] = useState("");
  const [customSpecializations, setCustomSpecializations] = useState<string[]>(
    []
  );
  // const [newRegulation, setNewRegulation] = useState<Regulation>({
  //   type: "",
  //   regulation: "",
  //   validYears: [],
  // });
  // const [customRegulations, setCustomRegulations] = useState<Regulation[]>([]);
  const [showOtherSpecialization, setShowOtherSpecialization] = useState(false);
  const [selectedJNTURegulation, setSelectedJNTURegulation] =
    useState<string>("");
  const [showJNTUDropdown, setShowJNTUDropdown] = useState(false);

  // Hooks
  const { data: collegeData, isLoading, error } = useGetColleges();
  const createCollegeMutation = useCreateCollege();
  const updateCollegeMutation = useUpdateCollege();
  const deleteCollegeMutation = useDeleteCollege();

  // Helper functions
  const handleAddSpecialization = () => {
    if (
      newSpecialization &&
      !customSpecializations.includes(newSpecialization)
    ) {
      setCustomSpecializations([...customSpecializations, newSpecialization]);
      setSelectedSpecializations([
        ...selectedSpecializations,
        newSpecialization,
      ]);
      setNewSpecialization("");
    }
  };

  const handleRemoveSpecialization = (spec: string) => {
    setCustomSpecializations(customSpecializations.filter((s) => s !== spec));
    setSelectedSpecializations(
      selectedSpecializations.filter((s) => s !== spec)
    );
  };

  // const handleAddRegulation = () => {
  //   if (newRegulation.type && newRegulation.regulation) {
  //     const regulation = {
  //       ...newRegulation,
  //       validYears: [new Date().getFullYear()],
  //     };
  //     setCustomRegulations([...customRegulations, regulation]);
  //     setSelectedRegulations([...selectedRegulations, regulation]);
  //     setNewRegulation({ type: "", regulation: "", validYears: [] });
  //   }
  // };

  const getAllSpecializations = () => {
    const defaultSpecs =
      programOptions.find((p) => p.name === selectedProgram)?.specializations ||
      [];
    return [...defaultSpecs, "Other"];
  };

  const getAllRegulations = () => {
    const program = programOptions.find(
      (program) => program.name === selectedProgram
    );
    return program ? program.regulations : [];
  };

  const handleAddOrUpdate = async () => {
    const updatedPrograms: Program[] = [
      {
        name: selectedProgram,
        specializations: selectedSpecializations,
        years: selectedYears,
        regulations: selectedRegulations.map((reg) => {
          // Add the selected JNTU regulation to the JNTU regulation type
          if (reg.type === "JNTU" && selectedJNTURegulation) {
            return { ...reg, regulation: selectedJNTURegulation };
          }
          return reg;
        }),
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
    setCustomSpecializations([]);
    // setCustomRegulations([]);
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

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );

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
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleDialogOpen}
                  >
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
                        <h3 className="text-lg font-medium">
                          Basic Information
                        </h3>
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
                                setNewData({
                                  ...newData,
                                  domain: e.target.value,
                                })
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
                            <Label htmlFor="contactNumber">
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
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Program Details</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="program">Program</Label>
                            <select
                              title="Program"
                              id="program"
                              value={selectedProgram}
                              onChange={(e) =>
                                setSelectedProgram(e.target.value)
                              }
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
                            <div className="space-y-6">
                              {/* Specializations Section */}
                              <div className="space-y-2">
                                <Label>Specializations</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {getAllSpecializations().map((spec) => (
                                    <label
                                      key={spec}
                                      className="flex items-center space-x-2 text-sm"
                                    >
                                      <input
                                        type="checkbox"
                                        value={spec}
                                        checked={
                                          spec === "Other"
                                            ? showOtherSpecialization
                                            : selectedSpecializations.includes(
                                                spec
                                              )
                                        }
                                        onChange={(e) => {
                                          if (spec === "Other") {
                                            setShowOtherSpecialization(
                                              e.target.checked
                                            );
                                          } else if (e.target.checked) {
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

                                {showOtherSpecialization && (
                                  <div className="mt-4 space-y-2">
                                    <div className="flex gap-2 mb-2">
                                      <Input
                                        placeholder="Add new specialization"
                                        value={newSpecialization}
                                        onChange={(e) =>
                                          setNewSpecialization(e.target.value)
                                        }
                                        className="flex-1"
                                      />
                                      <Button onClick={handleAddSpecialization}>
                                        Add
                                      </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {customSpecializations.map((spec) => (
                                        <Badge
                                          key={spec}
                                          variant="secondary"
                                          className="px-2 py-1"
                                        >
                                          {spec}
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-1"
                                            onClick={() =>
                                              handleRemoveSpecialization(spec)
                                            }
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Regulations Section */}
                              <div className="space-y-2">
                                <Label>Regulations</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {getAllRegulations().map((reg) => (
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
                                            if (reg.type === "JNTU") {
                                              setShowJNTUDropdown(true); // Show dropdown for JNTU
                                            }
                                          } else {
                                            setSelectedRegulations(
                                              selectedRegulations.filter(
                                                (r) => r.type !== reg.type
                                              )
                                            );
                                            if (reg.type === "JNTU") {
                                              setShowJNTUDropdown(false); // Hide dropdown if JNTU is unchecked
                                            }
                                          }
                                        }}
                                        className="rounded border-input"
                                      />
                                      <span>{reg.type}</span>
                                    </label>
                                  ))}
                                </div>

                                {/* JNTU Regulations Dropdown */}
                                {showJNTUDropdown && (
                                  <div className="mt-4 space-y-2">
                                    <Label htmlFor="jntuRegulation">
                                      JNTU Regulation
                                    </Label>
                                    <select
                                    title="JNTU Regulation"
                                      id="jntuRegulation"
                                      value={selectedJNTURegulation}
                                      onChange={(e) =>
                                        setSelectedJNTURegulation(
                                          e.target.value
                                        )
                                      }
                                      className="w-full p-2 border rounded-md bg-background text-foreground"
                                    >
                                      <option value="">
                                        Select Regulation
                                      </option>
                                      <option value="R20">R20</option>
                                      <option value="R19">R19</option>
                                      <option value="R18">R18</option>
                                      <option value="R17">R17</option>
                                    </select>
                                  </div>
                                )}
                              </div>

                              {/* Years Section */}
                              <div className="space-y-2">
                                <Label>Years</Label>
                                <div className="flex flex-wrap gap-2">
                                  {programOptions
                                    .find(
                                      (program) =>
                                        program.name === selectedProgram
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
                            </div>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
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
                    <TableHead className="font-medium">
                      Regulatory Body
                    </TableHead>
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
