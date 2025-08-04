import { Award, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TeamContribution } from "../AnalysticsDashboard/types";
import IssueResolutionTrend from './components/IssueResolutionTrend';
import OverviewStats from './components/OverviewStats';
import PerformanceMetrics from './components/PerformanceMetrics';
import ProjectStatusChart from './components/ProjectStatus';
import QuickAction from './components/QuickAction';

type TimeRange = '7days' | '30days' | '90days' | '1year';
const AnalyticsDashboard: React.FC = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30days');

    const teamContributionData: TeamContribution[] = [
        { name: 'Vishesh', projects: 8, issues: 24, completed: 18 },
        { name: 'Nilaksh', projects: 6, issues: 19, completed: 16 },
        { name: 'Rewant', projects: 5, issues: 22, completed: 15 },
        { name: 'Siddharth', projects: 7, issues: 18, completed: 14 },
        { name: 'Mohit', projects: 4, issues: 16, completed: 12 },
        { name: 'Sneha', projects: 3, issues: 14, completed: 11 }
    ];

    const timeRangeOptions: { value: TimeRange; label: string }[] = [
        { value: '7days', label: 'Last 7 Days' },
        { value: '30days', label: 'Last 30 Days' },
        { value: '90days', label: 'Last 90 Days' },
        { value: '1year', label: 'Last Year' }
    ];

    const getRankingBgColor = (index: number): string => {
        switch (index) {
            case 0: return 'bg-yellow-500';
            case 1: return 'bg-gray-400';
            case 2: return 'bg-amber-600';
            default: return 'bg-blue-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Comprehensive project and team performance insights</p>

                    {/* Time Range Selector */}
                    <div className="mt-4 flex space-x-2">
                        {timeRangeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSelectedTimeRange(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTimeRange === option.value
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                <OverviewStats />
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <ProjectStatusChart />
                    <IssueResolutionTrend />
                </div>

                {/* Team Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Team Contribution */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Users className="h-5 w-5 mr-2 text-purple-600" />
                            Team Contribution Summary
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={teamContributionData} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="completed" fill="#10b981" name="Completed Issues" />
                                <Bar dataKey="issues" fill="#3b82f6" name="Total Issues" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Performers */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Award className="h-5 w-5 mr-2 text-yellow-600" />
                            Top Performers
                        </h3>
                        <div className="space-y-4">
                            {teamContributionData.slice(0, 4).map((member: TeamContribution, index: number) => (
                                <div key={member.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankingBgColor(index)}`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{member.name.split(' ')[0]}</p>
                                            <p className="text-sm text-gray-500">{member.completed} completed</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {Math.round((member.completed / member.issues) * 100)}%
                                        </p>
                                        <p className="text-xs text-gray-500">success rate</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <PerformanceMetrics />
                <QuickAction />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;