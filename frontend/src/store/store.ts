import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../api/authApi";
import teamReducer from "../features/MyTeam/TeamSlice";
import projectReducer from "../pages/Dashboard/projectSlice";
import inboxReducer from "../pages/Inbox/inboxSlice";

export const store = configureStore({
  reducer: {
    team: teamReducer,
    projects: projectReducer,
    inbox: inboxReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;