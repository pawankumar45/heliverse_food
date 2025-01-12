import {
  Home,
  Truck,
  ClipboardList,
  UserSearch,
  Utensils,
  Users,
  Calendar,
} from "lucide-react";

export const routes = {
  manager: [
    { href: "/dashboard/manager", label: "Dashboard", icon: Home },
    { href: "/dashboard/manager/patients", label: "Patients", icon: Users },
    {
      href: "/dashboard/manager/diet-charts",
      label: "Diet Charts",
      icon: ClipboardList,
    },
    { href: "/dashboard/manager/pantry", label: "Pantry", icon: Utensils },
    {
      href: "/dashboard/manager/meal-tracking",
      label: "Meal Tracking",
      icon: Calendar,
    },
  ],
  pantry: [
    { href: "/dashboard/pantry", label: "Dashboard", icon: Home },
    {
      href: "/dashboard/pantry/preparation-tasks",
      label: "Preparation Tasks",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/pantry/meal-boxes",
      label: "Meal Boxes",
      icon: Utensils,
    },
    {
      href: "/dashboard/pantry/delivery-personnel",
      label: "Delivery Personnel",
      icon: Truck,
    },
  ],
  delivery: [
    { href: "/dashboard/delivery", label: "Dashboard", icon: Home },
    {
      href: "/dashboard/delivery/assigned",
      label: "Assigned Deliveries",
      icon: Truck,
    },
    {
      href: "/dashboard/delivery/history",
      label: "Delivery History",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/delivery/availability",
      label: "Availability",
      icon: UserSearch,
    },
  ],
};
