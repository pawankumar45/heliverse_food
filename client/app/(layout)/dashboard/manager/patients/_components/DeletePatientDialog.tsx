import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface DeletePatientDialogProps {
    isOpen: boolean
    onClose: () => void
    patientName: string
    onDeletePatient: () => void
    loading: boolean
}

export function DeletePatientDialog({ isOpen, onClose, patientName, onDeletePatient, loading }: DeletePatientDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Patient</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the patient "{patientName}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onDeletePatient} disabled={loading}>
                        {loading && <Loader2 className='h-5 w-5' />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

