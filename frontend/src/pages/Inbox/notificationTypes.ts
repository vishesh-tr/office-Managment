export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  createdAt: string;
  read: boolean;
  projectId?: string;
  projectTitle?: string;
  projectColor?: string;
}

export interface NotificationState {
  notifications: Notification[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
