import mainApi from "./mainApi";

export const analyticsApi = mainApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getBuyerAnalytics: builder.query({
            query: ({ startDate, endDate }) => ({
                url: "buyers/analytics",
                params: { startDate, endDate },
            }),
            providesTags: ["buyers"],
        }),

        getOrderAnalytics: builder.query({
            query: ({ startDate, endDate }) => ({
                url: "orders/analytics",
                params: { startDate, endDate },
            }),
            providesTags: ["orders"],
        }),

        getUserAnalytics: builder.query({
            query: ({ startDate, endDate }) => ({
                url: "users/analytics",
                params: { startDate, endDate },
            }),
            providesTags: ["user"],
        }),
    }),
});

export const {
    useGetBuyerAnalyticsQuery,
    useGetOrderAnalyticsQuery,
    useGetUserAnalyticsQuery,
} = analyticsApi;
