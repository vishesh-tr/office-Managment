import { Activity, CheckCircle2, Target, TrendingUp, Users } from "lucide-react";
import { OverallStats, StatCardProps } from "../types";
import { useState } from "react";

 const overallStats: OverallStats = {
        totalProjects: 28,
        totalIssues: 142,
        resolvedIssues: 98,
        openIssues: 44,
        totalTeamMembers: 12,
        activeProjects: 8
    };

     const StatCard: React.FC<StatCardProps> = ({
        icon: Icon,
        title,
        value,
        subtitle,
        color = "blue",
        trend
    }) => (
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Icon className={`h-5 w-5 text-${color}-600`} />
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <TrendingUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                        <span className="text-xs font-medium">{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
    
const OverviewStats : React.FC = () => {
    const [animationClass] = useState<string>('');
    return(
 <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${animationClass}`}>
                    <StatCard
                        icon={Target}
                        title="Total Projects"
                        value={overallStats.totalProjects}
                        subtitle={`${overallStats.activeProjects} currently active`}
                        color="blue"
                        trend={12}
                    />
                    <StatCard
                        icon={CheckCircle2}
                        title="Issues Resolved"
                        value={overallStats.resolvedIssues}
                        subtitle={`${overallStats.openIssues} still open`}
                        color="green"
                        trend={8}
                    />
                    <StatCard
                        icon={Users}
                        title="Team Members"
                        value={overallStats.totalTeamMembers}
                        subtitle="Active contributors"
                        color="purple"
                        trend={5}
                    />
                    <StatCard
                        icon={Activity}
                        title="Success Rate"
                        value={`${Math.round((overallStats.resolvedIssues / overallStats.totalIssues) * 100)}%`}
                        subtitle="Issue resolution"
                        color="indigo"
                        trend={3}
                    />
                </div>
    );
};

export default OverviewStats;