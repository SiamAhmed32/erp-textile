import { TOKEN_NAME } from "@/lib/constants";
import { LoginBodyType, LoginPayloadType, RootState } from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND;
const tags = ["self"];
import Cookies from 'js-cookie';
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token =
        state?.auth?.token ||
        Cookies.get("token") || // ✅ js-cookie দিয়ে সহজে পাবেন
        (typeof window !== "undefined"
          ? localStorage.getItem(TOKEN_NAME)
          : null);
      if (token) {
        headers.set("Authorization", `${token}`);
      }
    },
  }),
  tagTypes: tags,
  endpoints: (builder) => ({
    // ✅ login matches old file (auth/login)
    login: builder.mutation<LoginPayloadType, LoginBodyType>({
      query: ({ email, password }) => ({
        url: `auth/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["self"],
    }),

    // ✅ register matches old file (auth/register)
    register: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body,
        formData: true,
      }),
      invalidatesTags: ["self", "users" as any],
    }),

    getUsers: builder.query<any, { search?: string }>({
      query: ({ search } = {}) => ({
        url: `/users`,
        params: search ? { search } : undefined,
      }),
      providesTags: ["users" as any],
    }),

    updateUser: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["users" as any],
    }),

    updatePassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `auth/change-password`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["self"],
    }),
    getSelf: builder.query<any, any>({
      query: () => ({
        url: `user-api/auth/self`,
      }),
      providesTags: ["self"],
    }),
    getMyOrders: builder.query<any, any>({
      query: () => ({
        url: `/user-api/orders`,
      }),
      providesTags: ["self"],
    }),
    getSingleOrder: builder.query<any, string>({
      query: (orderId) => ({
        url: `/user-api/orders/${orderId}`,
      }),
      providesTags: ["self"],
    }),
    updateSelf: builder.mutation<any, any>({
      query: (body) => ({
        url: `/user-api/auth/self`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["self"],
    }),
    placeOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: `auth/order`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["self"],
    }),
    updatePreferences: builder.mutation<any, any>({
      query: ({ field, preferences }) => ({
        url: `auth/update/preferences`,
        method: "PUT",
        body: { field, preferences },
      }),
      invalidatesTags: (result, error, { field }) => [field, "self"],
    }),

    requestPasswordChange: builder.mutation({
      query: ({ email }) => ({
        url: `auth/request-password-change`, // ✅ unchanged
        method: "POST",
        body: { email },
      }),
    }),
    patchUpdateSelf: builder.mutation<any, any>({
      query: (body) => ({
        url: `/users/update-profile`,
        method: "PATCH",
        body,
        formData: true,
      }),
      invalidatesTags: ["self"],
    }),
    verifyToken: builder.query({
      query: ({ token }) => ({
        url: `auth/verify-reset-token/${token}`, // ✅ unchanged
        method: "GET",
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `auth/reset`, // ✅ unchanged
        method: "POST",
        body: { token, password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetSelfQuery,
  useUpdatePreferencesMutation,
  useRegisterMutation,
  useUpdatePasswordMutation,
  useUpdateSelfMutation,
  useRequestPasswordChangeMutation,
  useVerifyTokenQuery,
  useResetPasswordMutation,
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  usePatchUpdateSelfMutation,
} = authApi;

export default authApi;
