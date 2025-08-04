import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';
import { logout, setCredentials } from '../store/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4009/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken; 
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("🔄 Access token expired, trying refresh token");

    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    const refreshResult = await baseQuery(
      {
        url: '/refresh',
        method: 'POST',
        headers: {
          authorization: `Bearer ${refreshToken}`,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).accessToken;

      api.dispatch(
        setCredentials({
          accessToken: newAccessToken,
          refreshToken,
          user: (api.getState() as RootState).auth.user,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      return {
        error: {
          status: 401,
          data: 'Token expired',
        },
      };
    }
  }

  return result;
};

export default baseQueryWithReauth;
