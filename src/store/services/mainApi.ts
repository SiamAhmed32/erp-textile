
import { URL } from '@/lib/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


import { RootState } from './types';

const tags = [
	'brand',
	'category',
	'collection',
	'product',
	'user',
	'upload',
	'organization',
	'filters',
	'resource',
	'invoice-terms',
	'orders',
	'company-profiles',
	'buyers',
	'invoices'
];

export const mainApi = createApi({
	reducerPath: 'mainApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${URL.api}`,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			const token = state.auth?.token || process.env.NEXT_PUBLIC_TOKEN;

			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}
		},
	}),
	tagTypes: tags,
	endpoints: () => ({}),
});

export default mainApi;
