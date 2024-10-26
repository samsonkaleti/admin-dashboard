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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit College Data" : "Add New College Data"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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

            {selectedProgram && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specializations" className="text-right">
                    Specializations
                  </Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    {programOptions
                      .find((program) => program.name === selectedProgram)
                      ?.specializations.map((spec) => (
                        <label
                          key={spec}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            value={spec}
                            checked={selectedSpecializations.includes(spec)}
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
                          />
                          <span>{spec}</span>
                        </label>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="years" className="text-right">
                    Years
                  </Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    {programOptions
                      .find((program) => program.name === selectedProgram)
                      ?.years.map((year) => (
                        <label
                          key={year}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            value={year}
                            checked={selectedYears.includes(year)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedYears([...selectedYears, year]);
                              } else {
                                setSelectedYears(
                                  selectedYears.filter((y) => y !== year)
                                );
                              }
                            }}
                          />
                          <span>{year}</span>
                        </label>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="regulations" className="text-right">
                    Regulations
                  </Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    {programOptions
                      .find((program) => program.name === selectedProgram)
                      ?.regulations.map((reg) => (
                        <label
                          key={reg.type}
                          className="flex items-center space-x-2"
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
                          />
                          <span>
                            {reg.regulation} ({reg.type})
                          </span>
                        </label>
                      ))}
                  </div>
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
            <TableHead>Programs</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collegeData?.map((college: CollegeData) => (
            <TableRow key={college._id}>
              <TableCell>{college.collegeName}</TableCell>
              <TableCell>{college.regulatoryBody}</TableCell>
              <TableCell>{college.domain}</TableCell>
              <TableCell>
                {college.programs.map((p) => p.name).join(", ")}
              </TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleEdit(college)}>
                  <Edit className="mr-2 h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(college._id!)}
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
