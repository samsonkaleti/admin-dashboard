import { useMutation, useQueryClient } from '@tanstack/react-query';

async function deleteCollege(id: string) {
  const response = await fetch(`https://osaw.in/v1/api/colleges/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error('Failed to delete college');
  }
  return response.json();
}

export function useDeleteCollege() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colleges'] });
    },
  });
}