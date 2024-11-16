"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, User, Mail, BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/app/utils/constants";

interface Student {
  _id: string;
  username: string;
  email: string;
  course: string;
}

interface Event {
  _id: string;
  title: string;
  collegeName: string;
  registeredStudents: string[];
}

interface User {
  _id: string;
  username: string;
  email: string;
  course: string;
}

const fetchEventDetails = async (eventId: string): Promise<Event> => {
  const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch event details");
  }
  return response.json();
};

const fetchUserDetails = async (userId: string): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/students/${userId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user details for ID: ${userId}`);
  }
  return response.json();
};

const EventDetails = () => {
  const params = useParams();
  const eventId = params.id as string;

  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useQuery<Event, Error>({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventDetails(eventId),
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery<User[], Error>({
    queryKey: ["users", event?.registeredStudents],
    queryFn: async () => {
      if (!event?.registeredStudents?.length) return [];
      const userPromises = event.registeredStudents.map((studentId) =>
        fetchUserDetails(studentId)
      );
      return Promise.all(userPromises);
    },
    enabled: !!event?.registeredStudents?.length,
  });

  const isLoading = isEventLoading || isUsersLoading;
  const error = eventError || usersError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
          {event?.title}
        </CardTitle>
        <CardDescription className="text-sm md:text-base text-gray-500">
          {event?.collegeName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Registered Students</h2>
          <Badge variant="secondary">
            Total Students: {users?.length || 0}
          </Badge>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Course
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.course}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {(!users || users.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No students registered yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDetails;
