'use client'

import React, { useState } from 'react'
import { TaskList } from './TaskList'
import { useMealTasks } from './_hooks/useMealTasks'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function MealTasks() {
    const [filter, setFilter] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all')
    const {
        tasks,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask,
        handleUpdateTaskStatus,
        sortTasks,
        loading
    } = useMealTasks()

    return (
        <div>
            <div className="mb-4">
                <Select onValueChange={(value) => {
                    setFilter(value as any)
                    sortTasks(value as 'all' | 'morning' | 'afternoon' | 'night')
                }} defaultValue="all">
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by meal time" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Meals</SelectItem>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <TaskList
                tasks={tasks}
                taskType="meal"
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                loading={loading}
            />
        </div>
    )
}

