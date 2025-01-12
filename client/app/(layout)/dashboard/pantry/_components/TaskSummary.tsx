'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { toast } from 'sonner'

export function TaskSummary() {
    const [taskCounts, setTaskCounts] = useState({
        pending: 0,
        inProgress: 0,
        completed: 0,
    })

    useEffect(() => {
        fetchTaskSummary()
    }, [])

    const fetchTaskSummary = async () => {
        try {
            const response = await axios.get('/summary/preparation-tasks')
            // console.log(response);

            setTaskCounts(response.data)
        } catch (error) {
            toast.error('Failed to fetch task summary')
        }
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
                <p className="text-2xl font-bold">{taskCounts.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{taskCounts.inProgress}</p>
                <p className="text-sm text-gray-500">In Progress</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{taskCounts.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
            </div>
        </div>
    )
}

