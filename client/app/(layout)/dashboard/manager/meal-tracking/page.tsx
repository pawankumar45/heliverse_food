'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DeliveryTasks } from './_components/DeliveryTasks'
import { MealTasks } from './_components/MealTasks'

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState<'delivery' | 'meal'>('delivery')

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Task Management</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="delivery" onValueChange={(value) => setActiveTab(value as 'delivery' | 'meal')}>
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="delivery">Delivery Tasks</TabsTrigger>
                            <TabsTrigger value="meal">Meal Tasks</TabsTrigger>
                        </TabsList>
                        <TabsContent value="delivery">
                            <DeliveryTasks />
                        </TabsContent>
                        <TabsContent value="meal">
                            <MealTasks />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

