'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Task } from './types'
import { usePatients } from './_hooks/usePatients'
import { useDietCharts } from './_hooks/useDietCharts'
import { useUsers } from './_hooks/useUsers'
import { Loader2 } from 'lucide-react'

interface EditTaskDialogProps {
    task: Task | null
    onClose: () => void
    onUpdateTask: (task: Task) => Promise<void>
    loading: boolean
}

export function EditTaskDialog({ task, onClose, onUpdateTask, loading }: EditTaskDialogProps) {
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const { patients, searchPatients } = usePatients()
    const { dietCharts, searchDietCharts } = useDietCharts()
    const { users, searchUsers } = useUsers()
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [dietChartSearchTerm, setDietChartSearchTerm] = useState("");
    const [showDietChartDropdown, setShowDietChartDropdown] = useState(false);

    const [assignedToSearchTerm, setAssignedToSearchTerm] = useState("");
    const [showAssignedToDropdown, setShowAssignedToDropdown] = useState(false);

    const filteredDietCharts = dietCharts
        ? dietCharts.filter(
            (dietChart) =>
                dietChart?.patientId?.name?.toLowerCase().includes(dietChartSearchTerm.toLowerCase())
        )
        : [];

    const filteredUsers = users ? users.filter((user) =>
        user.name.toLowerCase().includes(assignedToSearchTerm.toLowerCase())
    ) : [];

    const filteredPatients = patients ? patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];


    useEffect(() => {
        setEditingTask(task)
        console.log(task);

        setSearchTerm(task?.patientId.name || "")
        setDietChartSearchTerm(task?.patientId.name || "")
        setAssignedToSearchTerm(task?.assignedTo.name || "")
    }, [task])

    const handleUpdateTask = async () => {
        // console.log(editingTask);

        if (editingTask) {
            await onUpdateTask(editingTask)
            onClose()
        }
    }

    if (!editingTask) return null

    return (
        <Dialog open={!!task} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-taskType" className="text-right">
                            Task Type
                        </Label>
                        <Select
                            value={editingTask.taskType}
                            onValueChange={(value) => setEditingTask({ ...editingTask, taskType: value as Task['taskType'] })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="preparation">Preparation</SelectItem>
                                <SelectItem value="delivery">Delivery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-mealType" className="text-right">
                            Meal Type
                        </Label>
                        <Select
                            value={editingTask.mealType}
                            onValueChange={(value) => setEditingTask({ ...editingTask, mealType: value as Task['mealType'] })}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="morning">Morning</SelectItem>
                                <SelectItem value="afternoon">Afternoon</SelectItem>
                                <SelectItem value="night">Night</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="patientId" className="text-right">
                            Patient
                        </Label>
                        <div className="relative col-span-3" >
                            <Input
                                type="text"
                                placeholder="Type to search for a patient"
                                className="w-full border border-gray-300 rounded p-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={() => setShowDropdown(prev => !prev)}
                            />
                            {filteredPatients.length > 0 && showDropdown && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 shadow-md mt-1 max-h-48 overflow-y-auto">
                                    {filteredPatients.map((patient) => (
                                        <li
                                            key={patient._id}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                                            onClick={() => {
                                                setEditingTask({
                                                    ...editingTask,
                                                    patientId: { id: patient._id, name: patient.name },
                                                });
                                                setSearchTerm(patient.name);
                                                setShowDropdown(false); // Close dropdown
                                            }}
                                        >
                                            {patient.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>


                    {/* Diet Chart Component */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dietChartId" className="text-right">
                            Diet Chart
                        </Label>
                        <div className="relative col-span-3">
                            <Input
                                type="text"
                                placeholder="Type to search for a diet chart"
                                className="w-full border border-gray-300 rounded p-2"
                                value={dietChartSearchTerm}
                                onChange={(e) => setDietChartSearchTerm(e.target.value)}
                                onClick={() => setShowDietChartDropdown(prev => !prev)}
                            />
                            {filteredDietCharts.length > 0 && showDietChartDropdown && (
                                <ul className="absolute z-10 w-full bg-white border dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 border-gray-300 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                                    {filteredDietCharts.map((dietChart) => (
                                        <li
                                            key={dietChart._id}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                                            onClick={() => {
                                                setEditingTask({
                                                    ...editingTask,
                                                    dietChartId: { id: dietChart._id, name: dietChart.patientId?.name },
                                                });
                                                setDietChartSearchTerm(dietChart.patientId?.name);
                                                setShowDietChartDropdown(false); // Close dropdown
                                            }}
                                        >
                                            {dietChart?.patientId?.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Assigned To Component */}
                    <div className="grid grid-cols-4 items-center gap-4">                                       <Label htmlFor="assignedTo" className="text-right">
                        Assigned To
                    </Label>
                        <div className="relative col-span-3">
                            <Input
                                type="text"
                                placeholder="Type to search for a user"
                                className="w-full border border-gray-300 rounded p-2"
                                value={assignedToSearchTerm}
                                onChange={(e) => setAssignedToSearchTerm(e.target.value)}
                                onClick={() => setShowAssignedToDropdown(prev => !prev)}
                            />
                            {filteredUsers.length > 0 && showAssignedToDropdown && (
                                <ul className="absolute z-10 w-full bg-white border dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 border-gray-300 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                                    {filteredUsers.map((user) => (
                                        <li
                                            key={user._id}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                                            onClick={() => {
                                                setEditingTask({
                                                    ...editingTask,
                                                    assignedTo: { id: user._id, name: user.name },
                                                });
                                                setAssignedToSearchTerm(user.name);
                                                setShowAssignedToDropdown(false); // Close dropdown
                                            }}
                                        >
                                            {user.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-notes" className="text-right">
                            Notes
                        </Label>
                        <Textarea
                            id="edit-notes"
                            value={editingTask.notes}
                            onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <Button onClick={handleUpdateTask} disabled={loading}>
                        {loading && <Loader2 className='h-5 w-5' />}
                        Update Task
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

