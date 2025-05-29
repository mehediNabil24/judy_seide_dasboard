// src/features/shop/shopApi.ts

import baseApi from "../baseApi";



const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBooking: builder.mutation({
      query: (formData) => ({
        url: "/bookings/create",  // API endpoint for creating a shop
        method: "POST",
        body: formData,  
      }),
      invalidatesTags: ['Booking'], // Invalidate the 'Booking' tag to refetch data
      
    }),

    // get all booking
    getAllBooking: builder.query({
      query: () => ({
        url: "/bookings/allbookings", 
        method: "GET",
     
      }),
      providesTags :['Booking']
    }),
    // 
    getShopBooking: builder.query({
      query: (id) => ({
        url: `/bookings/allbooking/shop/${id}`, 
        method: "GET",
     
      }),
      providesTags :['Booking']
    }),
    //
    getCancelBooking: builder.query({
      query: () => ({
        url: "/bookings/cancelled", 
        method: "GET",
     
      }),
      providesTags :['Booking']
    }),
    //
     getLatestBooking: builder.query({
      query: () => ({
        url: "/bookings/latest", 
        method: "GET",
     
      }),
      providesTags :['Booking']
    }),

    getAllCustomer: builder.query({
      query: () => ({
        url: "/services/getCustomerBookingStats", 
        method: "GET",
     
      }),
      providesTags :['Booking']
    }),

     // get booking by date
     getBookingByDate: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/bookings/allbooking/date`,
        method: "GET",
        params: {
          startDate,
          endDate,
        },
      }),
      providesTags: ["Booking"],
    }),


    updateBooking: builder.mutation({
      query: ({ id, data }) => ({
        url: `/bookings/booking/${id}`,  // API endpoint to update shop info
        method: "PATCH",
        body: data,  // Send the updated shop data
      }),
      invalidatesTags: ['Booking'], // Invalidate the 'Booking' tag to refetch data
    }),
  }),
  overrideExisting: false,
});

export const {
 useAddBookingMutation,
 useGetAllBookingQuery,
 useGetShopBookingQuery,
 useUpdateBookingMutation,
 useGetCancelBookingQuery,
 useGetLatestBookingQuery,
 useGetAllCustomerQuery,
 useGetBookingByDateQuery


} = bookingApi;

export default bookingApi;
