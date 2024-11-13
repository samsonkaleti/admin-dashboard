import { useQuery } from '@tanstack/react-query';

async function fetchColleges() {
  const response = await fetch('http://localhost:5001/api/colleges');
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