'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { TaskSummary } from './_components/TaskSummary'
import { DeliveryPersonnelSummary } from './_components/DeliveryPersonnelSummary'
import { MealBoxSummary } from './_components/MealboxSummary'
import { toast } from 'sonner'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function PantryDashboard() {
  const [inventoryLevels, setInventoryLevels] = useState<any[]>([])
  const [mealPreparationTrend, setMealPreparationTrend] = useState<any[]>([])
  const [ingredientUsage, setIngredientUsage] = useState<any[]>([])
  const [taskCompletionRate, setTaskCompletionRate] = useState<any[]>([])

  useEffect(() => {
    fetchInventoryLevels()
    fetchMealPreparationTrend()
    fetchIngredientUsage()
    fetchTaskCompletionRate()
  }, [])

  const fetchInventoryLevels = async () => {
    try {
      const response = await axios.get('/analytics/pantry/inventory-levels')
      setInventoryLevels(response.data)
    } catch (error) {
      toast.error('Failed to fetch inventory levels')
    }
  }

  const fetchMealPreparationTrend = async () => {
    try {
      const response = await axios.get('/analytics/pantry/meal-preparation-trend')
      setMealPreparationTrend(response.data)
    } catch (error) {
      toast.error('Failed to fetch meal preparation trend')
    }
  }

  const fetchIngredientUsage = async () => {
    try {
      const response = await axios.get('/analytics/pantry/ingredient-usage')
      setIngredientUsage(response.data)
    } catch (error) {
      toast.error('Failed to fetch ingredient usage')
    }
  }

  const fetchTaskCompletionRate = async () => {
    try {
      const response = await axios.get('/analytics/pantry/task-completion-rate')
      setTaskCompletionRate(response.data)
    } catch (error) {
      toast.error('Failed to fetch task completion rate')
    }
  }

  const ingredientChartConfig = ingredientUsage.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: "#8884d8",
    };
    return config;
  }, {} as Record<string, { label?: React.ReactNode; color?: string }>);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Pantry Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preparation Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskSummary />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryPersonnelSummary />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meal Boxes</CardTitle>
          </CardHeader>
          <CardContent>
            <MealBoxSummary />
          </CardContent>
        </Card>

      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-3'>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                current: {
                  label: "Current Level",
                  color: "hsl(var(--chart-1))",
                },
                minimum: {
                  label: "Minimum Level",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryLevels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="current" fill="var(--color-current)" name="Current Level" />
                  <Bar dataKey="minimum" fill="var(--color-minimum)" name="Minimum Level" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meal Preparation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                prepared: {
                  label: "Meals Prepared",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mealPreparationTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="prepared" stroke="var(--color-prepared)" name="Meals Prepared" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingredient Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={ingredientChartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ingredientUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {ingredientUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: {
                  label: "Completion Rate",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskCompletionRate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" name="Completion Rate" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

