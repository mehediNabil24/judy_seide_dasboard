// src/features/api/review/reviewApi.ts
import baseApi from "../baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // getService: builder.query({
    //   query: ({ page = 1, limit = 10 }) => ({
    //     url: `/services/get-all-services?page=${page}&limit=${limit}`,
    //     method: "GET",
    //   }),
    // }),

    getAdminStats: builder.query({
      query: () => ({
        url: `/overview/adminStats`,
        method: "GET",
      }),
      providesTags: ['Admin'], // Provide the 'Shop' tag for caching
    }),
   
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {useGetAdminStatsQuery } = adminApi;
export default adminApi;
