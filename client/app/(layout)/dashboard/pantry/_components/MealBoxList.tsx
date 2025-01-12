import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { DeliveryPersonnel, MealBox } from './types';

interface MealBoxListProps {
    mealBoxes: MealBox[]
    deliveryPersonnel: DeliveryPersonnel[]
    onAssignMealBox: (mealBoxId: string, deliveryPersonnelId: string) => void
    onUpdateDeliveryStatus: (mealBoxId: string, status: MealBox['status'], deliveryNotes?: string) => void
    onDeleteMealBox: (mealBoxId: string) => void
    loading: boolean
}

export function MealBoxList({
    mealBoxes,
    deliveryPersonnel,
    onAssignMealBox,
    onUpdateDeliveryStatus,
    onDeleteMealBox,
    loading
}: MealBoxListProps) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Meal Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mealBoxes.map((mealBox) => (
                        <TableRow key={mealBox._id}>
                            <TableCell>{mealBox.patientId.name}</TableCell>
                            <TableCell>{mealBox.patientId.roomDetails.roomNumber}</TableCell>
                            <TableCell>{mealBox.mealType}</TableCell>
                            <TableCell>{mealBox.status}</TableCell>
                            <TableCell>{mealBox.deliveryPersonnelId?.name || 'Not assigned'}</TableCell>
                            <TableCell className='flex flex-row gap-1'>
                                {mealBox.status === 'ready' && (
                                    <Select
                                        onValueChange={(value) => onAssignMealBox(mealBox._id, value)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Assign to" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {deliveryPersonnel.map((person) => (
                                                <SelectItem key={person._id} value={person._id}>{person.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {mealBox.status !== 'delivered' && (
                                    <Select
                                        onValueChange={(value) => onUpdateDeliveryStatus(mealBox._id, value as MealBox['status'])}
                                        defaultValue={mealBox.status}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Update status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="preparing">Preparing</SelectItem>
                                            <SelectItem value="ready">Ready</SelectItem>
                                            <SelectItem value="assigned">Assigned</SelectItem>
                                            <SelectItem value="in-transit">In Transit</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDeleteMealBox(mealBox._id)}
                                    className="ml-2"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className='h-5 w-5' />
                                        :
                                        <Trash2 className="h-4 w-4" />}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

