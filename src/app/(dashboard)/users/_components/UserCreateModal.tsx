"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRegisterMutation } from "@/store/services/authApi";
import { UserCreateInput } from "./types";
import {
    CustomModal,
    InputField,
} from "@/components/reusables";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UserCreateModal = ({ open, onOpenChange }: Props) => {
    const [formData, setFormData] = useState<Omit<UserCreateInput, "avatar">>({
        email: "",
        username: "",
        firstName: "",
        lastName: "",
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [register, { isLoading }] = useRegisterMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("email", formData.email);
            data.append("username", formData.username);
            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            if (avatar) {
                data.append("avatar", avatar);
            }

            await register(data).unwrap();
            toast.success("User created successfully");
            onOpenChange(false);
            resetForm();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create user");
        }
    };

    const resetForm = () => {
        setFormData({
            email: "",
            username: "",
            firstName: "",
            lastName: "",
        });
        setAvatar(null);
        setPreviewUrl(null);
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val);
                if (!val) resetForm();
            }}
            title="Create New User"
            width="90vw"
            maxWidth="800px"
        >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Inputs */}
                <div className="space-y-1">
                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahim@gmail.com"
                        required
                    />
                    <InputField
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="rahim123"
                        required
                    />
                    <InputField
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Abdur"
                        required
                    />
                    <InputField
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Rahman"
                        required
                    />
                </div>

                {/* Right Side: Avatar Upload */}
                <div className="flex flex-col items-center justify-center space-y-4 border-l pl-6 border-border/50">
                    <div className="relative group">
                        <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-primary/30 group-hover:border-primary/60 transition-colors">
                            {previewUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <div className="mx-auto h-12 w-12 text-muted-foreground/60">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Upload Avatar</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 cursor-pointer rounded-full"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={() => document.getElementById("avatar-upload")?.click()}
                    >
                        Select Image
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">
                        Recommended: Square image, max 2MB
                    </p>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="px-8 bg-secondary hover:bg-secondary/90 text-white">
                        {isLoading ? "Creating..." : "Create User"}
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
};

export default UserCreateModal;
