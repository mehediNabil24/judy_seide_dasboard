// src/features/category/categoryApi.ts
import baseApi from "../baseApi"; // Your baseApi instance

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


  getAllOrders: builder.query({
  query: ({ searchTerm = "", page = 1, limit = 10 }) => ({
    url: "/order/get-all-orders",
    method: "GET",
    params: {
      searchTerm,
      page,
      limit,
      
    },
  }),
  providesTags: ['Orders'],
}),



    //get user order 
    getUserOrders: builder.query({
      query: (id) => ({
        url: `/order/get-user-orders/${id}`,
        method: "GET",
      }),
      providesTags: ['Orders'], 
    }),


    // order deatils api
    getUserOrderDetils: builder.query({
      query: (id) => ({
        url: `/order/my-orders/${id}`,
        method: "GET",
      }),
      providesTags: ['Orders'], 
    }),
    // admin order deatils api 
    getAdminOrderDetils: builder.query({
      query: (id) => ({
        url: `/order/get-order-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ['Orders'], 
    }),





    // Update Category API (PATCH)
    updateOrders: builder.mutation({
      query: ({ id, status }) => ({
        url: `/order/update-order-status/${id}`, // Adjust your actual update endpoint
        method: 'PATCH',
        body: {status},
      }),
      invalidatesTags: ['Orders'], // Invalidate the 'Categories' tag to refetch data
    }),
  }),
  overrideExisting: false,
  
});

export const {

  useGetAllOrdersQuery, // Export the query hook for fetching all orders
  useGetUserOrdersQuery,
  useGetUserOrderDetilsQuery,
  useGetAdminOrderDetilsQuery,
 
  useUpdateOrdersMutation, // Export the update mutation hook
} = orderApi;

export default orderApi;
