import React, { useState } from 'react';
import { FiMail, FiPhone, FiPlus, FiTrash2, FiX } from 'react-icons/fi';

interface User {
  name: string;
  role: string;
  avatar: string;
  projects: string[];
  rank: number;
  email?: string;
  phone?: string;
}

interface TeamMemberCardProps {
  user: User;
  availableProjects: string[];
  onRemoveMember: (rank: number) => void;
  onAddProject: (rank: number, project: string) => void;
  onRemoveProject: (rank: number, projectName: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  user, 
  availableProjects, 
  onRemoveMember, 
  onAddProject, 
  onRemoveProject
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showAddProject, setShowAddProject] = useState<boolean>(false);
  const [newProject, setNewProject] = useState<string>("");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes("manager")) return "bg-purple-100 text-purple-700";
    if (roleLower.includes("design")) return "bg-pink-100 text-pink-700";
    if (roleLower.includes("develop") || roleLower.includes("engineer")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleAddProject = () => {
    if (newProject.trim()) {
      onAddProject(user.rank, newProject);
      setNewProject("");
      setShowAddProject(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-blue-500 pl-0 sm:pl-0">
        <div className="flex items-center p-4 sm:p-6 w-full">
          {/* Avatar Section */}
          <div className="flex-shrink-0 mr-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-sm border-2 border-gray-100"
              />
              <div className="absolute -bottom-2 -right-2 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-gray-200">
                <span className="text-sm font-bold text-gray-700">{user.rank}</span>
              </div>
            </div>
          </div>

          {/* User Details Section */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{user.name}</h3>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                {user.email && (
                  <a href={`mailto:${user.email}`} className="flex items-center text-gray-600 hover:text-blue-600">
                    <FiMail className="mr-1" />
                    <span className="text-sm hidden md:inline">{user.email}</span>
                  </a>
                )}
                {user.phone && (
                  <a href={`tel:${user.phone}`} className="flex items-center text-gray-600 hover:text-blue-600">
                    <FiPhone className="mr-1" />
                    <span className="text-sm hidden md:inline">{user.phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Projects Section */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Projects</p>
                <button
                  onClick={() => setShowAddProject(true)}
                  className="text-blue-500 hover:text-blue-700 flex items-center text-sm font-medium"
                >
                  <FiPlus className="mr-1" /> Add Project
                </button>
              </div>

              {/* Add Project Dropdown */}
              {showAddProject && (
                <div className="mb-3 flex items-center">
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                  >
                    <option value="">Select a project...</option>
                    {availableProjects
                      .filter(project => !user.projects.includes(project))
                      .map((project, idx) => (
                        <option key={idx} value={project}>{project}</option>
                      ))
                    }
                  </select>
                  <button
                    onClick={handleAddProject}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddProject(false)}
                    className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Projects List */}
              {user.projects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.projects.map((project, index) => (
                    <div
                      key={index}
                      className="group relative bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center"
                      onMouseEnter={() => setHoveredProject(project)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <span>{project}</span>
                      {hoveredProject === project && (
                        <button
                          onClick={() => onRemoveProject(user.rank, project)}
                          className="ml-1.5 bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full p-0.5 transition-colors"
                        >
                          <FiX size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No projects assigned</p>
              )}
            </div>
          </div>
            
          {/* Delete Member Section */}
          <div className="flex justify-end w-full sm:w-auto p-4 sm:pr-6 border-t sm:border-t-0 border-gray-100">
            <div className="relative">
              {showConfirmDelete ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onRemoveMember(user.rank);
                      setShowConfirmDelete(false);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;