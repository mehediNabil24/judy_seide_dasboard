
import baseApi from "../baseApi"; // Your baseApi instance

const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add Services API
    addService: builder.mutation({
      query: (formData) => ({
        url: "/services/create-service", 
        method: "POST",
        body: formData, 
      }),
      invalidatesTags: ['Services'], // Invalidate the 'Services' tag to refetch data
    }),

    // Get All Services API
    getServices: builder.query({
      query: () => ({
        url: "/services/get-all-services",
        method: "GET",
      }),
      providesTags: ['Services'], // Provide the 'Services' tag for caching
    }),

    // get service by shopId
    getServiceShop: builder.query({
      query: (id) => ({
        url: `/services/get-services/${id}`,
        method: "GET",
      }),
      providesTags: ['Services'], // Provide the 'Services' tag for caching
    }),

    // Delete Service API
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/delete-service/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'], // Invalidate the 'Services' tag to refetch data
    }),

    // Update Service API (PATCH)
    updateService: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/services/update-service/${id}`, 
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Services'], // Invalidate the 'Services' tag to refetch data
    }),
  }),
  overrideExisting: false,
  
});

export const {
 useAddServiceMutation,
 useGetServiceShopQuery,
  useGetServicesQuery,
  useDeleteServiceMutation,
  useUpdateServiceMutation, 
} = serviceApi;

export default serviceApi;
