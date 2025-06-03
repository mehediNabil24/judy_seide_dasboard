// src/features/blog/blogApi.ts
import Cookies from 'js-cookie';
import baseApi from '../baseApi';

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (formData) => ({
        url: "/blog/create-blog",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ['Blogs'], // invalidate blog list
    }),

    //
    getAdminBlogs: builder.query({
      query: ({ page, limit }) => ({
        url: `/blog/get-all-blogs?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ['Blogs'], // provide blog list tag
    }),

    // 
    getUserBlog: builder.query({
      query: (id) => {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error('No token found');
        }

        return {
          url: `/blog/myblog/${id}`,
          method: "GET",
        };
      },
      providesTags: ['Blogs'], // if needed separately
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blog/update-blog/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['Blogs'], // invalidate blog list
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blog/delete-blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blogs'], // invalidate blog list
    }),
  }),
  overrideExisting: false,

});

export const {
  useAddBlogMutation,
  useGetUserBlogQuery,
  useGetAdminBlogsQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

export default blogApi;
