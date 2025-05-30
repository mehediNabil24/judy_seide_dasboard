// src/features/category/categoryApi.ts
import baseApi from "../baseApi"; // Your baseApi instance

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Category API
    addProduct: builder.mutation({
      query: (formData) => ({
        url: "/products/create-product", // The API endpoint to create a category
        method: "POST",
        body: formData, // Form data to be sent
      }),
      invalidatesTags: ['Products'], 
    }),

    // Get orders Api

    getAllProducts: builder.query({
        query: ({ searchTerm, status, page = 1, limit = 10, sort = "createdAt" }: { searchTerm?: string; status?: string; page?: number; limit?: number; sort?: string }) => {
          const params = new URLSearchParams();
      
          if (searchTerm) params.append("searchTerm", searchTerm);
          if (status) params.append("status", status);
          params.append("page", page.toString());
          params.append("limit", limit.toString());
          params.append("sort", sort); // Added sorting by createdAt
      
          return {
            url: `/products/get-all-products?${params.toString()}`,
            method: "GET",
          };
        },
        providesTags: ['Products'],
      }),


         // Get Single Product API
    getSingleProduct: builder.query({
        query: (id) => ({
          url: `/products/get-product/${id}`,
          method: 'GET',
        }),
        providesTags: ['Products'], // Invalidate the 'Categories' tag to refetch data
      }),



    // Delete Category API
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/category/delete-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'], // Invalidate the 'Categories' tag to refetch data
    }),

    // Update Category API (PATCH)
    updateProduct: builder.mutation({
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
  useAddProductMutation,
  useGetAllProductsQuery, 
  useGetSingleProductQuery,// Export the query hook for fetching all orders
  useDeleteProductMutation,
  useUpdateProductMutation, // Export the update mutation hook
} = productApi;

export default productApi;
