import React, { useEffect, useState } from 'react';
import {
    FiAlertCircle,
    FiAlertTriangle,
    FiClock,
    FiEdit,
    FiFilter,
    FiMoreHorizontal,
    FiPlus,
    FiSearch,
    FiTrash2,
    FiUser
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { deleteIssue, fetchIssues, showNotification } from '../issueSlice';
import { Issue } from '../issueTypes';

interface IssueListProps {
    projectId: string;
    onCreateIssue: () => void;
    onEditIssue: (issue: Issue) => void;
    onViewIssue: (issue: Issue) => void;
}

const IssueList: React.FC<IssueListProps> = ({
    projectId,
    onCreateIssue,
    onEditIssue,
    onViewIssue
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { issues, status, error } = useSelector((state: RootState) => state.issues);
    const { team } = useSelector((state: RootState) => state.team);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [assigneeFilter, setAssigneeFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchIssues(projectId));
    }, [dispatch, projectId]);

    const handleDeleteIssue = async (issueId: string, issueTitle: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${issueTitle}"?`);
        if (!confirmed) return;

        try {
            await dispatch(deleteIssue({ issueId, projectId }));
            dispatch(showNotification({
                message: 'Issue Deleted',
                description: `"${issueTitle}" has been deleted successfully.`,
                type: 'success'
            }));
        } catch (error) {
            dispatch(showNotification({
                message: 'Error',
                description: 'Failed to delete issue',
                type: 'error'
            }));
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Progress': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredIssues = issues.filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || issue.status === statusFilter;
        const matchesPriority = !priorityFilter || issue.priority === priorityFilter;
        const matchesAssignee = !assigneeFilter || issue.assignedTo === assigneeFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });

    const getIssueIcon = (priority: string) => {
        switch (priority) {
            case 'Critical':
            case 'High':
                return <FiAlertCircle className="w-4 h-4" />;
            default:
                return <  FiAlertTriangle className="w-4 h-4" />;
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-red-500 text-lg mb-4">Error: {error}</div>
                <button
                    onClick={() => dispatch(fetchIssues(projectId))}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <  FiAlertTriangle className="text-blue-500" />
                        Issues & Bugs
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <button
                    onClick={onCreateIssue}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <FiPlus className="w-4 h-4" />
                    Create Issue
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <FiFilter className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">All Status</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">All Priorities</option>
                                <option value="Critical">Critical</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                            <select
                                value={assigneeFilter}
                                onChange={(e) => setAssigneeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">All Assignees</option>
                                <option value="">Unassigned</option>
                                {team.map((member) => (
                                    <option key={member.rank} value={member.name}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Issues List */}
            {filteredIssues.length > 0 ? (
                <div className="space-y-3">
                    {filteredIssues.map((issue) => (
                        <div
                            key={issue._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onViewIssue(issue)}
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Issue Header */}
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className={`p-1 rounded ${issue.priority === 'Critical' || issue.priority === 'High' ? 'text-red-500' : 'text-blue-500'}`}>
                                                {getIssueIcon(issue.priority)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 mb-1">
                                                    {issue.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">
                                                    {issue.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Issue Meta */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <FiClock className="w-3 h-3" />
                                                {new Date(issue.createdAt).toLocaleDateString()}
                                            </div>
                                            {issue.assignedTo && (
                                                <div className="flex items-center gap-1">
                                                    <FiUser className="w-3 h-3" />
                                                    {issue.assignedTo}
                                                </div>
                                            )}
                                            {issue.deadline && (
                                                <div className="flex items-center gap-1">
                                                    <FiClock className="w-3 h-3" />
                                                    Due: {new Date(issue.deadline).toLocaleDateString()}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                💬 {issue.comments.length}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Issue Status and Actions */}
                                    <div className="flex items-start gap-2">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(issue.status)}`}>
                                                {issue.status}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(issue.priority)}`}>
                                                {issue.priority}
                                            </span>
                                        </div>

                                        {/* Actions Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === issue._id ? null : issue._id);
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                            >
                                                <FiMoreHorizontal className="w-4 h-4" />
                                            </button>

                                            {activeDropdown === issue._id && (
                                                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-[120px]">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEditIssue(issue);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <FiEdit className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteIssue(issue._id, issue.title);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <FiTrash2 className="w-3 h-3" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
                    <  FiAlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No issues found</h3>
                    <p className="text-gray-500 text-center mb-6">
                        {searchTerm || statusFilter || priorityFilter || assigneeFilter
                            ? 'Try adjusting your search or filters'
                            : 'Create your first issue to get started'
                        }
                    </p>
                    <button
                        onClick={onCreateIssue}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <FiPlus className="w-4 h-4" />
                        Create Issue
                    </button>
                </div>
            )}

            {/* Click outside handler for dropdown */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActiveDropdown(null)}
                />
            )}
        </div>
    );
};

export default IssueList;