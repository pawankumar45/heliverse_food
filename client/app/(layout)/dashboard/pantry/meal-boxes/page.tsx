'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { MealBoxList } from '../_components/MealBoxList'
import { MealBox, DeliveryPersonnel, NewMealBox } from "../_components/types"
import { toast } from 'sonner'

export default function MealBoxesPage() {
    const [mealBoxes, setMealBoxes] = useState<MealBox[]>([])
    const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPersonnel[]>([])
    const [newMealBox, setNewMealBox] = useState<NewMealBox>({
        taskId: '',
        patientId: '',
        dietChartId: '',
        mealType: 'morning',
        specialInstructions: '',
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchMealBoxes()
        fetchDeliveryPersonnel()
    }, [])

    const fetchMealBoxes = async () => {
        try {
            const response = await axios.get('/inner-pantry/meal-boxes')
            setMealBoxes(response.data)
        } catch (error) {
            toast.error('Failed to fetch meal boxes')
        }
    }

    const fetchDeliveryPersonnel = async () => {
        try {
            const response = await axios.get('/inner-pantry/delivery-personnel')
            setDeliveryPersonnel(response.data)
        } catch (error) {
            toast.error('Failed to fetch delivery personnel')
        }
    }

    const assignMealBox = async (mealBoxId: string, deliveryPersonnelId: string) => {
        try {
            await axios.post('/inner-pantry/meal-boxes/assign', { mealBoxId, deliveryPersonnelId })
            toast.success('Meal box assigned successfully')
            fetchMealBoxes()
        } catch (error) {
            toast.error('Failed to assign meal box')
        }
    }

    const updateDeliveryStatus = async (mealBoxId: string, status: MealBox['status'], deliveryNotes?: string) => {
        try {
            await axios.put(`/inner-pantry/meal-boxes/${mealBoxId}/status`, { status, deliveryNotes })
            toast.success('Delivery status updated successfully')
            fetchMealBoxes()
        } catch (error) {
            toast.error('Failed to update delivery status')
        }
    }

    const createMealBox = async () => {

        try {
            setLoading(true)
            await axios.post('/inner-pantry/meal-boxes', newMealBox)
            toast.success('Meal box created successfully')
            setNewMealBox({
                taskId: '',
                patientId: '',
                dietChartId: '',
                mealType: 'morning',
                specialInstructions: '',
            })
            fetchMealBoxes()
        } catch (error) {
            toast.error('Failed to create meal box')
        } finally {
            setLoading(false)
        }
    }

    const deleteMealBox = async (mealBoxId: string) => {
        try {
            setLoading(true)
            await axios.delete(`/inner-pantry/meal-boxes/${mealBoxId}`)
            toast.success('Meal box deleted successfully')
            fetchMealBoxes()
        } catch (error) {
            toast.error('Failed to delete meal box')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-6">Meal Box Management</h1>
            </div>
            <MealBoxList
                mealBoxes={mealBoxes}
                deliveryPersonnel={deliveryPersonnel}
                onAssignMealBox={assignMealBox}
                onUpdateDeliveryStatus={updateDeliveryStatus}
                onDeleteMealBox={deleteMealBox}
                loading={loading}
            />
        </div>
    )
}

