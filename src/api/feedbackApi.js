// src/api/feedback/feedbackApi.js
export const feedbackApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        
        submitFeedback: builder.mutation({
          query: ({ interviewId, feedbackData }) => ({
            url: `/interviews/${interviewId}/feedback`,
            method: 'POST',
            body: feedbackData,
          }),
          invalidatesTags: ['Feedback', 'Interviews', 'Dashboard'],
        }),

getInterviewFeedback: builder.query({
  query: (interviewId) => `/interviews/${interviewId}/feedback`,
  providesTags: (result, error, interviewId) => [{ type: 'Feedback', id: interviewId }],
  
  transformResponse: (response) => response,
  transformErrorResponse: (error) => {
    if (error.status === 404) {
      return { data: null, error: null };
    }
    return error;
  },
}),

        getCandidateFeedbacks: builder.query({
          query: (candidateId) => `/candidates/${candidateId}/feedbacks`,
          providesTags: ['Feedback'],
        }),

      }),
    });
  },
};

export const {
  useSubmitFeedbackMutation,
  useGetInterviewFeedbackQuery,
  useGetCandidateFeedbacksQuery,
} = feedbackApi;