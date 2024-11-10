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

const token = process.env.SECRET_TOKEN
async function fetchPdfs(year?: string, semester?: string): Promise<PDFUpload[]> {
  const params = new URLSearchParams()
  if (year) params.append('year', year)
  if (semester) params.append('semester', semester)

    const response = await fetch(`http://172.188.116.118:5001/api/pdfs?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
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