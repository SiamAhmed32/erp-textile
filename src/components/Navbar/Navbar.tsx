"use client";
import { decryptData } from "@/lib/encryption";
import React, { useEffect, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";

interface User {
	name: string;
	firstName: string;
	lastName: string;
	email: string;
	avatarUrl?: string;
	role?: string;
}

const Navbar = () => {
	// @ts-ignore
	const user = useSelector((state: any) => state.auth.user);
	const dispatch = useDispatch();
	const router = useRouter();

	const handleLogout = () => {
		dispatch(logout());
		router.push("/login");
	};

	if (!user) {
		return null; // Or return a login button/placeholder
	}

	// Get initials for avatar fallback
	const getInitials = (name: string) => {
		return name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="flex items-center justify-end px-4 py-2">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-10 w-auto rounded-full flex items-center gap-2 px-2"
					>
						<span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
						<Avatar className="h-8 w-8 border-2 border-primary/10">
							<AvatarImage src={user?.avatarUrl} alt={user?.name} />
							<AvatarFallback className="bg-primary/5 text-primary font-medium">
								{getInitials(user?.firstName || "User")}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user?.email}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer" asChild>
						<Link href="/profile" className="flex items-center w-full">
							<UserIcon className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
						onClick={handleLogout}
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default Navbar;
