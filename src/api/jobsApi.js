export const jobsApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        
        getAllJob: builder.query({
          query: ({ page = 0, size = 10, status, search } = {}) => {
            debugger
            const params = new URLSearchParams({ page, size });
            if (status) params.append('status', status);
            if (search) params.append('search', search);
            return `/jobs?${params}`;
          },
          providesTags: ['Jobs'],
        }),

        getJob: builder.query({
          query: (id) => `/jobs/${id}`,
          providesTags: (result, error, id) => [{ type: 'Jobs', id }],
        }),

        createJob: builder.mutation({
          query: (jobData) => ({
            url: '/jobs',
            method: 'POST',
            body: jobData,
          }),
          invalidatesTags: ['Jobs', 'Dashboard'],
        }),

        updateJob: builder.mutation({
          query: ({ id, ...jobData }) => ({
            url: `/jobs/${id}`,
            method: 'PUT',
            body: jobData,
          }),
          invalidatesTags: (result, error, { id }) => [
            { type: 'Jobs', id },
            'Jobs',
            'Dashboard',
          ],
        }),

        updateJobStatus: builder.mutation({
          query: ({ id, status }) => ({
            url: `/jobs/${id}/status?status=${status}`,
            method: 'PATCH',
          }),
          invalidatesTags: (result, error, { id }) => [
            { type: 'Jobs', id },
            'Jobs',
            'Dashboard',
          ],
        }),

      }),
    });
  },
};

export const {
  useGetAllJobQuery,
  useGetJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useUpdateJobStatusMutation,
} = jobsApi;