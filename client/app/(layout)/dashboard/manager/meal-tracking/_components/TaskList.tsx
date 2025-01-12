'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateTaskDialog } from './CreateTaskDialog'
import { EditTaskDialog } from './EditTaskDialog'
import { Task } from './types'

interface TaskListProps {
    tasks: Task[]
    taskType: 'delivery' | 'meal'
    onCreateTask: (task: Partial<Task>) => Promise<void>
    onUpdateTask: (task: Task) => Promise<void>
    onDeleteTask: (id: string) => Promise<void>
    onUpdateTaskStatus: (id: string, status: Task['status']) => Promise<void>
    loading: boolean
}

export function TaskList({
    tasks,
    taskType,
    onCreateTask,
    onUpdateTask,
    onDeleteTask,
    onUpdateTaskStatus,
    loading
}: TaskListProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    return (
        <>
            <div className="mb-2 flex justify-end">
                <Button onClick={() => setIsCreateDialogOpen(true)}>Create New Task</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task Type</TableHead>
                        <TableHead>Meal Type</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task._id}>
                            <TableCell>{task.taskType}</TableCell>
                            <TableCell>{task.mealType}</TableCell>
                            <TableCell>{task.patientId.name}</TableCell>
                            <TableCell>{task.assignedTo.name}</TableCell>
                            <TableCell>
                                <Select
                                    value={task.status}
                                    onValueChange={(value) => onUpdateTaskStatus(task._id, value as Task['status'])}
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
                            <TableCell>
                                <Button variant="outline" className="mr-2" onClick={() => setEditingTask(task)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => onDeleteTask(task._id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <CreateTaskDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onCreateTask={onCreateTask}
                taskType={taskType}
                loading={loading}
            />

            <EditTaskDialog
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onUpdateTask={onUpdateTask}
                loading={loading}
            />
        </>
    )
}

