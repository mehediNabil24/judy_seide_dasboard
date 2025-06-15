// src/features/category/categoryApi.ts
import baseApi from "../baseApi"; // Your baseApi instance

const CustomerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add 
 

    // Get All
    getAllCustomers: builder.query({
      query: () => ({
        url: "/order/get-all-customers",
        method: "GET",
      }),
      providesTags: ['Customers'], 
    }),



    // Get single  Customer API (PATCH)
    getSingleCustomer: builder.query({
      query: ({ id }) => ({
        url: `/order/get-user-orders/${id}`, // Adjust your actual update endpoint
        method: 'GET',
      
      }),
      providesTags: ['Customers'], // Invalidate the 'Categories' tag to refetch data
    }),

    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/category/delete-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customers'], // Invalidate the 'Categories' tag to refetch data
    }),

  }),
  overrideExisting: false,
  
});

export const {
    useGetAllCustomersQuery, useDeleteCustomerMutation
    
 // Export the update mutation hook
} = CustomerApi;

export default CustomerApi;
