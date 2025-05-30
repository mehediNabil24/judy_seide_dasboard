// src/features/category/categoryApi.ts
import baseApi from "../baseApi"; // Your baseApi instance

const materialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add 
    addMaterial: builder.mutation({
      query: (formData) => ({
        url: "/materials/create-material", 
        method: "POST",
        body: formData, 
      }),
      invalidatesTags: ['Materials'], 
    }),

    // Get All
    getAllMaterials: builder.query({
      query: () => ({
        url: "/materials/get-all-materials",
        method: "GET",
      }),
      providesTags: ['Materials'], 
    }),

    // Delete Category API
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/delete-category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'], 
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
    useAddMaterialMutation,
    useGetAllMaterialsQuery

 // Export the update mutation hook
} = materialApi;

export default materialApi;
