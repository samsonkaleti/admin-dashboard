import { useMutation, useQueryClient } from '@tanstack/react-query';

type PdfData = {
  id: number;
  year: string;
  semester: string;
  course: string;
  subject: string;
  fileName: string;
};


async function createPdf(newPdf: PdfData) {
  const response = await fetch('http://localhost:5001/api/pdfs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPdf),
  });

  if (!response.ok) {
    throw new Error('Failed to create PDF');
  }

  return response.json();
}

export function useCreatePdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPdf,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
    },
  });
}
