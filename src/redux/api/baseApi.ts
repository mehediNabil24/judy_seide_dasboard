// src/features/api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Vite uses import.meta.env instead of process.env
const baseUrl =
import.meta.env.VITE_API_URL_DEV;
  // import.meta.env.VITE_ENV === "production"
  //   ? import.meta.env.VITE_API_URL
  //   : import.meta.env.VITE_API_URL_DEV;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization",`${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
    keepUnusedDataFor: 0, 

  tagTypes: ["Reviews","Overview","Admin", "Booking",'Pricing','Shop','Blogs','Categories','Feedback','Payment','Services','Staff','Orders','Products',"Materials"],

});

export default baseApi;
