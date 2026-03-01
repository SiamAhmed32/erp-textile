import mainApi from "./mainApi";

export const financialReportApi = mainApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getTrialBalance: builder.query({
            query: ({ startDate, endDate }) => ({
                url: "financial-reports/trial-balance",
                params: { startDate, endDate },
            }),
            providesTags: ["AccountHead", "JournalEntry"],
        }),

        generateFinancialReport: builder.query({
            query: ({ startDate, endDate }) => ({
                url: "financial-reports/generate-report",
                params: { startDate, endDate },
            }),
        }),
    }),
});

export const {
    useGetTrialBalanceQuery,
    useLazyGenerateFinancialReportQuery,
} = financialReportApi;
