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
      invalidatesTags: ["Products"],
    }),

    // Get orders Api

    getAllProducts: builder.query({
      query: ({ searchTerm, page, limit }) => ({
        url: "/products/get-all-products/admin",
        method: "GET",
        params: {
          searchTerm,
          page: String(page), // Ensure page is a string
          limit: String(limit), // Ensure limit is a string
        },
      }),
      providesTags: ["Products"],
    }),

    //
    //
    // getAllOrders: builder.query({
    //   query: ({ searchTerm, page, limit }) => ({
    //     url: "/order/get-all-orders",
    //     method: "GET",
    //     params: {
    //       searchTerm,
    //       page: String(page), // Ensure page is a string
    //       limit: String(limit), // Ensure limit is a string
    //     },
    //   }),
    //   providesTags: ["Orders"],
    // }),

    // Get Single Product API
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/get-product/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"], // Invalidate the 'Categories' tag to refetch data
    }),

    // Delete Category API
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/delete-product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"], // Invalidate the 'Categories' tag to refetch data
    }),

    // Update Category API (PATCH)
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/update-product/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery, // Export the query hook for fetching all orders
  useDeleteProductMutation,
  useUpdateProductMutation, // Export the update mutation hook
} = productApi;

export default productApi;
