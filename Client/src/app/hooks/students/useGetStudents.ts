import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BASE_URL } from '@/app/utils/constants';

const API_BASE_URL = `${BASE_URL}/api`;

export type Student = {
  _id: string
  username: string
  course: string
  printDocuments: string[]
  internshipApplications: string[]
}

export function useGetStudents() {
  return useQuery<Student[], Error>({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
        },
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })
}

export function useRegisterStudentForEvent() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, { userId: string; eventId: string }>({
    mutationFn: async ({ userId, eventId }) => {
      const response = await fetch(`${API_BASE_URL}/events/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ userId, eventId }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}