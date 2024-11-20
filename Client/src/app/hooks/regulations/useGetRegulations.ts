import { BASE_URL } from '@/app/utils/constants';
import { useQuery } from '@tanstack/react-query';

async function fetchAllRegulations() {
  const response = await fetch(`${BASE_URL}/api/regulations`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function useGetRegulations() {
  return useQuery({
    queryKey: ['regulations'],
    queryFn: fetchAllRegulations,
  });
}