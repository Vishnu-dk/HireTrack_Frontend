export const userApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        
        getAllRecruiter: builder.query({
          query: ({ page = 0, size = 10, status, search } = {}) => {
            debugger
            const params = new URLSearchParams({ page, size });
            if (status) params.append('status', status);
            if (search) params.append('search', search);
    return `/recruiters?${params.toString()}`;           },
          providesTags: ['Recruiters'],
        }),

        getAllInterviewers: builder.query({
          query: ({ page = 0, size = 10, status, search } = {}) => {
            debugger
            const params = new URLSearchParams({ page, size });
            if (status) params.append('status', status);
            if (search) params.append('search', search);
            return `/interviewers?${params.toString()}`;
          },
          providesTags: ['Interviewers'],
        }),
      }),
    });
  },
};

export const {
    useGetAllRecruiterQuery,
    useGetAllInterviewersQuery
} = userApi;