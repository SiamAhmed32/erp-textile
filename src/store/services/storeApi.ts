// import { BASE_LIMIT } from '../constants';
import mainApi from './mainApi';

export const storeApi = mainApi.injectEndpoints({
	overrideExisting: true,
	endpoints: builder => ({
		getStore: builder.query({
			query: () => ({
				url: `/store/mango`,
			}),

			// providesTags: (_result, _error, { path }) => [path],
		}),
		getAllStore: builder.query({
			query: () => ({
				url: `/store/mango`,
			}),
		}),
		getSingleProduct: builder.query({
			query: ({ id }) => ({
				url: `/products/${id}`,
			}),
			// providesTags: (_result, _error, { path }) => [path],
		}),
	}),
});

export const {
	useGetStoreQuery,
	useGetAllStoreQuery,
	useGetSingleProductQuery,
} = storeApi;
