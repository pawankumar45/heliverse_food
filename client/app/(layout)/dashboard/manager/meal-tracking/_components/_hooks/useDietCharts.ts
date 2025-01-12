import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";

interface DietChart {
  _id: string;
  patientId: {
    name: string;
  };
}

export function useDietCharts() {
  const [dietCharts, setDietCharts] = useState<DietChart[]>([]);

  useEffect(() => {
    fetchDietCharts();
  }, []);

  const fetchDietCharts = async () => {
    try {
      const response = await axios.get("/diet-charts");
      setDietCharts(response.data);
    } catch (error) {
      toast.error("Failed to fetch diet charts");
    }
  };

  const searchDietCharts = (searchTerm: string) => {
    // Implement client-side filtering
    const filteredDietCharts = dietCharts.filter((dietChart) =>
      dietChart.patientId.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDietCharts(filteredDietCharts);
  };

  return { dietCharts, searchDietCharts };
}
