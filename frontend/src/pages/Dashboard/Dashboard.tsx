import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Navbar from "../../layouts/Navbar";
import Sidebar from "../../layouts/Sidebar";
import { AppDispatch, RootState } from '../../store/store';
import ProjectModal from "../Dashboard/components/ProjectModal";
import ContextMenu from "./components/ContextMenu";
import Notification from "./components/Notification";
import {
  addProject,
  deleteProject,
  fetchProjects,
  hideNotification,
  Project,
  showNotification,
  updateProject,
  updateProjectColor
} from './projectSlice';
import { addNotification } from '../Inbox/inboxSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, status, error, notification } = useSelector((state: RootState) => state.projects);

  // Local UI state
  const [sidebarOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; index: number | null }>({ x: 0, y: 0, index: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [animateCard, setAnimateCard] = useState<string | null>(null);

  const navigate = useNavigate();

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.index !== null) {
        setContextMenu({ x: 0, y: 0, index: null });
        setShowColorDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const openAddProjectModal = () => {
    setCurrentProject({});
    setEditIndex(null);
    setModalOpen(true);
  };

  const openEditProjectModal = (index: number) => {
    setCurrentProject({ ...projects[index] });
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleSaveProject = async () => {
    if (!currentProject.title || !currentProject.short || (!currentProject.color && editIndex === null)) {
      dispatch(showNotification({
        message: 'Error',
        description: 'All fields are required!',
        type: 'error'
      }));
      return;
    }

    try {
      if (editIndex !== null) {
        const projectId = projects[editIndex]._id;
        dispatch(updateProject({
          projectId,
          updatedProject: currentProject
        }));

        // Send notification for project update
        dispatch(addNotification({
          title: "Project Updated",
          message: `Project "${currentProject.title}" has been updated.`,
          type: "info",
          projectId: projectId,
          projectTitle: currentProject.title,
          projectColor: currentProject.color
        }));
      } else {
        // Add new project
        const result = await dispatch(addProject(currentProject));
        const newProject = result.payload as Project;

        // Send notification for project creation
        dispatch(addNotification({
          title: "Project Created",
          message: `New project "${currentProject.title}" has been created.`,
          type: "success",
          projectId: newProject._id,
          projectTitle: currentProject.title,
          projectColor: currentProject.color
        }));
      }

      setModalOpen(false);
      setCurrentProject({});
      setEditIndex(null);
    } catch (error) {
      console.error("Error:", error);
      dispatch(showNotification({
        message: 'Error',
        description: 'Failed to save project',
        type: 'error'
      }));
    }
  };

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project._id}`, {
      state: { color: project.color, short: project.short },
    });
  };

  const moveToBin = async (index: number) => {
    const confirmed = window.confirm("Are you sure you want to move this project to bin?");
    if (!confirmed) return;

    try {
      const projectToDelete = projects[index];
      const deletedWithTimestamp = { ...projectToDelete, deletedAt: new Date().toISOString() };
      const existingDeleted = JSON.parse(localStorage.getItem("bin") || "[]");
      localStorage.setItem("bin", JSON.stringify([...existingDeleted, deletedWithTimestamp]));

      dispatch(deleteProject(projectToDelete._id));

      // Send notification for project deletion
      dispatch(addNotification({
        title: "Project Deleted",
        message: `Project "${projectToDelete.title}" has been moved to bin.`,
        type: "warning",
        projectTitle: projectToDelete.title,
        projectColor: projectToDelete.color
      }));

      dispatch(showNotification({
        message: 'Success',
        description: 'Project moved to bin',
        type: 'success'
      }));
    } catch (error) {
      console.error("Error deleting project:", error);
      dispatch(showNotification({
        message: 'Error',
        description: 'Failed to delete project',
        type: 'error'
      }));
    }
  };

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, index });
    setShowColorDropdown(false);
  };

  const handleRename = () => {
    if (contextMenu.index !== null) {
      openEditProjectModal(contextMenu.index);
    }
    setContextMenu({ x: 0, y: 0, index: null });
    setShowColorDropdown(false);
  };

  const handleMoveToBin = () => {
    if (contextMenu.index !== null) {
      moveToBin(contextMenu.index);
    }
    setContextMenu({ x: 0, y: 0, index: null });
    setShowColorDropdown(false);
  };

  const handleOrganise = () => {
    setShowColorDropdown((prev) => !prev);
  };

  const handleColorSelect = async (color: string) => {
    if (contextMenu.index !== null) {
      const projectToUpdate = projects[contextMenu.index];
      const projectId = projectToUpdate._id;

      dispatch(updateProjectColor({ projectId, color }));

      // Send notification for color update
      dispatch(addNotification({
        title: "Project Updated",
        message: `Color for "${projectToUpdate.title}" has been updated.`,
        type: "info",
        projectId: projectId,
        projectTitle: projectToUpdate.title,
        projectColor: color
      }));

      // Then update on the server
      dispatch(updateProject({
        projectId,
        updatedProject: { color }
      }));
    }

    setShowColorDropdown(false);
    setContextMenu({ x: 0, y: 0, index: null });
  };

  const handleCardLeave = () => {
    setAnimateCard(null);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.short.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Array of different clip path styles for variety
  const clipPaths = [
    "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
    "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
    "polygon(0 0, 100% 0, 100% 80%, 0 100%)", 
    "polygon(0 20%, 100% 0, 100% 100%, 0 100%)", 
    "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)", 
    "polygon(0 0, 100% 0, 80% 100%, 20% 100%)", 
    "ellipse(75% 50% at 50% 50%)", 
    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", 
  ];

  const getClipPath = (index: number) => {
    return clipPaths[index % clipPaths.length];
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SVG Definitions for clip paths */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="wave-clip">
            <path d="M0,0 L300,0 L300,120 Q250,100 200,120 T100,120 Q50,140 0,120 Z" />
          </clipPath>
          <clipPath id="diagonal-clip">
            <polygon points="0,0 300,0 250,144 0,144" />
          </clipPath>
          <clipPath id="curved-clip">
            <path d="M0,0 L300,0 L300,100 Q150,160 0,100 Z" />
          </clipPath>
          <clipPath id="hexagon-clip">
            <polygon points="50,0 250,0 300,72 250,144 50,144 0,72" />
          </clipPath>
          <clipPath id="arrow-clip">
            <polygon points="0,0 240,0 300,72 240,144 0,144" />
          </clipPath>
        </defs>
      </svg>

      <Sidebar projects={projects} sidebarOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 px-4 py-8 sm:px-8 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Project Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage and organize all your projects</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Loading State */}
          {status === 'loading' && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {status === 'failed' && (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
              <div className="text-red-500 text-lg mb-4">Error: {error}</div>
              <button
                onClick={() => dispatch(fetchProjects())}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {status === 'succeeded' && (
            filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project._id || index}
                    className={`relative rounded-xl overflow-hidden shadow-md transform transition-all duration-300 ${
                      animateCard === project._id ? "scale-[1.03] shadow-lg" : ""
                    }`}
                    onContextMenu={(e) => handleContextMenu(e, index)}
                    onClick={() => handleProjectClick(project)}
                    onMouseEnter={() => setAnimateCard(project._id)}
                    onMouseLeave={handleCardLeave}
                  >
                    {/* Main project header with clip path */}
                    <div 
                      className={`${project.color} h-36 flex items-center justify-center relative overflow-hidden`}
                      style={{
                        clipPath: getClipPath(index)
                      }}
                    >
                      {/* Background pattern overlay */}
                      <div 
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                      
                      {/* Project short text */}
                      <span className="text-white text-5xl font-bold relative z-10">
                        {project.short}
                      </span>
                    </div>

                    {/* Project info section */}
                    <div className="bg-white p-4 relative">
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-50" />
                      
                      <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                          {project.title}
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-gray-400">Active</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom accent line with clip path */}
                      <div 
                        className={`absolute bottom-0 left-0 right-0 h-1 ${project.color} opacity-70`}
                        style={{
                          clipPath: "polygon(0 0, 70% 0, 100% 100%, 0% 100%)"
                        }}
                      />
                    </div>

                    {/* Hover overlay effect */}
                    <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                      animateCard === project._id ? "opacity-5" : "opacity-0"
                    }`} />
                  </div>
                ))}

                {/* Add New Project Card with clip path */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-blue-300 transition-all bg-white flex flex-col items-center justify-center h-56 cursor-pointer relative group"
                  onClick={openAddProjectModal}
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-blue-50 rounded-full p-4 mb-3 group-hover:bg-blue-100 transition-colors duration-300">
                      <FiPlus className="text-blue-500 text-2xl" />
                    </div>
                    <p className="text-gray-700 font-medium">Add New Project</p>
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
                <img src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png" alt="No projects" className="w-24 h-24 mb-4 opacity-50" />
                <p className="text-gray-600 mb-2">No projects found</p>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={openAddProjectModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Create project
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.index !== null && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRename={handleRename}
          onMoveToBin={handleMoveToBin}
          onOrganise={handleOrganise}
          showColorDropdown={showColorDropdown}
          onColorSelect={handleColorSelect}
        />
      )}

      {/* Project Modal */}
      <ProjectModal
        modalOpen={modalOpen}
        currentProject={currentProject}
        editIndex={editIndex}
        setModalOpen={setModalOpen}
        setCurrentProject={setCurrentProject}
        handleSaveProject={handleSaveProject}
      />

      {/* Notification Component */}
      <Notification
        message={notification.message}
        description={notification.description}
        isVisible={notification.isVisible}
        type={notification.type}
        onClose={() => dispatch(hideNotification())}
      />
    </div>
  );
};

export default Dashboard;