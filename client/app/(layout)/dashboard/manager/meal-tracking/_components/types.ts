export interface Task {
  _id: string;
  taskType: "preparation" | "delivery";
  mealType: "morning" | "afternoon" | "night";
  patientId: {
    id: string;
    name: string;
  };
  dietChartId: {
    id: string;
    name: string;
  };
  assignedTo: {
    id: string;
    name: string;
  };
  status: "pending" | "in-progress" | "completed";
  notes: string;
}
