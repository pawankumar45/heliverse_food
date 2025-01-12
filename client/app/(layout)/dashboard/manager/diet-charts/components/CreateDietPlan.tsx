'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface DietPlan {
    patientId: string;
    meals: {
        morning: {
            menu: string[];
            ingredients: string[];
            instructions: string;
        };
        afternoon: {
            menu: string[];
            ingredients: string[];
            instructions: string;
        };
        night: {
            menu: string[];
            ingredients: string[];
            instructions: string;
        };
    };
}

const CreateDietPlan = ({ patientId }: { patientId: string }) => {
    const router = useRouter()
    const [patientName, setPatientName] = useState('')
    const [dietPlan, setDietPlan] = useState<DietPlan>({
        patientId: patientId as string,
        meals: {
            morning: { menu: [''], ingredients: [''], instructions: '' },
            afternoon: { menu: [''], ingredients: [''], instructions: '' },
            night: { menu: [''], ingredients: [''], instructions: '' },
        },
    })
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPatientName = async () => {
            try {
                const response = await axios.get(`/patients/${patientId}`)
                setPatientName(response.data.name)
            } catch (error) {
                toast.error('Failed to fetch patient details')
            }
        }

        fetchPatientName()
    }, [patientId])

    const handleInputChange = (meal: 'morning' | 'afternoon' | 'night', field: 'menu' | 'ingredients' | 'instructions', value: string, index?: number) => {
        setDietPlan(prev => {
            const newDietPlan = { ...prev }
            if (field === 'instructions') {
                newDietPlan.meals[meal][field] = value
            } else if (index !== undefined) {
                newDietPlan.meals[meal][field][index] = value
            }
            return newDietPlan
        })
    }

    const addItem = (meal: 'morning' | 'afternoon' | 'night', field: 'menu' | 'ingredients') => {
        setDietPlan(prev => {
            const newDietPlan = { ...prev }
            newDietPlan.meals[meal][field].push('')
            return newDietPlan
        })
    }

    const removeItem = (meal: 'morning' | 'afternoon' | 'night', field: 'menu' | 'ingredients', index: number) => {
        setDietPlan(prev => {
            const newDietPlan = { ...prev }
            newDietPlan.meals[meal][field].splice(index, 1)
            return newDietPlan
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // console.log(dietPlan);

        try {
            setLoading(true)
            const res = await axios.post('/diet-charts/', dietPlan)

            toast.success('Diet plan created successfully')
            router.push('/dashboard/manager')
        } catch (error) {
            toast.error('Failed to create diet plan')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-6">Create Diet Plan for {patientName}</h1>
            <form onSubmit={handleSubmit}>
                {['morning', 'afternoon', 'night'].map((meal) => (
                    <Card key={meal} className="mb-6">
                        <CardHeader>
                            <CardTitle className="capitalize">{meal} Meal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label>Menu Items</Label>
                                    {dietPlan.meals[meal as keyof typeof dietPlan.meals].menu.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2 mt-2">
                                            <Input
                                                value={item}
                                                onChange={(e) => handleInputChange(meal as 'morning' | 'afternoon' | 'night', 'menu', e.target.value, index)}
                                                placeholder={`Menu item ${index + 1}`}
                                            />
                                            <Button type="button" variant="outline" onClick={() => removeItem(meal as 'morning' | 'afternoon' | 'night', 'menu', index)}>Remove</Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={() => addItem(meal as 'morning' | 'afternoon' | 'night', 'menu')} className="mt-2">Add Menu Item</Button>
                                </div>
                                <div>
                                    <Label>Ingredients</Label>
                                    {dietPlan.meals[meal as keyof typeof dietPlan.meals].ingredients.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2 mt-2">
                                            <Input
                                                value={item}
                                                onChange={(e) => handleInputChange(meal as 'morning' | 'afternoon' | 'night', 'ingredients', e.target.value, index)}
                                                placeholder={`Ingredient ${index + 1}`}
                                            />
                                            <Button type="button" variant="outline" onClick={() => removeItem(meal as 'morning' | 'afternoon' | 'night', 'ingredients', index)}>Remove</Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={() => addItem(meal as 'morning' | 'afternoon' | 'night', 'ingredients')} className="mt-2">Add Ingredient</Button>
                                </div>
                                <div>
                                    <Label>Instructions</Label>
                                    <Textarea
                                        value={dietPlan.meals[meal as keyof typeof dietPlan.meals].instructions}
                                        onChange={(e) => handleInputChange(meal as 'morning' | 'afternoon' | 'night', 'instructions', e.target.value)}
                                        placeholder="Enter meal instructions"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className='h-5 w-5' />}

                    Create Diet Plan
                </Button>
            </form>
        </div>
    )
}

export default CreateDietPlan

