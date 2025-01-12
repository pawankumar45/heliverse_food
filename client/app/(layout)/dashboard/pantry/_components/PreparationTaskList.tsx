import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PreparationTask } from './types'

interface PreparationTaskListProps {
    tasks: PreparationTask[]
    onUpdateStatus: (taskId: string, status: PreparationTask['status'], notes?: string) => void
}

export function PreparationTaskList({ tasks, onUpdateStatus }: PreparationTaskListProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Meal Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map((task) => (
                    <TableRow key={task._id}>
                        <TableCell>{task.patientId.name}</TableCell>
                        <TableCell>{task.mealType}</TableCell>
                        <TableCell>{task.status}</TableCell>
                        <TableCell>
                            <Select
                                onValueChange={(value) => onUpdateStatus(task._id, value as PreparationTask['status'])}
                                defaultValue={task.status}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Update status" />
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
    )
}

