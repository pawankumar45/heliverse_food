'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from '@/lib/axios'
import { PreparationTask } from '../_components/types';
import { toast } from 'sonner'

export default function PreparationTaskList() {
    const [tasks, setTasks] = useState<PreparationTask[]>([])

    useEffect(() => {
        fetchPreparationTasks();
    }, [])

    const fetchPreparationTasks = async () => {
        try {
            const response = await axios.get('/inner-pantry/preparation-tasks')
            setTasks(response.data)
        } catch (error) {
            toast.error('Failed to fetch preparation tasks')
        }
    }

    const onUpdateStatus = async (id: string, status: string) => {
        try {
            const response = await axios.put(`/inner-pantry/preparation-tasks/${id}`, { status })
            fetchPreparationTasks()
        } catch (error) {
            toast.error('Failed to fetch preparation tasks')
        }
    }

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Preparation Tasks</h2>
            </div>

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
                                    onValueChange={(value) =>
                                        onUpdateStatus(task._id, value as PreparationTask['status'])
                                    }
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
        </div>
    )
}
