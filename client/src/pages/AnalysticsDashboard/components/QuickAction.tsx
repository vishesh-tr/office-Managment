import { Calendar, Target, Users } from "lucide-react";

const QuickAction : React.FC = () => {
    return(
<div className="mt-8 bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                            <p className="font-medium text-blue-900">Schedule Review</p>
                            <p className="text-sm text-blue-600">Plan team performance review</p>
                        </button>
                        <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                            <Target className="h-6 w-6 text-green-600 mb-2" />
                            <p className="font-medium text-green-900">Set Goals</p>
                            <p className="text-sm text-green-600">Define quarterly objectives</p>
                        </button>
                        <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                            <Users className="h-6 w-6 text-purple-600 mb-2" />
                            <p className="font-medium text-purple-900">Team Meeting</p>
                            <p className="text-sm text-purple-600">Schedule progress discussion</p>
                        </button>
                    </div>
                </div>
    );
};

export default QuickAction;