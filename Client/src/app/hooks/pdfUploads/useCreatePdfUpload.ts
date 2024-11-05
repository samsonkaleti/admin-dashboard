import { useEffect, useState } from "react";
import axios from "axios";

interface PdfUpload {
  id: string;
  year: number;
  semester: string;
  course: string;
  subject: string;
  fileName: string;
}

export const usePdfUploads = () => {
  const [pdfUploads, setPdfUploads] = useState<PdfUpload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPdfUploads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/pdf-uploads");
      setPdfUploads(response.data);
    } catch (err) {
      setError("Failed to fetch uploads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addPdfUpload = async (newUpload: Omit<PdfUpload, "id">) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/pdf-uploads", newUpload);
      setPdfUploads((prev) => [...prev, response.data]);
    } catch (err) {
      setError("Failed to add upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updatePdfUpload = async (id: string, updatedUpload: PdfUpload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/pdf-uploads/${id}`, updatedUpload);
      setPdfUploads((prev) =>
        prev.map((upload) => (upload.id === id ? response.data : upload))
      );
    } catch (err) {
      setError("Failed to update upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deletePdfUpload = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/pdf-uploads/${id}`);
      setPdfUploads((prev) => prev.filter((upload) => upload.id !== id));
    } catch (err) {
      setError("Failed to delete upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfUploads();
  }, []);

  return {
    pdfUploads,
    loading,
    error,
    addPdfUpload,
    updatePdfUpload,
    deletePdfUpload,
  };
};
