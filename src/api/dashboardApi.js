export const dashboardApi = {
  injectInto: (api) => {
    api.injectEndpoints({
      endpoints: (builder) => ({
        getDashboard: builder.query({
          query: () => '/dashboard',

          pollingInterval: 30000,
        }),

      }),
    });
  },
};

export const { useGetDashboardQuery } = dashboardApi;