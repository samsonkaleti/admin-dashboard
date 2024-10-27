import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Announcement = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  allowAll: boolean;
  specificCollege: string | null;
  excludeCollege: string | null;
  order: number;
};

type AnnouncementInput = Omit<Announcement, 'id'>;
const API_BASE_URL = 'http://localhost:5001/api';

async function fetchCards() {
  const response = await fetch(`${API_BASE_URL}/cards`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function createAnnouncement(newAnnouncement: AnnouncementInput) {
  const response = await fetch(`${API_BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newAnnouncement),
  });
  if (!response.ok) {
    throw new Error('Failed to create announcement');
  }
  return response.json();
}

async function updateAnnouncement(id: string, updatedAnnouncement: AnnouncementInput) {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedAnnouncement),
  });
  if (!response.ok) {
    throw new Error('Failed to update announcement');
  }
  return response.json();
}

async function deleteAnnouncement(id: string) {
  const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete announcement');
  }
  return response.json();
}

export function useCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Announcement) => updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}