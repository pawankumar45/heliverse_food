  # Hospital Food Delivery Management System Project
  
   [Project Link](https://heliverse-hospital-food-delivery.vercel.app/login)

  Overview
  - The Hospital Food Delivery Management System is a comprehensive solution for managing hospital food services, including meal preparation, delivery tracking, and dietary management. The system serves three main user roles: managers, pantry staff, and delivery personnel.

 Frontend Documentation
Tech Stack
-Next.js (React framework)
-TypeScript
-Tailwind CSS for styling
-shadcn/ui for UI components
-Recharts for data visualization
Key Components
 Authentication Context
-Manages user authentication state
-Provides login, logout, and registration functions
-Stores user information and JWT token
Theme Provider
-Manages application theme (light/dark mode)
-Provides theme toggle functionality
Layout Components
-Navbar: Top navigation bar with user menu and theme toggle
-Sidebar: Role-based navigation menu
-DashboardLayout: Wrapper component for authenticated pages
Role-based Dashboards

1.Manager Dashboard
-Overview of hospital food service operations
-Charts for delivery statistics, patient statistics, meal distribution, and dietary restrictions
-Quick access to patient management, diet charts, and task management

2.Pantry Dashboard
-Inventory levels chart
-Meal preparation trend chart
-Task completion rate chart
-Access to meal preparation tasks and delivery personnel management

3.Delivery Dashboard
-Personal delivery statistics
-Performance metrics
-Current deliveries list
-Delivery history
Reusable Components
-ChartContainer: Wrapper for responsive and theme-aware charts
-TaskList: Reusable list component for various tasks
-PatientCard: Display component for patient information
-MealBoxList: List component for meal boxes with assignment and status update functionality
Page Structure
-/login: User login page
-/register: User registration page (manager access only)
-/dashboard: Role-based dashboard redirect
-/dashboard/manager: Manager dashboard
-/dashboard/manager/patients: Patient management
-/dashboard/manager/diet-charts: Diet chart management
-/dashboard/manager/tasks: Task management
-/dashboard/pantry: Pantry dashboard
-/dashboard/pantry/preparation-tasks: Meal preparation task list
-/dashboard/pantry/meal-boxes: Meal box management
-/dashboard/pantry/delivery-personnel: Delivery personnel management
-/dashboard/delivery: Delivery personnel dashboard
-/dashboard/delivery/assigned: Current assigned deliveries
-/dashboard/delivery/history: Delivery history
-/profile: User profile page

State Management
-React Context API for global state (auth, theme)
-React Query for server state management and caching
-Local state with useState for component-specific state

Styling
-Tailwind CSS for utility-first styling
-Dark mode support using shadcn/ui components
-Responsive design for mobile, tablet, and desktop views

Data Fetching
-Axios for API requests
-Custom hooks for data fetching and mutation (e.g., usePatients, useMealTasks)

Error Handling
-Toast notifications for user feedback
-Error boundaries for catching and displaying runtime errors
-Form validation using react-hook-form



   
 Backend
 1. Tech Stack
    -Backend: Node.js with Express
    -Database: MongoDB with Mongoose
    -Authentication: JWT-based with cookie storage
    -TypeScript for type safety
    -RESTful API architecture

 2. Key Components
   -Authentication System
   -Role-based Access Control
   -Real-time Analytics
   -Task Management System
   -Inventory Management
    -Delivery Tracking
    Features
3. Core Functionality
  User Management
 - Patient Management
 - Diet Chart Management
  -Meal Preparation Tracking
 - Delivery Management
  -Inventory Control
 - Analytics Dashboard
4. Security Features
-JWT-based Authentication
-Role-based Authorization
-Secure Cookie Usage
-Input Validation
-Error Handling
5. User Roles
 Manager
- System administration
- Patient management
- Diet chart creation
- Staff management
- Analytics access
- Inventory oversight
 Pantry Staff
- Meal preparation
- Inventory management
- Task management
- Delivery assignment
- Stock monitoring
 Delivery Personnel
- Delivery management
 -Status updates
- Route optimization
- Delivery confirmation
- Performance tracking
  
