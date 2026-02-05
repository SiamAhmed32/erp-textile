


import { BASE_LIMIT } from "@/lib/constants";
import mainApi from "./mainApi";

export const userApi = mainApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCount: builder.query({
      query: ({ path, filters = {} }: { path: string; filters: object }) => ({
        url: `${path}/get/count`,
        params: { ...filters },
      }),
      providesTags: (_result, _error, { path }) => [path],
    }),

    getAll: builder.query({
      query: ({
        sort = "-createdAt",
        page = 1,
        limit = BASE_LIMIT,
        search = "",
        isActive,
        filters = {},
        path,
      }) => ({
        url: path,
        params: { sort, page, limit, search, isActive, ...filters },
      }),
      providesTags: (_result, _error, { path }) => [path],
    }),

		getById: builder.query({
			query: ({ path, id, invalidate = [] }) =>
				`${path}/${id}?invalidate=${invalidate}`,
			providesTags: (_result, _error, { path, invalidate = [] }) => [
				path,
				...invalidate,
			],
		}),

		getByParentCategory: builder.query({
			query: ({ path, parentCategoryId }) =>
				`${path}?parentCategory=${parentCategoryId}`,
			providesTags: (_result, _error, { path }) => [path],
		}),
   
    getByIdLazy: builder.query({
      query: ({ path, id }) => `${path}/${id}`,
      providesTags: (_result, _error, { path }) => [path],
    }),

    post: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "POST",
        body: body,
      }),
      invalidatesTags: (_result, _error, { path, invalidate = [] }) => [
        "filters",
        path,
        ...invalidate,
      ],
    }),
  }),
});

export const {
  useGetByIdQuery,
  useGetAllQuery,
  useLazyGetByIdQuery,
  usePostMutation,
  useGetCountQuery, useGetByParentCategoryQuery,
} = userApi;
