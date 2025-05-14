import React from 'react';
import { Project } from '../types';

interface ProjectModalProps {
  modalOpen: boolean;
  currentProject: Partial<Project>;
  editIndex: number | null;
  setModalOpen: (open: boolean) => void;
  setCurrentProject: (project: Partial<Project>) => void;
  handleSaveProject: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  modalOpen,
  currentProject,
  editIndex,
  setModalOpen,
  setCurrentProject,
  handleSaveProject
}) => {
  if (!modalOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50" 
      onClick={(e) => {
        if (e.target === e.currentTarget) setModalOpen(false);
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-8 w-96 max-w-full" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {editIndex !== null ? "Edit Project" : "Create New Project"}
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              placeholder="Enter project title"
              value={currentProject.title || ""}
              onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Code (2 Characters)</label>
            <input
              type="text"
              placeholder="e.g. MK, UI, JS"
              value={currentProject.short || ""}
              onChange={(e) => setCurrentProject({ ...currentProject, short: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              maxLength={2}
            />
          </div>
          
          {editIndex === null && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Color</label>
              <select 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={currentProject.color || ""}
                onChange={(e) => setCurrentProject({ ...currentProject, color: e.target.value })}
              >
                <option value="">Select a color</option>
                <option value="bg-orange-500">Orange</option>
                <option value="bg-green-500">Green</option>
                <option value="bg-blue-500">Blue</option>
                <option value="bg-purple-500">Purple</option>
                <option value="bg-red-500">Red</option>
                <option value="bg-yellow-500">Yellow</option>
                <option value="bg-teal-500">Teal</option>
                <option value="bg-pink-500">Pink</option>
              </select>
              
              {currentProject.color && (
                <div className="mt-3 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Color Preview</span>
                  <div className={`${currentProject.color} w-6 h-6 rounded-full`}></div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button 
            onClick={() => setModalOpen(false)} 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveProject} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            {editIndex !== null ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;