// src/features/category/categoryApi.ts
import baseApi from "../baseApi"; // Your baseApi instance

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Category API
    addOrder: builder.mutation({
      query: (formData) => ({
        url: "/category/create-category", // The API endpoint to create a category
        method: "POST",
        body: formData, // Form data to be sent
      }),
      invalidatesTags: ['Orders'], 
    }),

    // Get orders Api

    getAllOrders: builder.query({
        query: ({ searchTerm, status, page = 1, limit = 10, sort = "createdAt" }: { searchTerm?: string; status?: string; page?: number; limit?: number; sort?: string }) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("searchTerm", searchTerm);
          if (status) params.append("status", status);
          params.append("page", page.toString());
          params.append("limit", limit.toString());
          params.append("sort", sort); // Added sorting by createdAt
      
          return {
            url: `/order/get-all-orders?${params.toString()}`,
            method: "GET",
          };
        },
        providesTags: ['Orders'],
      }),



    // Delete Category API
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/delete-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'], // Invalidate the 'Categories' tag to refetch data
    }),

    // Update Category API (PATCH)
    updateCategory: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/category/update-category/${id}`, // Adjust your actual update endpoint
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Categories'], // Invalidate the 'Categories' tag to refetch data
    }),
  }),
  overrideExisting: false,
  
});

export const {
  useAddOrderMutation,
  useGetAllOrdersQuery, // Export the query hook for fetching all orders
  useDeleteCategoryMutation,
  useUpdateCategoryMutation, // Export the update mutation hook
} = orderApi;

export default orderApi;
