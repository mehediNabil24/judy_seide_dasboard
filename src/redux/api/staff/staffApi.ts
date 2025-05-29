
import baseApi from "../baseApi"; // Your baseApi instance

const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Staff API
    addStaff: builder.mutation({
      query: (formData) => ({
        url: "/staff/create", 
        method: "POST",
        body: formData, 
      }),
      invalidatesTags: ['Staff'], // Invalidate the 'Staff' tag to refetch data
    }),

    // Get All Staff API by businessman
    getStaff: builder.query({
      query: () => ({
        url: "/staff/allstaf",
        method: "GET",
      }),
      providesTags: ['Staff'], // Provide the 'Staff' tag for caching
    }),





    // Delete Staff API
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/staff/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff'], // Invalidate the 'Staff' tag to refetch data
    }),

    // Update Service API (PATCH)
    updateService: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/services/update-service/${id}`, 
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Staff'], // Invalidate the 'Staff' tag to refetch data
    }),
  }),
  overrideExisting: false,
  
});

export const {
 useAddStaffMutation,
  useGetStaffQuery,
  useDeleteStaffMutation, 
} = staffApi;

export default staffApi;
