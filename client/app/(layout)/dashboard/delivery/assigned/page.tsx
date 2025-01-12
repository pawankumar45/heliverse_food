'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface AssignedDelivery {
    _id: string
    patientId: {
        name: string
        roomDetails: {
            roomNumber: string,
            bedNumber: string
        }
    }
    mealType: string,

    status: 'assigned' | 'in-transit' | 'delivered'
}

export default function AssignedDeliveriesPage() {
    const [deliveries, setDeliveries] = useState<AssignedDelivery[]>([])

    useEffect(() => {
        fetchAssignedDeliveries()
    }, [])

    const fetchAssignedDeliveries = async () => {
        try {
            const response = await axios.get('/delivery/assigned')

            setDeliveries(response.data)
        } catch (error) {
            toast.error('Failed to fetch assigned deliveries')
        }
    }

    const updateDeliveryStatus = async (id: string, status: AssignedDelivery['status']) => {
        try {
            await axios.put(`/delivery/${id}/status`, { status })
            toast.success('Delivery status updated successfully')
            fetchAssignedDeliveries()
        } catch (error) {
            toast.error('Failed to update delivery status')
        }
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Assigned Deliveries</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Current Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Bed No.</TableHead>
                                <TableHead>Meal Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveries.map((delivery) => (
                                <TableRow key={delivery._id}>
                                    <TableCell>{delivery.patientId.name}</TableCell>
                                    <TableCell>{delivery.patientId.roomDetails.roomNumber}</TableCell>
                                    <TableCell>{delivery.patientId.roomDetails.bedNumber}</TableCell>
                                    <TableCell>{delivery.mealType}</TableCell>
                                    <TableCell>{delivery.status}</TableCell>
                                    <TableCell>
                                        <Select
                                            onValueChange={(value) => updateDeliveryStatus(delivery._id, value as AssignedDelivery['status'])}
                                            defaultValue={delivery.status}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Update status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="assigned">Assigned</SelectItem>
                                                <SelectItem value="in-transit">In Transit</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

