// src/features/category/categoryApi.ts
import baseApi from "../baseApi"; // Your baseApi instance

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
  
   

    // Get All
    getProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ['Profile'], 
    }),

   

    // Update Category API (PATCH)
    updateProfile: builder.mutation({
      query: (body) => ({
        url: `/user/update-profile/`, // Adjust your actual update endpoint
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Profile'], // Invalidate the 'Categories' tag to refetch data
    }),
  }),
  overrideExisting: false,
  
});

export const {
   useGetProfileQuery,
   useUpdateProfileMutation

 // Export the update mutation hook
} = profileApi;

export default profileApi;
