import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./Types";

interface TeamState {
  team: User[];
}

const initialState: TeamState = {
  team: JSON.parse(localStorage.getItem("team") || "[]"),
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<User[]>) => {
      state.team = action.payload;
    },
    addMember: (state, action: PayloadAction<User>) => {
      state.team.push(action.payload);
    },
    removeMember: (state, action: PayloadAction<number>) => {
      state.team = state.team.filter((user) => user.rank !== action.payload);
      state.team = state.team.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));
    },
    updateMemberProjects: (
      state,
      action: PayloadAction<{ rank: number; projects: string[] }>,
    ) => {
      const member = state.team.find(
        (user) => user.rank === action.payload.rank,
      );
      if (member) member.projects = action.payload.projects;
    },
  },
});

export const { setTeam, addMember, removeMember, updateMemberProjects } =
  teamSlice.actions;
export default teamSlice.reducer;
