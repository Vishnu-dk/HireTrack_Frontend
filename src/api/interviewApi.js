export const interviewsApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        
        scheduleInterview: builder.mutation({
          query: (interviewData) => ({
            url: '/interviews',
            method: 'POST',
            body: interviewData,
          }),
          invalidatesTags: ['Interviews', 'Candidates', 'Dashboard'],
        }),
        rescheduleInterview: builder.mutation({
        query: ({ id, ...interviewData }) => ({
            url: `/interviews/${id}/reschedule`,
            method: 'PATCH',
            body: interviewData,
        }),
        invalidatesTags: ['Interviews', 'Candidates', 'Dashboard'],
        }),

        getMyInterviews: builder.query({
          query: () => '/interviews/my',
          providesTags: ['Interviews'],
        }),

        completeInterview: builder.mutation({
          query: (id) => ({
            url: `/interviews/${id}/complete`,
            method: 'PATCH',
          }),
          invalidatesTags: ['Interviews', 'Feedback'],
        }),

        cancelInterview: builder.mutation({
          query: (id) => ({
            url: `/interviews/${id}/cancel`,
            method: 'PATCH',
          }),
          invalidatesTags: ['Interviews', 'Candidates'],
        }),
getAllInterviews: builder.query({
  query: ({ page = 0, size = 10, status, candidateName, interviewerName,recruiterName,job } = {}) => {
    const params = new URLSearchParams({ page, size });
    if (status) params.append('status', status);
    if (candidateName) params.append('candidateName', candidateName);
    if (interviewerName) params.append('interviewerName', interviewerName);
    if(recruiterName) params.append('recruiterName',recruiterName);
    if(job) params.append('jobTitle',job);
    return `/interviews?${params}`; 
  },
  providesTags: ['Interviews'],
}),


      }),
    });
  },
};

export const {
  useScheduleInterviewMutation,
  useGetMyInterviewsQuery,
  useCompleteInterviewMutation,
  useCancelInterviewMutation,
useGetAllInterviewsQuery,
useRescheduleInterviewMutation
} = interviewsApi;