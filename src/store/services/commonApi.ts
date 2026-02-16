


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
        sort,
        page = 1,
        limit = BASE_LIMIT,
        search = "",
        isActive,
        filters = {},
        path,
      }) => {
        const params: any = {
          page,
          limit,
          search,
          ...filters,
        };

        // If sort is explicitly null, don't include it.
        // If sort is undefined, use the default '-createdAt'.
        // If sort has a value, use that value.
        if (sort === null) {
          // Do nothing, don't include sort
        } else if (sort === undefined) {
          params.sort = "-createdAt";
        } else {
          params.sort = sort;
        }

        if (isActive !== undefined) params.isActive = isActive;

        return {
          url: path,
          params,
        };
      },
      providesTags: (_result, _error, { path }) => [path],
    }),

    getById: builder.query({
      query: ({ path, id }) => `${path}/${id}`,
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

    patch: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { path, invalidate = [] }) => [
        "filters",
        path,
        ...invalidate,
      ],
    }),

    put: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { path, invalidate = [] }) => [
        "filters",
        path,
        ...invalidate,
      ],
    }),

    deleteOne: builder.mutation({
      query: ({ path, body }) => ({
        url: path,
        method: "DELETE",
        body,
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
  useLazyGetAllQuery,
  usePostMutation,
  usePatchMutation,
  usePutMutation,
  useDeleteOneMutation,
  useGetCountQuery,
  useGetByParentCategoryQuery,
} = userApi;
