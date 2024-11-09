import { CollegeData } from '@/app/@types/college';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function updateCollege({ id, ...updateData }: { id: string } & Partial<CollegeData>) {
  const response = await fetch(`http://172.188.116.118:5001/api/colleges/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    throw new Error('Failed to update college');
  }
  return response.json();
}

export function useUpdateCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
}