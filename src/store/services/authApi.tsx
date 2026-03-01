import { TOKEN_NAME } from "@/lib/constants";
import { LoginBodyType, LoginPayloadType, RootState } from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND;
const tags = ["self", "users"];

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token =
        state?.auth?.token ||
        Cookies.get("token") ||
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
    login: builder.mutation<LoginPayloadType, LoginBodyType>({
      query: ({ email, password }) => ({
        url: `auth/login`,
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["self"],
    }),

    register: builder.mutation<any, any>({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body,
        formData: true,
      }),
      invalidatesTags: ["self", "users"],
    }),

    getUsers: builder.query<
      any,
      {
        search?: string;
        filters?: any;
        sort?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ search, filters, sort, page, limit } = {}) => ({
        url: `/users`,
        params: {
          ...(search ? { search } : {}),
          ...(filters ? { filters: JSON.stringify(filters) } : {}),
          ...(sort ? { sort } : {}),
          ...(page ? { page } : {}),
          ...(limit ? { limit } : {}),
        },
      }),
      providesTags: ["users"],
    }),

    updateUser: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body,
        formData: true,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation<
      any,
      { id: string; body: { isDeleted: boolean } }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["users"],
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
      invalidatesTags: (_result, _error, { field }) => [field as any, "self"],
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

    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: `auth/forgot-password`,
        method: "POST",
        body,
      }),
    }),
    verifyResetOTP: builder.mutation<any, { email: string; code: string }>({
      query: (body) => ({
        url: `auth/verify-reset-password-OTP`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `auth/reset-password`,
        method: "POST",
        body,
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
  useForgotPasswordMutation,
  useVerifyResetOTPMutation,
  useResetPasswordMutation,
  usePlaceOrderMutation,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  usePatchUpdateSelfMutation,
} = authApi;

export default authApi;
