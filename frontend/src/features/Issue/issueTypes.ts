export interface Issue {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTo?: string; 
  assignedToId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  tags?: string[];
  comments: IssueComment[];
}

export interface IssueComment {
  _id: string;
  issueId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateIssueData {
  projectId: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  assignedTo?: string;
  assignedToId?: string;
  deadline?: string;
  tags?: string[];
}

export interface UpdateIssueData {
  title?: string;
  description?: string;
  priority?: "Low" | "Medium" | "High" | "Critical";
  status?: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTo?: string;
  assignedToId?: string;
  deadline?: string;
  tags?: string[];
}

export interface IssueFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  search?: string;
}
