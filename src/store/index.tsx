import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authSlice } from './slices/authSlice';
import {} from './constants';
import mainApi from './services/mainApi';
import { cartSlice } from './slices/cartSlice';
import { tableSlice } from './slices/tableSlice';
import guestMainApi from './services/guestMainApi';
import { wishlistSlice } from './slices/wishlistSlice';
import authApi from './services/authApi';
import buyNowSlice from './slices/buyNowSlice';
import { TOKEN_NAME } from './constants';

// import { routeSlice, tableSlice, cartSlice, authSlice } from '@/components/library/store';

export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		// route: routeSlice.reducer,
		table: tableSlice.reducer,
		cart: cartSlice.reducer,
		wishlist: wishlistSlice.reducer,
		buyNow: buyNowSlice,

		[mainApi.reducerPath]: mainApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[guestMainApi.reducerPath]: guestMainApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(mainApi.middleware)
			.concat(authApi.middleware)
			.concat(guestMainApi.middleware),
});

store.subscribe(() => {
	const state = store.getState();
	if (typeof window !== 'undefined') {
		if (state.auth.token) {
			localStorage.setItem(TOKEN_NAME, state.auth.token);
		} else {
			localStorage.removeItem(TOKEN_NAME);
		}
	}
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
