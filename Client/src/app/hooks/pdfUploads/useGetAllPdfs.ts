'use client'
import { useQuery, useMutation } from "@tanstack/react-query";
type PDFUpload = {
  id: number
  academicYear: {
    year: string
    semester: string
  }
  regulation: string
  course: string
  subject: string
  files: { fileName: string }[]
  uploadDate: string
}

async function fetchPdfs(year?: string, semester?: string): Promise<PDFUpload[]> {
  const params = new URLSearchParams()
  if (year) params.append('year', year)
  if (semester) params.append('semester', semester)

  const response = await fetch(`http://localhost:5001/api/pdfs?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("auth_token")}`,
    },
  })
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export function useGetAllPdfs(year?: string, semester?: string) {
  return useQuery<PDFUpload[], Error>({
    queryKey: ['pdfs', year, semester],
    queryFn: () => fetchPdfs(year, semester),
  })
}