import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createPdf(formData: FormData) {
  const response = await fetch('http://172.188.116.118:5001/api/pdfs', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create PDF');
  }

  return response.json();
}

export function useCreatePdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPdf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
    },
  });
}