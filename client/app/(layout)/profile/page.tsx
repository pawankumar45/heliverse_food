'use client'

import React, { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface UserProfile {
    name: string
    email: string
    role: string
    phone: string
    address: string
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/auth/user')

            setProfile(response.data)
        } catch (error) {
            toast.error('Failed to fetch profile')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfile((prev) => prev ? { ...prev, [name]: value } : null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.put('/auth/user', profile)
            toast.success('Profile updated successfully')
            setIsEditing(false)
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    if (!profile) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto py-6 px-8">
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    name="role"
                                    value={profile.role}
                                    disabled
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="mt-4 space-x-2">
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className='h-5 w-5' />}
                                    Save Changes
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </div>
                        ) : (
                            <Button className="mt-4" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

