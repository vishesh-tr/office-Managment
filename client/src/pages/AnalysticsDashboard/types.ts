import { LucideIcon } from 'lucide-react';

// Overall statistics interface
export interface OverallStats {
  totalProjects: number;
  totalIssues: number;
  resolvedIssues: number;
  openIssues: number;
  totalTeamMembers: number;
  activeProjects: number;
}

// Project status used for charts or breakdown
export interface ProjectStatus {
  name: string;
  value: number;
  color: string;
}

// Monthly issue tracking
export interface IssueResolution {
  month: string;
  resolved: number;
  opened: number;
}

// Team member contribution stats
export interface TeamContribution {
  name: string;
  projects: number;
  issues: number;
  completed: number;
}

// Weekly performance data
export interface PerformanceData {
  week: string;
  productivity: number;
  quality: number;
}

// Props for a reusable stat card component
export interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  trend?: number;
}
