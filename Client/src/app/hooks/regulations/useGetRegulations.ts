import { BASE_URL } from '@/app/utils/constants';
import { useQuery } from '@tanstack/react-query';

async function fetchAllRegulations() {
  const response = await fetch('http://localhost:5001/api/regulations', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function useFetchRegulations() {
  return useQuery({
    queryKey: ['regulations'],
    queryFn: fetchAllRegulations,
  });
}