'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { DeliveryPersonnelList } from '../_components/DeliveryPersonnelList'
import { DeliveryPersonnel } from '../_components/types'
import { toast } from 'sonner'

export default function DeliveryPersonnelPage() {
    const [personnel, setPersonnel] = useState<DeliveryPersonnel[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchPersonnel()
    }, [])

    const fetchPersonnel = async () => {
        try {
            const response = await axios.get('/inner-pantry/delivery-personnel')
            setPersonnel(response.data)
        } catch (error) {
            toast.error('Failed to fetch delivery personnel')
        }
    }

    const updatePersonnel = async (id: string, updates: Partial<DeliveryPersonnel>) => {
        try {
            setLoading(true)
            await axios.put(`/inner-pantry/delivery-personnel/${id}`, updates)
            toast.success('Delivery personnel updated successfully')
            fetchPersonnel()
        } catch (error) {
            toast.error('Failed to update delivery personnel')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Delivery Personnel Management</h1>
            <DeliveryPersonnelList loading={loading} personnel={personnel} onUpdatePersonnel={updatePersonnel} />
        </div>
    )
}

