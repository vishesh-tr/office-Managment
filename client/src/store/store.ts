import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "../api/authApi";
import authReducer from "../store/authSlice"; 
import teamReducer from "../features/MyTeam/TeamSlice";
import projectReducer from "../pages/Dashboard/projectSlice";
import inboxReducer from "../pages/Inbox/inboxSlice";
import issueReducer from "../features/Issue/issueSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    team: teamReducer,
    projects: projectReducer,
    inbox: inboxReducer,
    issues: issueReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
