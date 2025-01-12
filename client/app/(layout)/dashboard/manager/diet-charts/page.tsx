'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Patient } from '../patients/_components/types'
import { toast } from 'sonner'

interface PatientList extends Patient {
    _id: string
}

export default function DietChartsPage() {
    const [patients, setPatients] = useState<PatientList[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            const response = await axios.get('/patients/')
            setPatients(response.data)
        } catch (error) {
            toast.error('Failed to fetch patients')
        }
    }

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handlePatientClick = (patientId: string) => {
        router.push(`/dashboard/manager/diet-charts/${patientId}`)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Diet Charts Management</h1>

            <div className="mb-4">
                <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search patients"
                />
            </div>

            <Table>
                <TableCaption>A list of patients and their diet charts.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Room No.</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPatients.map(patient => (
                        <TableRow key={patient._id}>
                            <TableCell>{patient.name}</TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell>{patient.age}</TableCell>
                            <TableCell>{patient.roomDetails.roomNumber}</TableCell>
                            <TableCell className="text-center">
                                <Button
                                    onClick={() => handlePatientClick(patient._id)}
                                    variant="link"
                                >
                                    View Diet Plan
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
