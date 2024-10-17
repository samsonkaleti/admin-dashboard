'use client'
import { useState } from "react";
import { Plus, Pencil, Trash2, Download } from "lucide-react";
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

type CollegeData = {
  id: number;
  name: string;
  type: string;
  department: string;
};

export default function CollegeDataPage() {
  const [collegeData, setCollegeData] = useState<CollegeData[]>([
    {
      id: 1,
      name: "Computer Science",
      type: "Course",
      department: "Engineering",
    },
    { id: 2, name: "Dr. Jane Smith", type: "Faculty", department: "Science" },
    { id: 3, name: "Physics", type: "Department", department: "Science" },
  ]);

  const [newData, setNewData] = useState<Omit<CollegeData, "id">>({
    name: "",
    type: "",
    department: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAdd = () => {
    setCollegeData([...collegeData, { ...newData, id: Date.now() }]);
    setNewData({ name: "", type: "", department: "" });
  };

  const handleEdit = (id: number) => {
    const dataToEdit = collegeData.find((data) => data.id === id);
    if (dataToEdit) {
      setNewData({
        name: dataToEdit.name,
        type: dataToEdit.type,
        department: dataToEdit.department,
      });
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    setCollegeData(
      collegeData.map((data) =>
        data.id === editingId ? { ...data, ...newData } : data
      )
    );
    setNewData({ name: "", type: "", department: "" });
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setCollegeData(collegeData.filter((data) => data.id !== id));
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Name,Type,Department\n" +
      collegeData
        .map((row) => `${row.id},${row.name},${row.type},${row.department}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "college_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDialogOpen = () => {
    // Clear form and reset editingId when opening the add form
    setNewData({ name: "", type: "", department: "" });
    setEditingId(null); // Make sure we're not in edit mode
  };

  return (
    <div className="space-y-6 bg-[#f8fafc] p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#3b82f6]">
          College Data Management
        </h1>
        <Button
          onClick={handleExport}
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            onClick={handleDialogOpen} // Call the handler to reset the form
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Data
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit College Data" : "Add New College Data"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newData.name}
                onChange={(e) =>
                  setNewData({ ...newData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input
                id="type"
                value={newData.type}
                onChange={(e) =>
                  setNewData({ ...newData, type: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                value={newData.department}
                onChange={(e) =>
                  setNewData({ ...newData, department: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={editingId ? handleUpdate : handleAdd}>
            {editingId ? "Update" : "Add"}
          </Button>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border border-[#e2e8f0] bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-[#f1f5f9]">
            <TableRow>
              <TableHead className="text-[#1e293b]">Name</TableHead>
              <TableHead className="text-[#1e293b]">Type</TableHead>
              <TableHead className="text-[#1e293b]">Department</TableHead>
              <TableHead className="text-[#1e293b]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collegeData.map((data) => (
              <TableRow key={data.id} className="hover:bg-[#f1f5f9]">
                <TableCell className="text-[#1e293b]">{data.name}</TableCell>
                <TableCell className="text-[#1e293b]">{data.type}</TableCell>
                <TableCell className="text-[#1e293b]">
                  {data.department}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(data.id)}
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit College Data</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="edit-name"
                              value={newData.name}
                              onChange={(e) =>
                                setNewData({ ...newData, name: e.target.value })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-type" className="text-right">
                              Type
                            </Label>
                            <Input
                              id="edit-type"
                              value={newData.type}
                              onChange={(e) =>
                                setNewData({ ...newData, type: e.target.value })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-department"
                              className="text-right"
                            >
                              Department
                            </Label>
                            <Input
                              id="edit-department"
                              value={newData.department}
                              onChange={(e) =>
                                setNewData({
                                  ...newData,
                                  department: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={handleUpdate}>Update</Button>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDelete(data.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
