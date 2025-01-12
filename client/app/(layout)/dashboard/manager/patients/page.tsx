'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { PatientCard } from './_components/PatientCard'
import { SearchBar } from './_components/SearchBar'
import { CreatePatientDialog } from './_components/CreatePatientDialog'
import { EditPatientDialog } from './_components/EditPatientDialog'
import { DeletePatientDialog } from './_components/DeletePatientDialog'
import { Patient } from './_components/types'
import { toast } from 'sonner'

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([])
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            const response = await axios.get('/patients/')
            setPatients(response.data)
            setFilteredPatients(response.data)
        } catch (error) {
            toast.error('Failed to fetch patients')
        }
    }

    const handleSearch = (searchTerm: string) => {
        const filtered = patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredPatients(filtered)
    }

    const handleCreatePatient = async (newPatient: Patient) => {
        try {
            setLoading(true)
            await axios.post('/patients/', newPatient)
            toast.success('Patient created successfully')
            fetchPatients()
            setIsCreateDialogOpen(false)
        } catch (error) {
            toast.error('Failed to create patient')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePatient = async (updatedPatient: Patient) => {
        try {
            setLoading(true)
            await axios.put(`/patients/${updatedPatient._id}`, updatedPatient)
            toast.success('Patient updated successfully')
            fetchPatients()
            setIsEditDialogOpen(false)
        } catch (error) {
            toast.error('Failed to update patient')
        } finally {
            setLoading(false)
        }
    }

    const handleDeletePatient = async (id: string) => {
        try {
            setLoading(true)
            await axios.delete(`/patients/${id}`)
            toast.success('Patient deleted successfully')
            fetchPatients()
            setIsDeleteDialogOpen(false)
        } catch (error) {
            toast.error('Failed to delete patient')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Patients</h1>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Patient
                </Button>
            </div>
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {filteredPatients.map((patient) => (
                    <PatientCard
                        key={patient._id}
                        patient={patient}
                        onEdit={() => {
                            setSelectedPatient(patient)
                            setIsEditDialogOpen(true)
                        }}
                        onDelete={() => {
                            setSelectedPatient(patient)
                            setIsDeleteDialogOpen(true)
                        }}
                    />
                ))}
            </div>
            <CreatePatientDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onCreatePatient={handleCreatePatient}
                loading={loading}
            />
            {selectedPatient && (
                <>
                    <EditPatientDialog
                        isOpen={isEditDialogOpen}
                        onClose={() => setIsEditDialogOpen(false)}
                        patient={selectedPatient}
                        onUpdatePatient={handleUpdatePatient}
                        loading={loading}
                    />
                    <DeletePatientDialog
                        isOpen={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        patientName={selectedPatient.name}
                        onDeletePatient={() => handleDeletePatient(selectedPatient._id!)}
                        loading={loading}
                    />
                </>
            )}
        </div>
    )
}

