// src/features/api/review/reviewApi.ts
import baseApi from "../baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getUserPayment: builder.query({
      query: () => ({
        url: `/payment/user`,
        method: "GET",
      }),
      providesTags: ['Payment'], // Provide the 'Payment' tag for caching
    }),
   
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {useGetUserPaymentQuery } = paymentApi;
export default paymentApi;
