// src/features/api/review/reviewApi.ts
import baseApi from "../baseApi";

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // getService: builder.query({
    //   query: ({ page = 1, limit = 10 }) => ({
    //     url: `/services/get-all-services?page=${page}&limit=${limit}`,
    //     method: "GET",
    //   }),
    // }),

    getShopFeedback: builder.query({
      query: (id) => ({
        url: `/feedbacks/get-feedbacks/shop/${id}`,
        method: "GET",
      }),
      providesTags: ['Feedback'], // Provide the 'Shop' tag for caching
    }),
   
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {useGetShopFeedbackQuery } = feedbackApi;
export default feedbackApi;
