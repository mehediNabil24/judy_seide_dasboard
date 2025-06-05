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

    addReview: builder.mutation({
      query: (formData) => ({
        url: "/review/create-review",  // API endpoint for creating a shop
        method: "POST",
        body: formData,  
      }),
      invalidatesTags: ['Feedback'], // Invalidate the 'Booking' tag to refetch data
      
    }),

    getAdminFeedback: builder.query({
      query: () => ({
        url: `/review/get-all-reviews/admin`,
        method: "GET",
      }),
      providesTags: ['Feedback'], // Provide the 'Shop' tag for caching
    }),

    updateReview: builder.mutation({
      query: ({ id, isPublished }) => ({
        url: `/review/update-review/${id}`, // Adjust your actual update endpoint
        method: 'PATCH',
        body:{isPublished},
      }),
      invalidatesTags: ['Feedback'], // Invalidate the 'Categories' tag to refetch data
    }),


    
   
  }),
  overrideExisting: false,
});




// Export hooks for usage in functional components
export const {useGetAdminFeedbackQuery, useUpdateReviewMutation,useAddReviewMutation } = feedbackApi;
export default feedbackApi;
