import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Import feature modules
import { authApi } from './authApi';
import { dashboardApi } from './dashboardApi';
import { jobsApi } from './jobsApi';
import { candidatesApi } from './candidatesApi';
import { interviewsApi } from './interviewApi';
import { feedbackApi } from './feedbackApi';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth', 'Jobs', 'Candidates', 'Interviews', 'Feedback', 'Dashboard'],
  endpoints: () => ({}),
});

// Inject modules
authApi.injectInto(api);
dashboardApi.injectInto(api);
jobsApi.injectInto(api);
candidatesApi.injectInto(api); 
interviewsApi.injectInto(api);   
feedbackApi.injectInto(api);

export const { useLoginMutation,
               useGetDashboardQuery ,
                 useGetAllJobQuery,
                useGetJobQuery, 
                useCreateJobMutation,
                useUpdateJobMutation,
                useUpdateJobStatusMutation,
                useGetCandidatesQuery,
                useCreateCandidateMutation,
                useUpdateCandidateStatusMutation,
                useUploadResumeMutation,
              useScheduleInterviewMutation,
              useGetMyInterviewsQuery,
              useCompleteInterviewMutation,
              useCancelInterviewMutation,
              useGetAllInterviewsQuery,
              useSubmitFeedbackMutation,
  useGetInterviewFeedbackQuery,
  useGetCandidateFeedbacksQuery,
useRescheduleInterviewMutation} = api;
