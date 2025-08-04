import { Target } from "lucide-react";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ProjectStatus } from "../types";

const projectStatusData: ProjectStatus[] = [
    { name: 'Completed', value: 12, color: '#10b981' },
    { name: 'In Progress', value: 8, color: '#3b82f6' },
    { name: 'On Hold', value: 5, color: '#f59e0b' },
    { name: 'Planning', value: 3, color: '#6b7280' }
];

const ProjectStatusChart: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Project Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }: { name: string; percent: number }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                        }
                    >
                        {projectStatusData.map((entry: ProjectStatus, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProjectStatusChart;