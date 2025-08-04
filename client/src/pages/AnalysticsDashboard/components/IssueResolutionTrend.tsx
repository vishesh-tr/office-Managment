import React from "react"
import { AlertCircle } from "lucide-react"
import { Area,AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { IssueResolution } from "../types";

const issueResolutionData: IssueResolution[] = [
        { month: 'Jan', resolved: 15, opened: 20 },
        { month: 'Feb', resolved: 22, opened: 18 },
        { month: 'Mar', resolved: 18, opened: 25 },
        { month: 'Apr', resolved: 28, opened: 22 },
        { month: 'May', resolved: 32, opened: 19 },
        { month: 'Jun', resolved: 25, opened: 16 }
    ];


const IssueResolutionTrend: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-green-600" />
                Issue Resolution Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={issueResolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="resolved"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                    />
                    <Area
                        type="monotone"
                        dataKey="opened"
                        stackId="2"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IssueResolutionTrend;