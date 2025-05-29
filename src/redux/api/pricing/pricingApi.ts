// src/features/shop/shopApi.ts
import Cookies from 'js-cookie';  // Importing the js-cookie module
import baseApi from "../baseApi";


const token = Cookies.get("token");

const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPricing: builder.mutation({
      query: (formData) => ({
        url: "/plan/create",  // API endpoint for add subcesiption
        method: "POST",
        body: formData,  
      }),
      invalidatesTags: ["Pricing"],  // Invalidate the "Subscription" tag after this mutation
      
    }),

    //
     
    addSubscription: builder.mutation({
      query: (formData) => ({
        url: "/subscription/stripe-checkout-session",  // API endpoint for add subcesiption
        method: "POST",
        body: formData,  
      }),
      invalidatesTags: ["Pricing"],  // Invalidate the "Subscription" tag after this mutation
      
    }),

    // my shop api
    getPricing: builder.query({
      query: () => ({
        url: "/plan/getAllPlans?limit=3&page=1",  // API endpoint to fetch shop information
        method: "GET",
        headers: {
          Authorization: `${token}`,  // Send token in Authorization header
        },
      }),
      providesTags: ["Pricing"],  // Provide the "Subscription" tag for this query
    }),
    // get all payment
    getAllPayments: builder.query({
      query: () => ({
        url: "/payment?status=SUCCEEDED&page=1",  // API endpoint to fetch all payment  information
        method: "GET",
        
      }),
      providesTags: ["Pricing"],  // Provide the "Payments" tag for this query
    }),

    getBookingByCustomer: builder.query({
      query: () => ({
        url: "/bookings/allbooking/customer",  // API endpoint to fetch shop information
        method: "GET",
       
      }),
      providesTags: ["Booking"],  // Provide the "Subscription" tag for this query
    }),
    // 


    updatePlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/plan/updatePlan/${id}`,  // API endpoint to update shop info
        method: "PATCH",
        body: data,  // Send the updated shop data
      }),
      invalidatesTags: ["Pricing"],  // Invalidate the "Subscription" tag after this mutation
    }),

  }),
  overrideExisting: false,
});

export const {
    useAddPricingMutation,
    useGetPricingQuery,
    useGetAllPaymentsQuery,
    useAddSubscriptionMutation,
    useUpdatePlanMutation
 


} = pricingApi;

export default pricingApi;
