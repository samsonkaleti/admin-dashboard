"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  registeredStudents: string; // Now this will just be an array of user IDs
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

  // Query for event details
  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useQuery<Event, Error>({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventDetails(eventId),
  });

  // Query for user details, dependent on event query
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery<User, Error>({
    queryKey: ["user", event?.registeredStudents],
    queryFn: () => fetchUserDetails(event?.registeredStudents._id),
    enabled: !!event?.registeredStudents, // Only run if we have a registered student ID
  });

  const isLoading = isEventLoading 
  const error = eventError

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
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl lg:text-3xl text-primary">
          {event?.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{event?.collegeName}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Registered Students</h2>
          <p className="text-sm text-muted-foreground">
            Total Students: 1
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              <TableRow key={user?._id}>
                <TableCell>{user?.username}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.course}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


export default EventDetails;