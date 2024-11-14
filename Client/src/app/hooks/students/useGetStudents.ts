import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/app/utils/constants";
async function fetchStudents() {
  const response = await fetch(`${BASE_URL}/students`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  }); 
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
