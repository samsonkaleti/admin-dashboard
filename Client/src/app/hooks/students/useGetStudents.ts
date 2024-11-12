import { useQuery } from "@tanstack/react-query";

async function fetchStudents() {
  const response = await fetch("http://172.188.116.118:5001/api/students");
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
