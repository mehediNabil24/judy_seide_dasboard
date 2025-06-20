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
    deleteMaterial: builder.mutation({
      query: (id) => ({
        url: `/materials/delete-material/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Materials'], 
    }),

    // Update Category API (PATCH)
   updateMaterial: builder.mutation({
  query: ({ id, materialName }) => ({
    url: `/materials/update-material/${id}`,
    method: 'PATCH',
    body: { materialName },
  }),
  invalidatesTags: ['Materials'],
}),

  }),
  overrideExisting: false,
  
});

export const {
    useAddMaterialMutation,
    useGetAllMaterialsQuery,
    useDeleteMaterialMutation,
    useUpdateMaterialMutation

 // Export the update mutation hook
} = materialApi;

export default materialApi;
