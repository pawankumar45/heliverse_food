import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Task } from "../types";
import { toast } from "sonner";

export function useMealTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/delivery/mealTasks");
      setTasks(response.data);
      setAllTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch meal tasks");
    }
  };

  const handleCreateTask = async (newTask: Partial<Task>) => {
    const reqBody = {
      dietChartId: newTask.dietChartId?.id,
      patientId: newTask.patientId?.id,
      assignedTo: newTask.assignedTo?.id,
      taskType: newTask.taskType,
      mealType: newTask.mealType,
      notes: newTask.notes,
    };

    try {
      setLoading(true);
      await axios.post("/tasks", reqBody);
      toast.success("Meal task created successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to create meal task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (editingTask: Task) => {
    if (!editingTask) return;
    try {
      setLoading(true);
      await axios.put(`/tasks/${editingTask._id}`, editingTask);
      toast.success("Task updated successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/tasks/${id}`);
      toast.success("Meal task deleted successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete meal task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (id: string, status: Task["status"]) => {
    try {
      await axios.put(`/tasks/${id}/status`, { status });
      toast.success("Meal task status updated successfully");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to update meal task status");
    }
  };

  const sortTasks = (filter: "all" | "morning" | "afternoon" | "night") => {
    if (filter === "all") {
      fetchTasks();
    } else {
      const filteredTasks = allTasks.filter((task) => task.mealType === filter);
      setTasks(filteredTasks);
    }
  };

  return {
    tasks,
    sortTasks,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleUpdateTaskStatus,
    loading,
  };
}
