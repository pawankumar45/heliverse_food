'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

interface DeliveryHistory {
    _id: string
    patientId: {
        name: string
        roomDetails: {
            roomNumber: string,
            bedNumber: string
        }
    }
    mealType: string

    deliveryTime: string
    deliveryNotes?: string
}

export default function DeliveryHistoryPage() {
    const [history, setHistory] = useState<DeliveryHistory[]>([])

    useEffect(() => {
        fetchDeliveryHistory()
    }, [])

    const fetchDeliveryHistory = async () => {
        try {
            const response = await axios.get('/delivery/history')

            setHistory(response.data)
        } catch (error) {
            toast.error('Failed to fetch delivery history')
        }
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Delivery History</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Past Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Bed No.</TableHead>
                                <TableHead>Meal Type</TableHead>
                                <TableHead>Delivery Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((delivery) => (
                                <TableRow key={delivery._id}>
                                    <TableCell>{delivery.patientId.name}</TableCell>
                                    <TableCell>{delivery.patientId.roomDetails.roomNumber}</TableCell>
                                    <TableCell>{delivery.patientId.roomDetails.bedNumber}</TableCell>
                                    <TableCell>{delivery.mealType}</TableCell>
                                    <TableCell>{new Date(delivery.deliveryTime).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

