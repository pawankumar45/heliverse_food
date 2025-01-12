import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import axios from "@/lib/axios"
import { toast } from 'sonner'

interface PantryTask {
    id: string
    description: string
    status: 'pending' | 'in-progress' | 'completed'
    mealType: string
}

interface InventoryItem {
    id: string
    name: string
    category: 'ingredients' | 'utensils' | 'equipment'
    quantity: number
    unit: string
    minThreshold: number
    location: string
    lastRestocked: string
    expiryDate?: string
    supplier?: string
    notes?: string
}

const TaskSection = () => {
    const [tasks, setTasks] = useState<PantryTask[]>([])

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/pantry/tasks')

            setTasks(response.data)
        } catch (error) {
            toast.error('Failed to fetch tasks')
        }
    }
    const handleUpdateTaskStatus = async (taskId: string, newStatus: PantryTask['status']) => {
        try {
            const response = await axios.put(`/pantry/tasks/${taskId}/status`, { status: newStatus })

            toast.success('Task status updated successfully')
            fetchTasks()
        } catch (error) {
            toast.error('Failed to update task status')
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pantry Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.mealType} Meal</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>
                                    <Select
                                        value={task.status}
                                        onValueChange={(value) => handleUpdateTaskStatus(task.id, value as PantryTask['status'])}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default TaskSection