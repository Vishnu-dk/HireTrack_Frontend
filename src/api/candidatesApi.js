// src/api/candidates/candidatesApi.js
export const candidatesApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        
        getCandidates: builder.query({
          query: ({ page = 0, size = 10, jobId, status, search } = {}) => {
            const params = new URLSearchParams({ page, size });
            if (jobId) params.append('jobId', jobId);
            if (status) params.append('status', status);
            if (search) params.append('search', search);
            return `/candidates?${params}`;
          },
          providesTags: ['Candidates'],
        }),

        createCandidate: builder.mutation({
          query: (candidateData) => ({
            url: '/candidates',
            method: 'POST',
            body: candidateData,
          }),
          invalidatesTags: ['Candidates', 'Dashboard'],
        }),

        updateCandidateStatus: builder.mutation({
          query: ({ id, status }) => ({
            url: `/candidates/${id}/status?status=${status}`,
            method: 'PATCH',
          }),
          invalidatesTags: ['Candidates', 'Dashboard', 'Interviews'],
        }),

        uploadResume: builder.mutation({
          query: ({ id, file }) => {
            const formData = new FormData();
            formData.append('file', file);
            return {
              url: `/candidates/${id}/resume`,
              method: 'POST',
              body: formData,
              headers: {},
            };
          },
          invalidatesTags: ['Candidates'],
        }),

      }),
    });
  },
};

export const {
  useGetCandidatesQuery,
  useCreateCandidateMutation,
  useUpdateCandidateStatusMutation,
  useUploadResumeMutation,
} = candidatesApi;