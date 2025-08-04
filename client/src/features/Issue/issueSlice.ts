import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    CreateIssueData,
    Issue,
    IssueComment,
    UpdateIssueData,
} from "../Issue/issueTypes";

interface IssueState {
  issues: Issue[];
  currentIssue: Issue | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  notification: {
    message: string;
    description: string;
    isVisible: boolean;
    type: "success" | "error" | "warning" | "info";
  };
}

const initialState: IssueState = {
  issues: [],
  currentIssue: null,
  status: "idle",
  error: null,
  notification: {
    message: "",
    description: "",
    isVisible: false,
    type: "info",
  },
};

// Async thunks for API calls
export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (projectId: string) => {
    // Simulate API call - replace with actual API
    const storedIssues = localStorage.getItem(`issues_${projectId}`);
    if (storedIssues) {
      return JSON.parse(storedIssues);
    }
    return [];
  },
);

export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async (issueData: CreateIssueData) => {
    // Simulate API call - replace with actual API
    const newIssue: Issue = {
      _id: Date.now().toString(),
      ...issueData,
      status: "Open",
      createdBy: "Current User", // Replace with actual user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };

    // Store in localStorage (replace with actual API)
    const existingIssues = JSON.parse(
      localStorage.getItem(`issues_${issueData.projectId}`) || "[]",
    );
    const updatedIssues = [...existingIssues, newIssue];
    localStorage.setItem(
      `issues_${issueData.projectId}`,
      JSON.stringify(updatedIssues),
    );

    return newIssue;
  },
);

export const updateIssue = createAsyncThunk(
  "issues/updateIssue",
  async ({
    issueId,
    projectId,
    updateData,
  }: {
    issueId: string;
    projectId: string;
    updateData: UpdateIssueData;
  }) => {
    // Simulate API call - replace with actual API
    const existingIssues = JSON.parse(
      localStorage.getItem(`issues_${projectId}`) || "[]",
    );
    const updatedIssues = existingIssues.map((issue: Issue) => {
      if (issue._id === issueId) {
        return {
          ...issue,
          ...updateData,
          updatedAt: new Date().toISOString(),
        };
      }
      return issue;
    });

    localStorage.setItem(`issues_${projectId}`, JSON.stringify(updatedIssues));
    return updatedIssues.find((issue: Issue) => issue._id === issueId);
  },
);

export const deleteIssue = createAsyncThunk(
  "issues/deleteIssue",
  async ({ issueId, projectId }: { issueId: string; projectId: string }) => {
    // Simulate API call - replace with actual API
    const existingIssues = JSON.parse(
      localStorage.getItem(`issues_${projectId}`) || "[]",
    );
    const filteredIssues = existingIssues.filter(
      (issue: Issue) => issue._id !== issueId,
    );
    localStorage.setItem(`issues_${projectId}`, JSON.stringify(filteredIssues));
    return issueId;
  },
);

export const addComment = createAsyncThunk(
  "issues/addComment",
  async ({
    issueId,
    projectId,
    content,
  }: {
    issueId: string;
    projectId: string;
    content: string;
  }) => {
    const newComment: IssueComment = {
      _id: Date.now().toString(),
      issueId,
      author: "Current User", 
      authorId: "user-id", 
      content,
      createdAt: new Date().toISOString(),
    };

    // Update issue with new comment
    const existingIssues = JSON.parse(
      localStorage.getItem(`issues_${projectId}`) || "[]",
    );
    const updatedIssues = existingIssues.map((issue: Issue) => {
      if (issue._id === issueId) {
        return {
          ...issue,
          comments: [...issue.comments, newComment],
          updatedAt: new Date().toISOString(),
        };
      }
      return issue;
    });

    localStorage.setItem(`issues_${projectId}`, JSON.stringify(updatedIssues));
    return { issueId, comment: newComment };
  },
);

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setCurrentIssue: (state, action: PayloadAction<Issue | null>) => {
      state.currentIssue = action.payload;
    },
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        description: string;
        type: "success" | "error" | "warning" | "info";
      }>,
    ) => {
      state.notification = {
        ...action.payload,
        isVisible: true,
      };
    },
    hideNotification: (state) => {
      state.notification.isVisible = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch issues
      .addCase(fetchIssues.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.issues = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch issues";
      })
      // Create issue
      .addCase(createIssue.fulfilled, (state, action) => {
        state.issues.push(action.payload);
      })
      // Update issue
      .addCase(updateIssue.fulfilled, (state, action) => {
        const index = state.issues.findIndex(
          (issue) => issue._id === action.payload._id,
        );
        if (index !== -1) {
          state.issues[index] = action.payload;
        }
        if (
          state.currentIssue &&
          state.currentIssue._id === action.payload._id
        ) {
          state.currentIssue = action.payload;
        }
      })
      // Delete issue
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.issues = state.issues.filter(
          (issue) => issue._id !== action.payload,
        );
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { issueId, comment } = action.payload;
        const issue = state.issues.find((issue) => issue._id === issueId);
        if (issue) {
          issue.comments.push(comment);
        }
        if (state.currentIssue && state.currentIssue._id === issueId) {
          state.currentIssue.comments.push(comment);
        }
      });
  },
});

export const {
  setCurrentIssue,
  showNotification,
  hideNotification,
  clearError,
} = issueSlice.actions;
export default issueSlice.reducer;
