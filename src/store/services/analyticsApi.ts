import mainApi from "./mainApi";
import {
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subYears,
  endOfDay,
  startOfDay,
} from "date-fns";

// ─── Date range helper (mirrors DateFilter component options) ─
export type DateRange = { startDate: string; endDate: string; label: string };
export type DatePeriod =
  | "Today"
  | "This Week"
  | "This Month"
  | "Last Month"
  | "This Year"
  | "Last Year";

export function periodToRange(period: DatePeriod): DateRange {
  const now = new Date();
  const fmt = (d: Date) => format(d, "yyyy-MM-dd");
  switch (period) {
    case "Today":
      return {
        startDate: fmt(startOfDay(now)),
        endDate: fmt(endOfDay(now)),
        label: period,
      };
    case "This Week":
      return {
        startDate: fmt(startOfWeek(now)),
        endDate: fmt(endOfDay(now)),
        label: period,
      };
    case "This Month":
      return {
        startDate: fmt(startOfMonth(now)),
        endDate: fmt(endOfDay(now)),
        label: period,
      };
    case "Last Month": {
      const last = subMonths(now, 1);
      return {
        startDate: fmt(startOfMonth(last)),
        endDate: fmt(startOfMonth(now)),
        label: period,
      };
    }
    case "This Year":
      return {
        startDate: fmt(startOfYear(now)),
        endDate: fmt(endOfDay(now)),
        label: period,
      };
    case "Last Year": {
      const last = subYears(now, 1);
      return {
        startDate: fmt(startOfYear(last)),
        endDate: fmt(startOfYear(now)),
        label: period,
      };
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

    getOrderStatusAnalytics: builder.query<
      any,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "orders/analytics-orders-status",
        params: { ...params, isDeleted: false },
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

    getSummaryAnalytics: builder.query<
      any,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss",
        params: params ?? {},
      }),
      providesTags: ["buyers", "orders", "user"],
    }),

    getFinancialOverview: builder.query<
      any,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss/financial-overview",
        params: params ?? {},
      }),
      providesTags: ["accounting"],
    }),

    // ── Chart endpoints ──────────────────────────────────

    /** 12-month revenue vs expense (fixed window, no date filter) */
    getRevenueTrend: builder.query<
      any,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss/revenue-trend",
        params: params ?? {},
      }),
      providesTags: ["accounting"],
    }),

    /** Daily order count — pass startDate/endDate for filtered period */
    getOrderTrend: builder.query<
      any,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss/order-trend",
        params: params ?? {},
      }),
      providesTags: ["orders"],
    }),

    /** Top buyers by revenue — pass startDate/endDate for filtered period */
    getTopBuyers: builder.query<
      any,
      { limit?: number; startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss/top-buyers",
        params: params ?? {},
      }),
      providesTags: ["buyers"],
    }),

    /** AR aging buckets */
    getARaging: builder.query<
      any,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss/ar-aging",
        params: params ?? {},
      }),
      providesTags: ["accounting"],
    }),

    /** AP aging buckets */
    getAPaging: builder.query<
      any,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss/ap-aging",
        params: params ?? {},
      }),
      providesTags: ["accounting"],
    }),

    /** Weekly cash flow: inflow vs outflow */
    getCashFlow: builder.query<
      any,
      { weeks?: number; startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss/cash-flow",
        params: params ?? {},
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
    getDashboardAlerts: builder.query<
      any,
      { startDate?: string; endDate?: string } | void
    >({
      query: (params) => ({
        url: "analyticss/alerts",
        params: params ?? {},
      }),
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
