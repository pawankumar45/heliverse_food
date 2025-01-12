'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { toast } from 'sonner'

export function DeliveryPersonnelSummary() {
    const [summary, setSummary] = useState({
        total: 0,
        available: 0,
        busy: 0,
        status: {
            available: 0,
            busy: 0,
            offline: 0
        }
    })

    useEffect(() => {
        fetchDeliveryPersonnelSummary()
    }, [])

    const fetchDeliveryPersonnelSummary = async () => {
        try {
            const response = await axios.get('/summary/delivery-personnel')
            // console.log(response);

            setSummary(response.data)
        } catch (error) {
            toast.error('Failed to fetch delivery personnel summary')
        }
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
                <p className="text-2xl font-bold">{summary.total}</p>
                <p className="text-sm text-gray-500">Total</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{summary.status.available}</p>
                <p className="text-sm text-gray-500">Available</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{summary.status.busy}</p>
                <p className="text-sm text-gray-500">Busy</p>
            </div>
        </div>
    )
}

