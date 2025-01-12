import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Patient } from './types'
import { Loader2 } from 'lucide-react'

interface CreatePatientDialogProps {
    isOpen: boolean
    onClose: () => void
    onCreatePatient: (patient: Patient) => void
    loading: boolean
}

export function CreatePatientDialog({ isOpen, onClose, onCreatePatient, loading }: CreatePatientDialogProps) {
    const [patient, setPatient] = useState<Patient>({
        name: '',
        age: '',
        gender: '',
        contactInfo: { phone: '', emergencyContact: '' },
        roomDetails: { roomNumber: '', bedNumber: '', floorNumber: '' },
        medicalDetails: { diseases: '', allergies: '' },
        otherDetails: { dietaryRestrictions: '' },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPatient((prev) => ({ ...prev, [name]: value }))
    }

    const handleNestedChange = (category: string, field: string, value: string) => {
        setPatient((prev) => ({
            ...prev,
            [category]: { ...prev[category as keyof typeof prev], [field]: value },
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onCreatePatient(patient)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="overflow-y-auto max-h-[95vh] w-[90vw] max-w-[600px] space-y-6"
            >
                <DialogHeader>
                    <DialogTitle>Create New Patient</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={patient.name} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" name="age" type="number" value={patient.age} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    onValueChange={(value) => setPatient((prev) => ({ ...prev, gender: value }))}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Contact Information</h3>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={patient.contactInfo.phone}
                                    onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                <Input
                                    id="emergencyContact"
                                    name="emergencyContact"
                                    value={patient.contactInfo.emergencyContact}
                                    onChange={(e) => handleNestedChange('contactInfo', 'emergencyContact', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Room Details</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="roomNumber">Room Number</Label>
                                    <Input
                                        id="roomNumber"
                                        name="roomNumber"
                                        type="number"
                                        value={patient.roomDetails.roomNumber}
                                        onChange={(e) => handleNestedChange('roomDetails', 'roomNumber', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="bedNumber">Bed Number</Label>
                                    <Input
                                        id="bedNumber"
                                        name="bedNumber"
                                        value={patient.roomDetails.bedNumber}
                                        onChange={(e) => handleNestedChange('roomDetails', 'bedNumber', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="floorNumber">Floor Number</Label>
                                    <Input
                                        id="floorNumber"
                                        name="floorNumber"
                                        type="number"
                                        value={patient.roomDetails.floorNumber}
                                        onChange={(e) => handleNestedChange('roomDetails', 'floorNumber', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Medical Details</h3>
                            <div>
                                <Label htmlFor="diseases">Diseases (comma-separated)</Label>
                                <Textarea
                                    id="diseases"
                                    name="diseases"
                                    value={patient.medicalDetails.diseases}
                                    onChange={(e) => handleNestedChange('medicalDetails', 'diseases', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                                <Textarea
                                    id="allergies"
                                    name="allergies"
                                    value={patient.medicalDetails.allergies}
                                    onChange={(e) => handleNestedChange('medicalDetails', 'allergies', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="dietaryRestrictions">Dietary Restrictions (comma-separated)</Label>
                            <Textarea
                                id="dietaryRestrictions"
                                name="dietaryRestrictions"
                                value={patient.otherDetails.dietaryRestrictions}
                                onChange={(e) => handleNestedChange('otherDetails', 'dietaryRestrictions', e.target.value)}
                            />
                        </div>
                    </div>
                    <Button disabled={loading} type="submit">
                        {loading && <Loader2 className='h-4 w-4' />}
                        Create Patient
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
