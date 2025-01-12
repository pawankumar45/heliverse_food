'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function AvailabilityPage() {
    const [isAvailable, setIsAvailable] = useState(false)

    useEffect(() => {
        fetchAvailabilityStatus()
    }, [])

    const fetchAvailabilityStatus = async () => {
        try {
            const response = await axios.get('/auth/user')

            setIsAvailable(response.data.deliveryStatus !== 'busy')
        } catch (error) {
            toast.error('Failed to fetch availability status')
        }
    }

    const updateAvailabilityStatus = async () => {
        try {
            const newStatus = !isAvailable
            const response = await axios.put('/delivery/availability', { deliveryStatus: newStatus ? 'available' : 'busy' })
            console.log(response);

            setIsAvailable(newStatus)
            toast.success(`You are now ${newStatus ? 'available' : 'unavailable'} for deliveries`)
        } catch (error) {
            toast.error('Failed to update availability status')
        }
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Availability Status</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Set Your Availability</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="availability"
                            checked={isAvailable}
                            onCheckedChange={updateAvailabilityStatus}
                        />
                        <Label htmlFor="availability">
                            {isAvailable ? 'Available for Deliveries' : 'Unavailable for Deliveries'}
                        </Label>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

