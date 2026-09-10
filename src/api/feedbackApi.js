// src/api/feedback/feedbackApi.js
export const feedbackApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        
        // ⭐ Submit feedback (Interviewer only)
        submitFeedback: builder.mutation({
          query: ({ interviewId, feedbackData }) => ({
            url: `/interviews/${interviewId}/feedback`,
            method: 'POST',
            body: feedbackData,
          }),
          invalidatesTags: ['Feedback', 'Interviews', 'Dashboard'],
        }),

        // 🔍 Get feedback for a specific interview
getInterviewFeedback: builder.query({
  query: (interviewId) => `/interviews/${interviewId}/feedback`,
  providesTags: (result, error, interviewId) => [{ type: 'Feedback', id: interviewId }],
  
  // 🎯 Transform 404 into "no feedback" instead of error
  transformResponse: (response) => response,
  transformErrorResponse: (error) => {
    // If backend returns 404 for "no feedback", treat as null data
    if (error.status === 404) {
      return { data: null, error: null };
    }
    return error;
  },
}),

        // 📋 Get all feedback for a candidate
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