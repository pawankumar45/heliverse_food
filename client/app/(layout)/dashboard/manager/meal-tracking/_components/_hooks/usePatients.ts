import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";

interface Patient {
  _id: string;
  name: string;
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/patients");
      setPatients(response.data);
    } catch (error) {
      toast.error("Failed to fetch patients");
    }
  };

  const searchPatients = (searchTerm: string) => {
    // Implement client-side filtering
    const filteredPatients = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPatients(filteredPatients);
  };

  return { patients, searchPatients };
}
