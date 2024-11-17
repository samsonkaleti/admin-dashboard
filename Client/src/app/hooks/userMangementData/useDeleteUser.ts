import { useMutation, useQueryClient } from '@tanstack/react-query';

// Function to delete user by ID
async function deleteUser(userId: string): Promise<void> {
  const localUrl = "http://localhost:5001";
  const response = await fetch(`${localUrl}/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}

// Custom hook to delete a user
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      console.log('User deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
    },
  });
}
