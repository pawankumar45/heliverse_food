'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { toast } from 'sonner'

export function MealBoxSummary() {
    const [summary, setSummary] = useState({
        preparing: 0,
        ready: 0,
        assigned: 0,
        inTransit: 0,
        delivered: 0,
    })

    useEffect(() => {
        fetchMealBoxSummary()
    }, [])

    const fetchMealBoxSummary = async () => {
        try {
            const response = await axios.get('/summary/meal-boxes')
            // console.log(response);

            setSummary(response.data.status)
        } catch (error) {
            toast.error('Failed to fetch meal box summary')
        }
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
                <p className="text-2xl font-bold">{summary.preparing}</p>
                <p className="text-sm text-gray-500">Preparing</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{summary.ready}</p>
                <p className="text-sm text-gray-500">Ready</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{summary.assigned}</p>
                <p className="text-sm text-gray-500">Assigned</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{summary.inTransit}</p>
                <p className="text-sm text-gray-500">In Transit</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{summary.delivered}</p>
                <p className="text-sm text-gray-500">Delivered</p>
            </div>
        </div>
    )
}

