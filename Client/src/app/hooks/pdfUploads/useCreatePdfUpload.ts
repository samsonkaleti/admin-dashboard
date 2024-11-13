import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createPdf(formData: FormData) {
  const response = await fetch('http://localhost:5001/api/pdfs', {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
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