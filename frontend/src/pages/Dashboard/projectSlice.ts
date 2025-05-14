import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  _id: string;
  title: string;
  short: string;
  color: string;
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  notification: {
    isVisible: boolean;
    message: string;
    description: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
}

const initialState: ProjectState = {
  projects: [],
  status: 'idle',
  error: null,
  notification: {
    isVisible: false,
    message: '',
    description: '',
    type: 'success',
  },
};

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4008/project');
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch projects');
    }
  }
);

// Add new project
export const addProject = createAsyncThunk(
  'projects/addProject',
  async (project: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4008/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (!response.ok) throw new Error('Server error');
      const newProject = await response.json();
      return newProject;
    } catch (error) {
      return rejectWithValue('Failed to add project');
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (
    { projectId, updatedProject }: { projectId: string; updatedProject: Partial<Project> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`http://localhost:4008/project/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) throw new Error('Server error');
      const result = await response.json();
      return { id: projectId, updatedProject: result };
    } catch (error) {
      return rejectWithValue('Failed to update project');
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4008/project/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Server error');
      return projectId;
    } catch (error) {
      return rejectWithValue('Failed to delete project');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        description?: string;
        type?: 'success' | 'error' | 'warning' | 'info';
      }>
    ) => {
      state.notification = {
        isVisible: true,
        message: action.payload.message,
        description: action.payload.description || '',
        type: action.payload.type || 'success',
      };
    },
    hideNotification: (state) => {
      state.notification.isVisible = false;
    },
    updateProjectColor: (
      state,
      action: PayloadAction<{ projectId: string; color: string }>
    ) => {
      const { projectId, color } = action.payload;
      const project = state.projects.find((p) => p._id === projectId);
      if (project) {
        project.color = color;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Add
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload as Project);
        state.notification = {
          isVisible: true,
          message: 'Project Created',
          description: 'Your new project has been successfully created',
          type: 'success',
        };
      })
      .addCase(addProject.rejected, (state, action) => {
        state.notification = {
          isVisible: true,
          message: 'Create Failed',
          description: action.payload as string,
          type: 'error',
        };
      })

      // Update
      .addCase(updateProject.fulfilled, (state, action) => {
        const { id, updatedProject } = action.payload;
        const index = state.projects.findIndex((p) => p._id === id);
        if (index !== -1) {
          state.projects[index] = { ...state.projects[index], ...updatedProject };
        }
        state.notification = {
          isVisible: true,
          message: 'Project Updated',
          description: 'Your project has been successfully updated',
          type: 'success',
        };
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.notification = {
          isVisible: true,
          message: 'Update Failed',
          description: action.payload as string,
          type: 'error',
        };
      })

      // Delete
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((project) => project._id !== action.payload);
        state.notification = {
          isVisible: true,
          message: 'Project Deleted',
          description: 'Your project has been successfully deleted',
          type: 'success',
        };
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.notification = {
          isVisible: true,
          message: 'Delete Failed',
          description: action.payload as string,
          type: 'error',
        };
      });
  },
});

export const { showNotification, hideNotification, updateProjectColor } = projectSlice.actions;
export default projectSlice.reducer;
