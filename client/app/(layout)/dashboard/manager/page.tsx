'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useRouter } from 'next/navigation'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { TaskSummary } from './_components/TaskSummary'
import { DeliveryPersonnelSummary } from './_components/DeliveryPersonnelSummary'
import { MealBoxSummary } from './_components/MealboxSummary'
import { toast } from 'sonner'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function ManagerDashboard() {
  const [deliveryStats, setDeliveryStats] = useState<any[]>([])
  const [patientStats, setPatientStats] = useState<any[]>([])
  const [mealDistribution, setMealDistribution] = useState<any[]>([])
  const [dietaryRestrictions, setDietaryRestrictions] = useState<any[]>([])
  const [weeklyMealPreparation, setWeeklyMealPreparation] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchDeliveryStats()
    fetchPatientStats()
    fetchMealDistribution()
    fetchDietaryRestrictions()
    fetchWeeklyMealPreparation()
  }, [])

  const fetchDeliveryStats = async () => {
    try {
      const response = await axios.get('/analytics/manager/delivery-stats')
      // console.log(response);

      setDeliveryStats(response.data)
    } catch (error) {
      toast.error('Failed to fetch delivery stats')
    }
  }

  const fetchPatientStats = async () => {
    try {
      const response = await axios.get('/analytics/manager/patient-stats')
      // console.log(response);

      setPatientStats(response.data)
    } catch (error) {
      toast.error('Failed to fetch patient stats')
    }
  }

  const fetchMealDistribution = async () => {
    try {
      const response = await axios.get('/analytics/manager/meal-distribution')
      // console.log(response);
      setMealDistribution(response.data)
    } catch (error) {
      toast.error('Failed to fetch meal distribution')
    }
  }

  const fetchDietaryRestrictions = async () => {
    try {
      const response = await axios.get('/analytics/manager/dietary-restrictions')
      // console.log(response);

      setDietaryRestrictions(response.data)
    } catch (error) {
      toast.error('Failed to fetch dietary restrictions')
    }
  }

  const fetchWeeklyMealPreparation = async () => {
    try {
      const response = await axios.get('/analytics/manager/weekly-meal-preparation')
      console.log(response);
      setWeeklyMealPreparation(response.data)
    } catch (error) {
      toast.error('Failed to fetch weekly meal preparation')
    }
  }

  const dietaryChartConfig = dietaryRestrictions.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: "hsl(var(--chart-1))",
    };
    return config;
  }, {} as Record<string, { label?: React.ReactNode; color?: string }>);

  const mealDistributionData = Object.entries(mealDistribution)
    .filter(([key]) => key !== "day")
    .map(([key, value]) => ({
      name: key,
      value: value as number,
    }));

  const mealChartConfig = mealDistributionData.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: "#8884d8",
    };
    return config;
  }, {} as Record<string, { label?: React.ReactNode; color?: string }>);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hospital Food Manager Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                delivered: {
                  label: "Delivered",
                  color: "hsl(var(--chart-1))",
                },
                pending: {
                  label: "Pending",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="delivered" fill="var(--color-delivered)" name="Delivered" />
                  <Bar dataKey="pending" fill="var(--color-pending)" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                total: {
                  label: "Total Patients",
                  color: "hsl(var(--chart-1))",
                },
                new: {
                  label: "New Patients",
                  color: "hsl(var(--chart-2))",
                },
                discharged: {
                  label: "Discharged Patients",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patientStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="var(--color-total)" name="Total Patients" />
                  <Line type="monotone" dataKey="new" stroke="var(--color-new)" name="New Patients" />
                  <Line type="monotone" dataKey="discharged" stroke="var(--color-discharged)" name="Discharged Patients" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={mealChartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mealDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mealDistribution.map((entry, index) => (
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
            <CardTitle>Dietary Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={dietaryChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dietaryRestrictions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Meal Preparation</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                breakfast: {
                  label: "Breakfast",
                  color: "hsl(var(--chart-1))",
                },
                lunch: {
                  label: "Lunch",
                  color: "hsl(var(--chart-2))",
                },
                dinner: {
                  label: "Dinner",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyMealPreparation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="breakfast" fill="var(--color-breakfast)" name="Breakfast" />
                  <Bar dataKey="lunch" fill="var(--color-lunch)" name="Lunch" />
                  <Bar dataKey="dinner" fill="var(--color-dinner)" name="Dinner" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={() => router.push('/dashboard/manager/patients')}>Manage Patients</Button>
            <Button onClick={() => router.push('/dashboard/manager/diet-charts')}>Manage Diet Charts</Button>
            <Button onClick={() => router.push('/dashboard/manager/pantry')}>Manage Pantry</Button>
            <Button onClick={() => router.push('/dashboard/manager/meal-tracking')}>Track Meals</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}