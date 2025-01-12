import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { Patient } from './types'

interface PatientCardProps {
    patient: Patient
    onEdit: () => void
    onDelete: () => void
}

export function PatientCard({ patient, onEdit, onDelete }: PatientCardProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-2">{patient.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Age: {patient.age}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gender: {patient.gender}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Room: {patient.roomDetails.roomNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {patient.contactInfo.phone}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Emergency Contact: {patient.contactInfo.emergencyContact}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
            </CardFooter>
        </Card>
    )
}

