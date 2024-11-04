import { PdfUpload } from '@/app/@types/pdf';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createPdfUpload(newPdfUpload: PdfUpload) {
  const response = await fetch('http://localhost:5001/api/pdf-uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPdfUpload),
  });

  if (!response.ok) {
    throw new Error('Failed to create PDF upload');
  }

  return response.json();
}

export function useCreatePdfUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPdfUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfUploads'] });
    },
  });
}
