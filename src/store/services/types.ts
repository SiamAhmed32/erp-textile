export type LoginPayloadType = {
	data: {
		user: any;
		token: string;
		refreshToken?: string;
	}
};

export type LoginBodyType = {
	email: string;
	password: string;
};

export interface AuthState {
	token: string | null;
	loggedIn: boolean;
}

export interface RootState {
	auth: AuthState;
	cart?: any;
	wishlist?: any;
}

