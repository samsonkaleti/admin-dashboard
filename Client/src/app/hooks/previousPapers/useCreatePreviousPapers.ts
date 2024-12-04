"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/app/utils/constants';
import { toast } from 'sonner';

interface UploadError extends Error {
  code?: string;
  details?: string;
}

async function createPreviousPaper(formData: FormData) {
  const token = sessionStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${BASE_URL}/api/previouspapers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Upload failed') as UploadError;
    error.code = data.code;
    error.details = data.details;
    throw error;
  }

  return data;
}

export function useCreatePreviousPaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPreviousPaper,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['previousPapers'] });
      toast.success('Previous papers uploaded successfully');
    },
    onError: (error: UploadError) => {
      console.error('Upload error:', error);

      let errorMessage = 'Failed to upload previous papers';

      if (error.message.includes('Authentication')) {
        errorMessage = 'Please login again to upload files';
      } else if (error.code === 'LIMIT_FILE_SIZE') {
        errorMessage = 'File size exceeds the limit (10MB)';
      } else if (error.code === 'INVALID_FILE_TYPE') {
        errorMessage = 'Only PDF files are allowed';
      } else if (error.details) {
        errorMessage = error.details;
      }

      toast.error(errorMessage);
    },
  });
}

