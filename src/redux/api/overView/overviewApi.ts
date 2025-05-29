// src/features/api/review/reviewApi.ts
import baseApi from "../baseApi";

export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getMetricStats: builder.query({
      query: () => ({
        url: `/overview/get-overview`,
        method: "GET",
      }),
      providesTags: ['Overview'], 
    }),

    // Get Upcoming Services
    getChartData: builder.query({
      query: () => ({
        url: `/overview/get-weekly-sales`,
        method: "GET",
      }),
      providesTags: ['Overview'], 
    }),

    // Get best Sales 
    getBestSelling: builder.query({
      query: () => ({
        url: `/overview/get-weekly-overview`,
        method: "GET",
      }),
      providesTags: ['Overview'], 
    }),
   
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {useGetMetricStatsQuery,useGetChartDataQuery, useGetBestSellingQuery } = overviewApi;
export default overviewApi;
