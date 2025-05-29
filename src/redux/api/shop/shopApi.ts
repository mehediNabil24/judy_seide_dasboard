// src/features/shop/shopApi.ts
import Cookies from 'js-cookie';  // Importing the js-cookie module
import baseApi from "../baseApi";

const token = Cookies.get("token");

const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addShop: builder.mutation({
      query: (formData) => ({
        url: "/shop/create",  // API endpoint for creating a shop
        method: "POST",
        body: formData,  // Send form data (including images, etc.)
      }),
      invalidatesTags: ['Shop']
    }),

    // my shop api
    getShop: builder.query({
      query: () => ({
        url: "/shop/myshop/shop",  // API endpoint to fetch shop information
        method: "GET",
        headers: {
          Authorization: `${token}`,  // Send token in Authorization header
        },
      }),
      providesTags: ['Shop']
    }),

    // recent shop api
    getRecentShop: builder.query({
      query: () => ({
        url: "/shop/recentshop/shop",  // API endpoint to fetch recent shops
        method: "GET",
      }),
      providesTags: ['Shop']
    }),

    //
    getAdminShop: builder.query({
      query: () => ({
        url: "/shop/allshop",  // API endpoint to fetch admin shops
        method: "GET",
        headers: {
          Authorization: `${token}`,  // Send token in Authorization header
        },
      }),
      providesTags: ['Shop']
    }),

    //

    deleteShop:builder.mutation({
      query:(id:string)=>({
        url:`/shop/delete/${id}`,  // API endpoint to delete a shop
        method:"DELETE",
       
      }),
      invalidatesTags: ["Shop"], // Invalidate the "Shop" tag to refetch data
    }),

    //
    getSeviceByShopId: builder.query({
      query: (shopId) => ({ 
        url: `/services/get-services/${shopId}`,  
        method: "GET",
      
      }),   
  }),

  ///
  getBookingByShopId: builder.query({
    query: (id:string) => ({
      url: `/bookings/allbooking/shop/${id}`,  
      method: "GET",
      headers: {
        Authorization: `${token}`,  
      },
    }),
  }),
  //

    updateShop: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/shop/update/${id}`,  // API endpoint to update shop info
        method: "PATCH",
        body: formData,  // Send the updated shop data
      }),
      invalidatesTags: ["Shop"]
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddShopMutation,
  useGetShopQuery,
  useGetAdminShopQuery,
  useGetRecentShopQuery,
  useUpdateShopMutation,
  useDeleteShopMutation,
  useGetSeviceByShopIdQuery,
  useGetBookingByShopIdQuery
} = shopApi;

export default shopApi;
