// src/features/category/categoryApi.ts
import baseApi from "../baseApi"; // Your baseApi instance

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getAllOrders: builder.query({
      query: () => ({
        url: "/order/get-all-orders",
        method: "GET",
      }),
      providesTags: ['Orders'], 
    }),




    // Update Category API (PATCH)
    updateOrders: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/order/update-order-status/${id}`, // Adjust your actual update endpoint
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Orders'], // Invalidate the 'Categories' tag to refetch data
    }),
  }),
  overrideExisting: false,
  
});

export const {

  useGetAllOrdersQuery, // Export the query hook for fetching all orders
 
  useUpdateOrdersMutation, // Export the update mutation hook
} = orderApi;

export default orderApi;
