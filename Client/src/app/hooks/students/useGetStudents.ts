import { useQuery } from "@tanstack/react-query";

async function fetchStudents() {
  const response = await fetch("https://osaw.in/v1/api/students");
  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }
  return response.json();
}

export function useGetStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
}
