import { useQuery } from '@tanstack/react-query';

async function fetchColleges() {
  const response = await fetch('http://172.188.116.118:5001/api/colleges');
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