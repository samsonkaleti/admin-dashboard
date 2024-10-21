"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardData = {
  id: number;
  name: string;
  type: "student" | "faculty";
  cardNumber: string;
  department: string;
};

export default function CardDataPage() {
  const [cardData, setCardData] = useState<CardData[]>([
    {
      id: 1,
      name: "John Doe",
      type: "student",
      cardNumber: "S12345",
      department: "Computer Science",
    },
    {
      id: 2,
      name: "Jane Smith",
      type: "faculty",
      cardNumber: "F67890",
      department: "Physics",
    },
  ]);
  const [newCard, setNewCard] = useState<Omit<CardData, "id">>({
    name: "",
    type: "student",
    cardNumber: "",
    department: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAdd = () => {
    setCardData([...cardData, { ...newCard, id: Date.now() }]);
    setNewCard({ name: "", type: "student", cardNumber: "", department: "" });
    setIsDialogOpen(false);
  };

  const handleEdit = (id: number) => {
    const cardToEdit = cardData.find((card) => card.id === id);
    if (cardToEdit) {
      setNewCard({
        name: cardToEdit.name,
        type: cardToEdit.type,
        cardNumber: cardToEdit.cardNumber,
        department: cardToEdit.department,
      });
      setEditingId(id);
      setIsDialogOpen(true);
    }
  };

  const handleUpdate = () => {
    setCardData(
      cardData.map((card) =>
        card.id === editingId ? { ...card, ...newCard } : card
      )
    );
    setNewCard({ name: "", type: "student", cardNumber: "", department: "" });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setCardData(cardData.filter((card) => card.id !== id));
  };

  const openAddDialog = () => {
    setEditingId(null);
    setNewCard({ name: "", type: "student", cardNumber: "", department: "" });
    setIsDialogOpen(true);
  };

  return (
    <Card className="w-full bg-[#f8fafc] border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-[#3b82f6]">
          Card Data Management
        </CardTitle>
        <CardDescription className="text-[#6366f1]">
          Add, edit, or remove card data for students and faculty.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Button
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
            onClick={openAddDialog}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Card
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Card Data" : "Add New Card Data"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCard.name}
                  onChange={(e) =>
                    setNewCard({ ...newCard, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newCard.type}
                  onValueChange={(value: "student" | "faculty") =>
                    setNewCard({ ...newCard, type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cardNumber" className="text-right">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  value={newCard.cardNumber}
                  onChange={(e) =>
                    setNewCard({ ...newCard, cardNumber: e.target.value })
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
                  value={newCard.department}
                  onChange={(e) =>
                    setNewCard({ ...newCard, department: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button
              onClick={editingId ? handleUpdate : handleAdd}
              className="w-full"
            >
              {editingId ? "Update" : "Add"}
            </Button>
          </DialogContent>
        </Dialog>

        <div className="rounded-md border border-[#e2e8f0] bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-[#f1f5f9]">
              <TableRow>
                <TableHead className="w-[200px] text-[#1e293b]">Name</TableHead>
                <TableHead className="text-[#1e293b]">Type</TableHead>
                <TableHead className="text-[#1e293b]">Card Number</TableHead>
                <TableHead className="hidden md:table-cell text-[#1e293b]">
                  Department
                </TableHead>
                <TableHead className="text-right text-[#1e293b]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardData.map((card) => (
                <TableRow key={card.id} className="hover:bg-[#f1f5f9]">
                  <TableCell className="font-medium text-[#1e293b]">
                    {card.name}
                  </TableCell>
                  <TableCell className="text-[#1e293b]">{card.type}</TableCell>
                  <TableCell className="text-[#1e293b]">
                    {card.cardNumber}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-[#1e293b]">
                    {card.department}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-[#3b82f6] hover:text-[#2563eb]"
                        onClick={() => handleEdit(card.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-[#ef4444] hover:text-[#dc2626]"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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