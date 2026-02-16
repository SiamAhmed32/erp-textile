
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
	'buyers'
];

export const mainApi = createApi({
	reducerPath: 'mainApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${URL.api}`,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			const token = state.auth?.token || process.env.NEXT_PUBLIC_TOKEN;

			if (token) {
				// headers.set('Authorization', `Bearer ${token}`);
				// TODO: Remove this
				headers.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1YTNlZDFjLWRlYWMtNGUzZi1iZTE0LWQzMWNmZTBjZTBiYiIsImVtYWlsIjoiYWx0YWoxMDE5MTFAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzEyMzM5MDV9.UybvBr5PL-T45MsTOukyZsjKN0P4ujENOekmAl9J5BU`);
			}
		},
	}),
	tagTypes: tags,
	endpoints: () => ({}),
});

export default mainApi;
