import { configureStore } from "@reduxjs/toolkit";
import teamReducer from "../features/MyTeam/TeamSlice";
import projectReducer from "../pages/Dashboard/projectSlice";

export const store = configureStore({
  reducer: {
    team: teamReducer,
    projects: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
