
import Cookies from 'js-cookie';
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
	'invoices',
	'lc-managements',
	'suppliers',
	'accounting',
	'accounting/accountHeads',
	'accounting/ledger/supplier',
	'accounting/ledger/buyer',
	'accounting/ledger/suppliers/balances',
	'accounting/ledger/buyers/balances',
	'accounting/ledger/stats',
	'accounting/ledger/audit-trail',
	'accounting/receipts',
	'accounting/payments',
	'accounting/banks',
	'accounting/loans',
	'accounting/loans/repayments',
	'accounting/journal-entries',
];

export const mainApi = createApi({
	reducerPath: 'mainApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `${URL.api}`,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			const token = state.auth?.token || Cookies.get('token');

			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}
		},
	}),
	tagTypes: tags,
	endpoints: () => ({}),
});

export default mainApi;
