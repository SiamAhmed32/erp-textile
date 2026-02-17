"use client";

import { decryptData, encryptData } from "@/lib/encryption";
import React, { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, User, Shield, Calendar, Clock, AtSign, Pencil, X, Save, Camera } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePatchUpdateSelfMutation } from "@/store/services/authApi";

interface UserData {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    displayName: string;
    role: string;
    status: string;
    avatarUrl?: string;
    lastLoginAt: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: "", lastName: "" });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [updateProfile, { isLoading: isUpdating }] = usePatchUpdateSelfMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const parsedUser = decryptData(storedUser);
                    if (parsedUser) {
                        setUserData(parsedUser);
                        setFormData({
                            firstName: parsedUser.firstName,
                            lastName: parsedUser.lastName,
                        });
                        setPreviewUrl(parsedUser.avatarUrl || null);
                    }
                }
            } catch (error) {
                console.error("Failed to parse user data", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    const handleUpdate = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            if (selectedFile) {
                formDataToSend.append("avatar", selectedFile);
            }

            const result = await updateProfile(formDataToSend).unwrap();

            // Assuming result.data holds the complete updated user object
            // If API returns just success message, careful here, but usually it returns updated resource
            const updatedUser = result.data || {
                ...userData,
                firstName: formData.firstName,
                lastName: formData.lastName,
                displayName: `${formData.firstName} ${formData.lastName}`,
                // If the API returns the new avatar URL, use it, otherwise keep old or preview (risky if not updated)
                avatarUrl: result.data?.avatarUrl || previewUrl
            };

            setUserData(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully");
            setIsEditing(false);
            setSelectedFile(null); // Reset file input after successful update
        } catch (error) {
            console.error("Failed to update profile", error);
            toast.error("Failed to update profile");
        }
    };

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Clean up memory when component unmounts or url changes
        return () => URL.revokeObjectURL(objectUrl);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader className="relative pb-10">
                        {/* Decorative header background */}
                        <div className="absolute left-0 -top-6 w-full h-36 bg-secondary to-secondary rounded-t-xl" />

                        <div className="relative pt-16 flex flex-col items-center">
                            {/* Avatar skeleton */}
                            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />

                            {/* Name skeleton */}
                            <div className="mt-4 flex flex-col items-center gap-2">
                                <Skeleton className="h-9 w-64" />
                            </div>

                            {/* Role and status badges skeleton */}
                            <div className="flex gap-2 mt-3">
                                <Skeleton className="h-7 w-20 rounded-full" />
                                <Skeleton className="h-7 w-20 rounded-full" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="grid gap-6 md:grid-cols-2 mt-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-40" />
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-32" />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-6 w-48" />
                        </div>

                        {/* User ID */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        {/* Last Login */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-44" />
                        </div>

                        {/* Joined */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-44" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h2 className="text-xl font-semibold">Failed to load profile</h2>
                <p className="text-muted-foreground">Please try logging in again.</p>
            </div>
        );
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "PPP p");
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-3xl mx-auto">
                <CardHeader className="relative pb-10">
                    <div className="absolute left-0 -top-6 w-full h-36 bg-secondary to-secondary rounded-t-xl" />
                    <div className="relative pt-16 flex flex-col items-center group">

                        <div className="relative">
                            <Avatar
                                className={`h-32 w-32 border-4 border-background shadow-lg ${isEditing ? 'cursor-pointer ' : ''}`}
                                onClick={handleAvatarClick}
                            >
                                <AvatarImage src={previewUrl || userData.avatarUrl} alt={userData.displayName} />
                                <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">
                                    {getInitials(userData.firstName, userData.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <div
                                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-primary/90 transition-colors"
                                    onClick={handleAvatarClick}
                                >
                                    <Camera className="h-4 w-4" />
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-md">
                            {isEditing ? (
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <div className="flex gap-2 w-full justify-center">
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="h-10 w-full max-w-[150px] border-current bg-background/50 text-center text-lg font-medium"
                                            placeholder="First Name"
                                        />
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="h-10 w-full max-w-[150px] border-current bg-background/50 text-center text-lg font-medium"
                                            placeholder="Last Name"
                                        />
                                    </div>

                                    <div className="flex gap-2 animate-in fade-in slide-in-from-top-1 absolute right-0 -bottom-10">
                                        <Button size="sm" variant="outline" onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ firstName: userData.firstName, lastName: userData.lastName });
                                            setPreviewUrl(userData.avatarUrl || null);
                                            setSelectedFile(null);
                                        }} disabled={isUpdating}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button className="bg-secondary" size="sm" onClick={handleUpdate} disabled={isUpdating}>
                                            <Save className="h-4 w-4 mr-1" /> {isUpdating ? 'Saving...' : 'Save'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-3xl font-bold text-center">
                                        {userData.displayName || `${userData.firstName} ${userData.lastName}`}
                                    </CardTitle>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-50 hover:opacity-100 transition-opacity" onClick={() => setIsEditing(true)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 mt-3">
                            <p className="text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full text-sm font-medium capitalize">
                                {userData.role}
                            </p>
                            <p className={`text-muted-foreground px-3 py-1 rounded-full text-sm font-medium capitalize ${userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {userData.status.replace('_', ' ')}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 mt-6">
                    <div className="space-y-1">
                        <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <User className="h-4 w-4" /> Full Name
                        </h3>
                        {isEditing ? (
                            <p className="text-lg font-medium text-muted-foreground italic">
                                Editing above...
                            </p>
                        ) : (
                            <p className="text-lg font-medium">
                                {userData.firstName} {userData.lastName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <AtSign className="h-4 w-4" /> Username
                        </h3>
                        <p className="text-lg font-medium">@{userData.username}</p>
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Email Address
                        </h3>
                        <p className="text-lg font-medium">{userData.email}</p>
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Shield className="h-4 w-4" /> User ID
                        </h3>
                        <p className="text-sm font-mono bg-muted p-2 rounded w-fit break-all">
                            {userData.id}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Last Login
                        </h3>
                        <p className="text-sm font-medium">
                            {formatDate(userData.lastLoginAt)}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> Joined
                        </h3>
                        <p className="text-sm font-medium">
                            {formatDate(userData.createdAt)}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
