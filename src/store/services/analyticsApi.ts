import mainApi from "./mainApi";
import { format, startOfMonth, startOfWeek, startOfYear, subMonths, subYears, endOfDay, startOfDay } from "date-fns";

// ─── Date range helper (mirrors DateFilter component options) ─
export type DateRange = { startDate: string; endDate: string; label: string };
export type DatePeriod = "Today" | "This Week" | "This Month" | "Last Month" | "This Year" | "Last Year";

export function periodToRange(period: DatePeriod): DateRange {
    const now = new Date();
    const fmt = (d: Date) => format(d, "yyyy-MM-dd");
    switch (period) {
        case "Today":
            return { startDate: fmt(startOfDay(now)), endDate: fmt(endOfDay(now)), label: period };
        case "This Week":
            return { startDate: fmt(startOfWeek(now)), endDate: fmt(endOfDay(now)), label: period };
        case "This Month":
            return { startDate: fmt(startOfMonth(now)), endDate: fmt(endOfDay(now)), label: period };
        case "Last Month": {
            const last = subMonths(now, 1);
            return { startDate: fmt(startOfMonth(last)), endDate: fmt(startOfMonth(now)), label: period };
        }
        case "This Year":
            return { startDate: fmt(startOfYear(now)), endDate: fmt(endOfDay(now)), label: period };
        case "Last Year": {
            const last = subYears(now, 1);
            return { startDate: fmt(startOfYear(last)), endDate: fmt(startOfYear(now)), label: period };
        }
    }
}

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

        getOrderStatusAnalytics: builder.query({
            query: () => ({
                url: "orders/analytics-orders-status",
                params: { isDeleted: false },
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

        getSummaryAnalytics: builder.query({
            query: () => ({ url: "analyticss" }),
            providesTags: ["buyers", "orders", "user"],
        }),

        getFinancialOverview: builder.query({
            query: () => ({ url: "analyticss/financial-overview" }),
            providesTags: ["accounting"],
        }),

        // ── Chart endpoints ──────────────────────────────────

        /** 12-month revenue vs expense (fixed window, no date filter) */
        getRevenueTrend: builder.query({
            query: () => ({ url: "analyticss/revenue-trend" }),
            providesTags: ["accounting"],
        }),

        /** Daily order count — pass startDate/endDate for filtered period */
        getOrderTrend: builder.query<any, { startDate?: string; endDate?: string } | void>({
            query: (params) => ({
                url: "analyticss/order-trend",
                params: params ?? {},
            }),
            providesTags: ["orders"],
        }),

        /** Top buyers by revenue — pass startDate/endDate for filtered period */
        getTopBuyers: builder.query<any, { limit?: number; startDate?: string; endDate?: string } | void>({
            query: (params) => ({
                url: "analyticss/top-buyers",
                params: params ?? {},
            }),
            providesTags: ["buyers"],
        }),

        /** AR aging buckets */
        getARaging: builder.query({
            query: () => ({ url: "analyticss/ar-aging" }),
            providesTags: ["accounting"],
        }),

        /** AP aging buckets */
        getAPaging: builder.query({
            query: () => ({ url: "analyticss/ap-aging" }),
            providesTags: ["accounting"],
        }),

        /** Weekly cash flow: inflow vs outflow */
        getCashFlow: builder.query({
            query: (weeks?: number) => ({
                url: "analyticss/cash-flow",
                params: weeks ? { weeks } : {},
            }),
            providesTags: ["accounting"],
        }),

        /** Weekly accounts payable flow to suppliers */
        getPayableFlow: builder.query({
            query: (weeks?: number) => ({
                url: "analyticss/payable-flow",
                params: weeks ? { weeks } : {},
            }),
            providesTags: ["accounting"],
        }),

        /** Dashboard alerts: pending orders, overdue AR */
        getDashboardAlerts: builder.query({
            query: () => ({ url: "analyticss/alerts" }),
            providesTags: ["accounting", "orders"],
        }),
    }),
});

export const {
    useGetBuyerAnalyticsQuery,
    useGetOrderAnalyticsQuery,
    useGetOrderStatusAnalyticsQuery,
    useGetUserAnalyticsQuery,
    useGetSummaryAnalyticsQuery,
    useGetFinancialOverviewQuery,
    useGetRevenueTrendQuery,
    useGetOrderTrendQuery,
    useGetTopBuyersQuery,
    useGetARagingQuery,
    useGetAPagingQuery,
    useGetCashFlowQuery,
    useGetPayableFlowQuery,
    useGetDashboardAlertsQuery,
} = analyticsApi;
