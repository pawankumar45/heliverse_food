import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DeliveryPersonnel } from './types'
import { Loader2 } from 'lucide-react'

interface DeliveryPersonnelListProps {
    personnel: DeliveryPersonnel[]
    onUpdatePersonnel: (id: string, updates: Partial<DeliveryPersonnel>) => void
    loading: boolean
}

export function DeliveryPersonnelList({ personnel, onUpdatePersonnel, loading }: DeliveryPersonnelListProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Assignments</TableHead>
                    <TableHead>Max Assignments</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {personnel.map((person) => (
                    <TableRow key={person._id}>
                        <TableCell>{person.name}</TableCell>
                        <TableCell>{person.email}</TableCell>
                        <TableCell>{person.deliveryStatus}</TableCell>
                        <TableCell>{person.currentAssignments}</TableCell>
                        <TableCell>{person.maxAssignments}</TableCell>
                        <TableCell>
                            <Button
                                variant={'outline'} onClick={() => onUpdatePersonnel(person._id, { deliveryStatus: person.deliveryStatus === 'available' ? 'busy' : 'available' })}
                                disabled={loading}
                            >
                                {loading && <Loader2 className='h-5 w-5' />}
                                Change Status
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

