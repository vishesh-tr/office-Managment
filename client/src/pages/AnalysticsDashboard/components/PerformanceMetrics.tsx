import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PerformanceData } from "../types";


const performanceData: PerformanceData[] = [
    { week: 'Week 1', productivity: 85, quality: 92 },
    { week: 'Week 2', productivity: 78, quality: 88 },
    { week: 'Week 3', productivity: 92, quality: 95 },
    { week: 'Week 4', productivity: 88, quality: 90 }
];

const PerformanceMetrics: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                Weekly Performance Metrics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="productivity"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                        name="Productivity %"
                    />
                    <Line
                        type="monotone"
                        dataKey="quality"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                        name="Quality %"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceMetrics;