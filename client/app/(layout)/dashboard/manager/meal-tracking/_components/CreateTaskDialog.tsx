'use client'

import React, { useState } from 'react'
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

interface CreateTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (task: Partial<Task>) => Promise<void>
  taskType: 'delivery' | 'meal'
  loading: boolean
}

export function CreateTaskDialog({ isOpen, onClose, onCreateTask, taskType, loading }: CreateTaskDialogProps) {
  const [newTask, setNewTask] = useState<Partial<Task>>({})
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

  const handleCreateTask = async () => {
    await onCreateTask(newTask)
    onClose()
    setNewTask({})
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="taskType" className="text-right">
              Task Type
            </Label>
            <Select
              onValueChange={(value) => setNewTask({ ...newTask, taskType: value as Task['taskType'] })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preparation">Preparation</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mealType" className="text-right">
              Meal Type
            </Label>
            <Select
              onValueChange={(value) => setNewTask({ ...newTask, mealType: value as Task['mealType'] })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select meal type" />
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
                <ul className="absolute z-10 w-full dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 bg-white border border-gray-300 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                  {filteredPatients.map((patient) => (
                    <li
                      key={patient._id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                      onClick={() => {
                        setNewTask({
                          ...newTask,
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
                <ul className="absolute z-10 w-full bg-white border border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                  {filteredDietCharts.map((dietChart) => (
                    <li
                      key={dietChart._id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                      onClick={() => {
                        setNewTask({
                          ...newTask,
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
                <ul className="absolute z-10 w-full bg-white border border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 rounded shadow-md mt-1 max-h-48 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <li
                      key={user._id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-950 cursor-pointer"
                      onClick={() => {
                        setNewTask({
                          ...newTask,
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
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={newTask.notes || ''}
              onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleCreateTask} disabled={loading}>
          {loading && <Loader2 className='h-5 w-5' />}
          Create Task
        </Button>
      </DialogContent>
    </Dialog>
  )
}

