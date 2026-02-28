


import { BASE_LIMIT } from "@/lib/constants";
import mainApi from "./mainApi";

// Helper to strip UUIDs from paths to use as safe Redux tags
const sanitizeTag = (path: string) => {
  return path
    .split("/")
    .filter((segment) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment))
    .join("/");
};

export const userApi = mainApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCount: builder.query({
      query: ({ path, filters = {} }: { path: string; filters: object }) => ({
        url: `${path}/get/count`,
        params: { ...filters },
      }),
      providesTags: (_result, _error, { path }) => [sanitizeTag(path)],
    }),

    getAll: builder.query({
      query: ({
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

        if (isActive !== undefined) params.isActive = isActive;

        return {
          url: path,
          params,
        };
      },
      providesTags: (_result, _error, { path }) => [sanitizeTag(path)],
    }),

    getById: builder.query({
      query: ({ path, id }) => `${path}/${id}`,
      providesTags: (_result, _error, { path, invalidate = [] }) => {
        return [sanitizeTag(path), ...invalidate];
      },
    }),

    getByParentCategory: builder.query({
      query: ({ path, parentCategoryId }) =>
        `${path}?parentCategory=${parentCategoryId}`,
      providesTags: (_result, _error, { path }) => [sanitizeTag(path)],
    }),

    post: builder.mutation({
      query: ({ path, body, formData }) => ({
        url: path,
        method: "POST",
        body: body,
        formData,
      }),
      invalidatesTags: (_result, _error, { path, invalidate = [] }) => {
        return ["filters", sanitizeTag(path), ...invalidate];
      },
    }),

    patch: builder.mutation({
      query: ({ path, body, formData }) => ({
        url: path,
        method: "PATCH",
        body,
        formData,
      }),
      invalidatesTags: (_result, _error, { path, invalidate = [] }) => {
        return ["filters", sanitizeTag(path), ...invalidate];
      },
    }),

    put: builder.mutation({
      query: ({ path, body, formData }) => ({
        url: path,
        method: "PUT",
        body,
        formData,
      }),
      invalidatesTags: (_result, _error, { path, invalidate = [] }) => {
        return ["filters", sanitizeTag(path), ...invalidate];
      },
    }),

    deleteOne: builder.mutation({
      query: ({ path, body, formData }) => ({
        url: path,
        method: "DELETE",
        body,
        formData,
      }),
      invalidatesTags: (_result, _error, { path, invalidate = [] }) => {
        return ["filters", sanitizeTag(path), ...invalidate];
      },
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
