"use client"
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/app/utils/constants';

async function fetchPreviousPapers() {
  const token = sessionStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${BASE_URL}/api/previous-papers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch previous papers');
  }

  return response.json();
}

export function useGetAllPreviousPapers() {
  return useQuery({
    queryKey: ['previousPapers'],
    queryFn: fetchPreviousPapers,
  });
}

