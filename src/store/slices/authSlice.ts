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
 */

import Cookies from 'js-cookie';
import { decryptData, encryptData } from '@/lib/encryption';
import { REFRESH_TOKEN, TOKEN_NAME } from '@/lib/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthStateType = {
	token: string | null;
	loggedIn: boolean;
	user: any | null;
};

type LoginPayloadType = {
	token: string;
	user: any;
	refreshToken?: string;
};

// Define the initial state
const initialState: AuthStateType = {
	token: Cookies.get('token') || null,
	loggedIn: !!Cookies.get('token'),
	user:
		typeof window !== 'undefined' && localStorage.getItem("user") != null
			? decryptData(localStorage.getItem("user"))
			: null,
};
export const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		logout: (state): void => {
			localStorage.setItem(TOKEN_NAME, 'null');
			Cookies.remove("token");
			localStorage.setItem(REFRESH_TOKEN, 'null');
			localStorage.removeItem('user');

			state.token = null;
			state.loggedIn = false;
			state.user = null;
			// window.location.reload();
			void (document.location.href = '/login');
		},
		login: (state, action: PayloadAction<LoginPayloadType>): void => {
			const { token, user }: LoginPayloadType = action.payload;
			state.token = token;
			state.user = user;
			state.loggedIn = true;
			localStorage.setItem(TOKEN_NAME, token);
			const encryptedUser = encryptData(user);
			if (encryptedUser) {
				localStorage.setItem("user", encryptedUser);
			}
			// localStorage.setItem(REFRESH_TOKEN, refreshToken);
			// window.location.reload();
			void (document.location.href = '/');
		},
		refresh: (state, action: PayloadAction<string>): void => {
			localStorage.setItem(TOKEN_NAME, action.payload);
			state.token = action.payload;
			state.loggedIn = true;
		},
		updateUser: (state, action: PayloadAction<any>): void => {
			state.user = action.payload;
			const encryptedUser = encryptData(action.payload);
			if (encryptedUser) {
				localStorage.setItem("user", encryptedUser);
			}
		},
	},
});

export const { login, logout, refresh: refreshAuth, updateUser } = authSlice.actions;

export default authSlice.reducer;
