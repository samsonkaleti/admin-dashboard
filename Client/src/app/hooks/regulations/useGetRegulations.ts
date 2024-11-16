'use client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { BASE_URL } from '@/app/utils/constants';
import { toast } from 'sonner';

interface FetchError extends Error {
  code?: string;
  details?: string;
}

async function fetchAllRegulations() {
  const token = sessionStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${BASE_URL}/api/regulations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'Fetching regulations failed') as FetchError;
    error.code = data.code;
    error.details = data.details;
    throw error;
  }

  return data;
}

export function useFetchRegulations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchAllRegulations,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['regulations'] });
      toast.success('Regulations fetched successfully');
    },
    onError: (error: FetchError) => {
      console.error('Fetch error:', error);

      let errorMessage = 'Failed to fetch regulations';

      if (error.message.includes('Authentication')) {
        errorMessage = 'Please login again to fetch regulations';
      } else if (error.code === 'NO_REGULATIONS_FOUND') {
        errorMessage = 'No regulations available to display';
      }

      toast.error(errorMessage);
    },
  });
}
