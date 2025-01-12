'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function DeliveryDashboard() {
  const [deliveryStats, setDeliveryStats] = useState<any>(null)
  const [currentDeliveries, setCurrentDeliveries] = useState<any[]>([])
  const [deliveryHistory, setDeliveryHistory] = useState<any[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null)

  useEffect(() => {
    fetchDeliveryStats()
    fetchCurrentDeliveries()
    fetchDeliveryHistory()
    fetchPerformanceMetrics()
  }, [])

  const fetchDeliveryStats = async () => {
    try {
      const response = await axios.get('/analytics/delivery/stats')
      console.log(response);

      setDeliveryStats(response.data)
    } catch (error) {
      toast.error('Failed to fetch delivery stats')
    }
  }

  const fetchCurrentDeliveries = async () => {
    try {
      const response = await axios.get('/analytics/delivery/current')
      setCurrentDeliveries(response.data)
    } catch (error) {
      toast.error('Failed to fetch current deliveries')
    }
  }

  const fetchDeliveryHistory = async () => {
    try {
      const response = await axios.get('/analytics/delivery/history')
      setDeliveryHistory(response.data)
    } catch (error) {
      toast.error('Failed to fetch delivery history')
    }
  }

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await axios.get('/analytics/delivery/performance')
      setPerformanceMetrics(response.data)
    } catch (error) {
      toast.error('Failed to fetch performance metrics')
    }
  }

  const deliveryStatsData = deliveryStats
    ? [
      { name: 'Completed', value: deliveryStats.completed },
      { name: 'In Progress', value: deliveryStats.inProgress },
      { name: 'Pending', value: deliveryStats.pending },
    ]
    : []

  const deliveryChartConfig = deliveryStatsData.reduce((config, item) => {
    config[item.name] = {
      label: item.name,
      color: "#8884d8",
    };
    return config;
  }, {} as Record<string, { label?: React.ReactNode; color?: string }>);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Delivery Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Delivery Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={deliveryChartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryStatsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deliveryStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            {deliveryStats && (
              <div className="mt-4 text-center">
                <p>Total Deliveries: {deliveryStats.totalDeliveries}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {performanceMetrics && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Rating</p>
                  <p className="text-2xl font-bold">{performanceMetrics.rating.toFixed(1)}/5</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Assignments</p>
                  <p className="text-2xl font-bold">{performanceMetrics.currentAssignments}/{performanceMetrics.maxAssignments}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Average Delivery Time</p>
                  <p className="text-2xl font-bold">{performanceMetrics.avgDeliveryTime} minutes</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Meal Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDeliveries.map((delivery) => (
                  <TableRow key={delivery._id}>
                    <TableCell>{delivery.patientId.name}</TableCell>
                    <TableCell>{delivery.patientId.roomDetails.roomNumber}</TableCell>
                    <TableCell>{delivery.mealType}</TableCell>
                    <TableCell>{delivery.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Meal Type</TableHead>
                  <TableHead>Delivery Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveryHistory.map((delivery) => (
                  <TableRow key={delivery._id}>
                    <TableCell>{delivery.patientId.name}</TableCell>
                    <TableCell>{delivery.patientId.roomDetails.roomNumber}</TableCell>
                    <TableCell>{delivery.mealType}</TableCell>
                    <TableCell>{new Date(delivery.deliveryTime).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

