import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/auth/users");
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const searchUsers = (searchTerm: string) => {
    // Implement client-side filtering
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  return { users, searchUsers };
}
