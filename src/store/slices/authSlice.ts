/**
 * EXAMPLE: Authentication Slice
 * 
 * This is an example implementation of authentication state management.
 * Modify this to match your authentication requirements (JWT, OAuth, etc.)
 * 
 * Features:
 * - Token-based authentication
 * - Login/logout functionality
 * - Persistent storage via localStorage
 * - Token refresh capability
 */

import { REFRESH_TOKEN, TOKEN_NAME } from '@/lib/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthStateType = {
	token: string | null;
	loggedIn: boolean;
};

type LoginPayloadType = {
	token: string;
	refreshToken?: string;
};

// Define the initial state
const initialState: AuthStateType = {
	token:
		typeof window !== 'undefined' && localStorage.getItem(TOKEN_NAME) != null
			? localStorage.getItem(TOKEN_NAME)
			: null,
	loggedIn:
		typeof window !== 'undefined' && localStorage.getItem(TOKEN_NAME) !== null,
};
export const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		logout: (state): void => {
			localStorage.setItem(TOKEN_NAME, 'null');
			localStorage.setItem(REFRESH_TOKEN, 'null');
			state.token = null;
			state.loggedIn = false;
			// window.location.reload();
			void (document.location.href = '/auth/login');
		},
		login: (state, action: PayloadAction<LoginPayloadType>): void => {
			const { token }: LoginPayloadType = action.payload;
			state.token = token;
			state.loggedIn = true;
			localStorage.setItem(TOKEN_NAME, token);
			// localStorage.setItem(REFRESH_TOKEN, refreshToken);
			// window.location.reload();
			void (document.location.href = '/');
		},
		refresh: (state, action: PayloadAction<string>): void => {
			localStorage.setItem(TOKEN_NAME, action.payload);
			state.token = action.payload;
			state.loggedIn = true;
		},
	},
});

export const { login, logout, refresh: refreshAuth } = authSlice.actions;

export default authSlice.reducer;
