export type User = {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role?: string;
    designation?: string;
    modules?: string[];
    createdAt?: string;
    updatedAt?: string;
};

export type UserCreateInput = {
    email: string;
    username: string;
    password?: string;
    role: "admin" | "user";
    firstName: string;
    lastName: string;
    designation: string;
    modules: string[];
    avatar?: string | File | null;
};
