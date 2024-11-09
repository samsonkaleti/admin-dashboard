import { CollegeData } from '@/app/@types/college';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createCollege(newCollege: CollegeData) {
  const response = await fetch('http://172.188.116.118:5001/api/colleges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCollege),
  });
  if (!response.ok) {
    throw new Error('Failed to create college');
  }
  return response.json();
}

export function useCreateCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
}