'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CreateDietPlan from '../components/CreateDietPlan';
import { Skeleton } from '@/components/ui/skeleton';
import DeleteDietChart from '../components/DeleteDietChart';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DietPlan {
    patientId: string;
    _id: string;
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

const EditDietPlanPage = () => {
    const params = useParams();
    const router = useRouter();
    const [patientName, setPatientName] = useState('');
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false)

    useEffect(() => {
        const fetchDietPlan = async () => {
            try {
                setLoading(true);
                const patientResponse = await axios.get(`/patients/${params.patientId}`);
                setPatientName(patientResponse.data.name);

                const dietResponse = await axios.get(`/diet-charts/patientId/${params.patientId}`);
                setDietPlan(dietResponse.data);
            } catch (error) {
                toast.error('Failed to fetch diet details')
            } finally {
                setLoading(false);
            }
        };

        fetchDietPlan();
    }, [params.patientId, toast]);

    const handleInputChange = (
        meal: 'morning' | 'afternoon' | 'night',
        field: 'menu' | 'ingredients' | 'instructions',
        value: string,
        index?: number
    ) => {
        if (!dietPlan) return;

        setDietPlan(prev => {
            if (!prev) return prev;
            const updatedDietPlan = { ...prev };
            if (field === 'instructions') {
                updatedDietPlan.meals[meal][field] = value;
            } else if (index !== undefined) {
                updatedDietPlan.meals[meal][field][index] = value;
            }
            return updatedDietPlan;
        });
    };

    const addItem = (meal: 'morning' | 'afternoon' | 'night', field: 'menu' | 'ingredients') => {
        if (!dietPlan) return;

        setDietPlan(prev => {
            if (!prev) return prev;
            const updatedDietPlan = { ...prev };
            updatedDietPlan.meals[meal][field].push('');
            return updatedDietPlan;
        });
    };

    const removeItem = (meal: 'morning' | 'afternoon' | 'night', field: 'menu' | 'ingredients', index: number) => {
        if (!dietPlan) return;

        setDietPlan(prev => {
            if (!prev) return prev;
            const updatedDietPlan = { ...prev };
            updatedDietPlan.meals[meal][field].splice(index, 1);
            return updatedDietPlan;
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dietPlan) return;

        try {
            setUpdateLoading(true)
            const res = await axios.put(`/diet-charts/${dietPlan._id}`, dietPlan);
            console.log(res);
            toast.success('Diet plan updated successfully')
            router.push('/dashboard/manager');
        } catch (error) {
            toast.error('Failed to update diet plan')
        } finally {
            setUpdateLoading(false)
        }
    };

    if (loading) {
        return <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>;
    }

    return (
        (!loading && dietPlan) ? <div className="container mx-auto p-10">
            <div className='flex justify-between mb-6'>
                <div className='flex gap-3 items-center'>
                    <ArrowLeft className='w-5 h-5 cursor-pointer' onClick={() => router.back()} />
                    <h1 className="text-2xl font-bold ">Edit Diet Plan for {patientName}</h1>
                </div>

                <DeleteDietChart id={dietPlan._id} />
            </div>
            <form onSubmit={handleUpdate}>
                {['morning', 'afternoon', 'night'].map(meal => (
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
                                                onChange={(e) =>
                                                    handleInputChange(meal as 'morning' | 'afternoon' | 'night', 'menu', e.target.value, index)
                                                }
                                                placeholder={`Menu item ${index + 1}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    removeItem(meal as 'morning' | 'afternoon' | 'night', 'menu', index)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addItem(meal as 'morning' | 'afternoon' | 'night', 'menu')}
                                        className="mt-2"
                                    >
                                        Add Menu Item
                                    </Button>
                                </div>
                                <div>
                                    <Label>Ingredients</Label>
                                    {dietPlan.meals[meal as keyof typeof dietPlan.meals].ingredients.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-2 mt-2">
                                            <Input
                                                value={item}
                                                onChange={(e) =>
                                                    handleInputChange(meal as 'morning' | 'afternoon' | 'night', 'ingredients', e.target.value, index)
                                                }
                                                placeholder={`Ingredient ${index + 1}`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    removeItem(meal as 'morning' | 'afternoon' | 'night', 'ingredients', index)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addItem(meal as 'morning' | 'afternoon' | 'night', 'ingredients')}
                                        className="mt-2"
                                    >
                                        Add Ingredient
                                    </Button>
                                </div>
                                <div>
                                    <Label>Instructions</Label>
                                    <Textarea
                                        value={dietPlan.meals[meal as keyof typeof dietPlan.meals].instructions}
                                        onChange={(e) =>
                                            handleInputChange(meal as 'morning' | 'afternoon' | 'night', 'instructions', e.target.value)
                                        }
                                        placeholder="Instructions"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <Button type="submit" disabled={updateLoading}>
                    {loading && <Loader2 className='h-5 w-5' />}
                    Update Diet Plan
                </Button>
            </form>
        </div> : <CreateDietPlan patientId={params.patientId as string} />
    );
};

export default EditDietPlanPage;
