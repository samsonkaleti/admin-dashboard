import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deletePdf(id: number): Promise<void> {
  const response = await fetch(`http://localhost:5001/api/pdfs/${id}`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
    method: 'DELETE',
  }) 

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete PDF')
  }
}

export function useDeletePdf() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePdf,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] })
    },
  })
}