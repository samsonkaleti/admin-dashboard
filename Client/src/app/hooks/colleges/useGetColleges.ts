import { useQuery } from '@tanstack/react-query';
const API_BASE_URL = "http://localhost:5001/api";

async function fetchColleges() {
  const response = await fetch(`${API_BASE_URL}/colleges`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
    },
  }) 
 if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function useGetColleges() {
  return useQuery({
    queryKey: ['colleges'],
    queryFn: fetchColleges,
  });
}