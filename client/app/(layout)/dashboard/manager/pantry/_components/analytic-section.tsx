import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import axios from "@/lib/axios"
import { toast } from 'sonner'

interface InventoryItem {
    id: string
    name: string
    category: 'ingredients' | 'utensils' | 'equipment'
    quantity: number
    unit: string
    minThreshold: number
    location: string
    lastRestocked: string
    expiryDate?: string
    supplier?: string
    notes?: string
}

const AnalyticsSection = () => {
    const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([])
    const [expiringItems, setExpiringItems] = useState<InventoryItem[]>([])

    const fetchLowStockItems = async () => {
        try {
            const response = await axios.get('/pantry/inventory/low-stock')
            console.log(response);

            setLowStockItems(response.data)
        } catch (error) {
            toast.error('Failed to fetch low stock items')
        }
    }

    const fetchExpiringItems = async () => {
        try {
            const response = await axios.get('/pantry/inventory/expiring')
            console.log(response);
            setExpiringItems(response.data)
        } catch (error) {
            toast.error('Failed to fetch expiring items')
        }
    }

    useEffect(() => {
        fetchLowStockItems()
        fetchExpiringItems()
    }, [])

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Min Threshold</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lowStockItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.minThreshold}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Expiring Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expiringItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{new Date(item.expiryDate!).toLocaleDateString()}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default AnalyticsSection