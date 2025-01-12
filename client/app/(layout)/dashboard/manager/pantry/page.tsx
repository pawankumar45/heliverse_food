'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import TaskSection from './_components/task-section'
import AnalyticsSection from './_components/analytic-section'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface InventoryItem {
    _id: string
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


export default function PantryManagementPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [newItem, setNewItem] = useState<Partial<InventoryItem>>({})
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchInventory()
    }, [])

    const fetchInventory = async () => {
        try {
            const response = await axios.get('/pantry/inventory')
            // console.log(response);
            setInventory(response.data)
        } catch (error) {
            toast.error('Failed to fetch inventory')
        }
    }

    const handleUpdateItem = async () => {
        if (!editingItem) return
        try {
            setLoading(true)
            const response = await axios.put(`/pantry/inventory`, editingItem)
            // console.log(response);
            toast.success('Item updated successfully')
            fetchInventory()
            setEditingItem(null)
        } catch (error) {
            toast.error('Failed to update item')
        } finally {
            setLoading(false)
        }
    }


    const handleAddItem = async () => {
        try {
            setLoading(true)
            const response = await axios.post('/pantry/inventory', newItem)
            // console.log(response);

            if (response.status === 201) {
                setOpen(false)
            }
            toast.success('Item added successfully')
            fetchInventory()
            setNewItem({})
        } catch (error) {
            toast.error('Failed to add item')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteItem = async (id: string) => {
        try {
            setLoading(true)
            const response = await axios.delete(`/pantry/inventory/${id}`)
            // console.log(response);

            toast.success('Item deleted successfully')
            fetchInventory()
        } catch (error) {
            toast.error('Failed to delete item')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Pantry Management</h1>

                <Tabs defaultValue="inventory">
                    <TabsList>
                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="inventory">
                        <Card>
                            <CardHeader className='flex justify-between flex-row'>
                                <CardTitle>Inventory</CardTitle>
                                <div>
                                    <Button onClick={() => setOpen(true)}>Add New Item</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Inventory Item</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={newItem.name || ''}
                                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                                    className="col-span-3"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="category" className="text-right">
                                                    Category
                                                </Label>
                                                <Select
                                                    onValueChange={(value) => setNewItem({ ...newItem, category: value as InventoryItem['category'] })}
                                                >
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ingredients">Ingredients</SelectItem>
                                                        <SelectItem value="utensils">Utensils</SelectItem>
                                                        <SelectItem value="equipment">Equipment</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="quantity" className="text-right">
                                                    Quantity
                                                </Label>
                                                <Input
                                                    id="quantity"
                                                    type="number"
                                                    value={newItem.quantity || ''}
                                                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                                    className="col-span-3"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="unit" className="text-right">
                                                    Unit
                                                </Label>
                                                <Input
                                                    id="unit"
                                                    value={newItem.unit || ''}
                                                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="minThreshold" className="text-right">
                                                    Min Threshold
                                                </Label>
                                                <Input
                                                    id="minThreshold"
                                                    type="number"
                                                    value={newItem.minThreshold || ''}
                                                    onChange={(e) => setNewItem({ ...newItem, minThreshold: Number(e.target.value) })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="location" className="text-right">
                                                    Location
                                                </Label>
                                                <Input
                                                    id="location"
                                                    value={newItem.location || ''}
                                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="supplier" className="text-right">
                                                    Supplier
                                                </Label>
                                                <Input
                                                    id="supplier"
                                                    value={newItem.supplier || ''}
                                                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="expiryDate" className="text-right">
                                                    Expiry Date
                                                </Label>
                                                <Input
                                                    id="expiryDate"
                                                    type="date"
                                                    value={newItem.expiryDate || ''}
                                                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="notes" className="text-right">
                                                    Notes
                                                </Label>
                                                <Textarea
                                                    id="notes"
                                                    value={newItem.notes || ''}
                                                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                                                    className="col-span-3"
                                                />
                                            </div>
                                        </div>
                                        <Button onClick={handleAddItem} disabled={loading}>
                                            {loading && <Loader2 className='h-5 w-5' />}
                                            Add Item
                                        </Button>
                                    </DialogContent>
                                </Dialog>


                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inventory.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.category}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.unit}</TableCell>
                                                <TableCell>{item.location}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" className="mr-2" onClick={() => setEditingItem(item)}>
                                                        Edit
                                                    </Button>
                                                    <Button variant="destructive" onClick={() => handleDeleteItem(item._id)} disabled={loading}>
                                                        {loading && <Loader2 className='h-5 w-5' />}
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {editingItem && (
                            <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Inventory Item</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-name" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="edit-name"
                                                value={editingItem.name}
                                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-category" className="text-right">
                                                Category
                                            </Label>
                                            <Select
                                                value={editingItem.category}
                                                onValueChange={(value) => setEditingItem({ ...editingItem, category: value as InventoryItem['category'] })}
                                            >
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ingredients">Ingredients</SelectItem>
                                                    <SelectItem value="utensils">Utensils</SelectItem>
                                                    <SelectItem value="equipment">Equipment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-quantity" className="text-right">
                                                Quantity
                                            </Label>
                                            <Input
                                                id="edit-quantity"
                                                type="number"
                                                value={editingItem.quantity}
                                                onChange={(e) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-unit" className="text-right">
                                                Unit
                                            </Label>
                                            <Input
                                                id="edit-unit"
                                                value={editingItem.unit}
                                                onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-minThreshold" className="text-right">
                                                Min Threshold
                                            </Label>
                                            <Input
                                                id="edit-minThreshold"
                                                type="number"
                                                value={editingItem.minThreshold}
                                                onChange={(e) => setEditingItem({ ...editingItem, minThreshold: Number(e.target.value) })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="edit-location" className="text-right">
                                                Location
                                            </Label>
                                            <Input
                                                id="edit-location"
                                                value={editingItem.location}
                                                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="supplier" className="text-right">
                                                Supplier
                                            </Label>
                                            <Input
                                                id="supplier"
                                                value={editingItem.supplier || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, supplier: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="expiryDate" className="text-right">
                                                Expiry Date
                                            </Label>
                                            <Input
                                                id="expiryDate"
                                                type="date"
                                                value={editingItem.expiryDate?.split('T')[0] || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, expiryDate: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="notes" className="text-right">
                                                Notes
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                value={editingItem.notes || ''}
                                                onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={handleUpdateItem} disabled={loading}>
                                        {loading && <Loader2 className='h-5 w-5' />}
                                        Update Item
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        )}
                    </TabsContent>

                    <TabsContent value="tasks">
                        <TaskSection />
                    </TabsContent>

                    <TabsContent value="analytics">
                        <AnalyticsSection />
                    </TabsContent>
                </Tabs >
            </div >
        </>
    )
}

