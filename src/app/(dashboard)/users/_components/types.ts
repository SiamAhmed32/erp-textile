export type User = {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type UserCreateInput = {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string | File | null;
};
