import { setCredentials } from '../store/store';

export const authApi = {
  injectInto: (api) => {
    return api.injectEndpoints({
      endpoints: (builder) => ({
        
        login: builder.mutation({
          query: (credentials) => ({
            url: '/auth/login',
            method: 'POST',
            body: credentials,
          }),
          async onQueryStarted({ email }, { dispatch, queryFulfilled }) {
            try {
              const { data } = await queryFulfilled;
              const role = email.includes('admin') ? 'ADMIN'
                : email.includes('recruiter') ? 'RECRUITER'
                : 'INTERVIEWER';
              dispatch(setCredentials({ token: data.token, role, email }));
            } catch (err) { 
             }
          },
        }),

      }),
      overrideExisting: false,
    });
  },
};
export const { useLoginMutation } = authApi;
