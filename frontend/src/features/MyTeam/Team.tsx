import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/SEO";
import Navbar from "../../layouts/Navbar";
import Sidebar from "../../layouts/Sidebar";
import { fetchProjects } from "../../pages/Dashboard/projectSlice";
import { Project } from "../../pages/Dashboard/types";
import { AppDispatch, RootState } from "../../store/store";
import TeamMemberCard from "../MyTeam/components/TeamMemberCard";
import { removeMember, updateMemberProjects } from "../MyTeam/TeamSlice";

const TEAM_UPDATED_EVENT = "team_updated";

const Team: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const team = useSelector((state: RootState) => state.team.team);
  const { projects } = useSelector((state: RootState) => state.projects);

  const [sidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);

  // --------- DARK MODE STATE -----------
  // const [darkMode, setDarkMode] = useState<boolean>(() => {
  //   if (typeof window !== "undefined") {
  //     const saved = localStorage.getItem("dark-mode");
  //     if (saved !== null) return saved === "true";
  //     return window.matchMedia("(prefers-color-scheme: dark)").matches;
  //   }
  //   return false;
  // });

  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  //   localStorage.setItem("dark-mode", darkMode.toString());
  // }, [darkMode]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const projectTitles = projects.map((project: Project) => project.title);
      setAvailableProjects(projectTitles);
    }
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("team", JSON.stringify(team));
    const event = new CustomEvent(TEAM_UPDATED_EVENT);
    window.dispatchEvent(event);
  }, [team]);

  const handleRemoveMember = (rank: number) => {
    dispatch(removeMember(rank));
    showNotification("Team member removed", "The member has been removed from your team", "red");
  };

  const handleAddProject = (rank: number, projectName: string) => {
    if (projectName.trim() === "") return;

    const member = team.find(user => user.rank === rank);
    if (!member || member.projects.includes(projectName)) return;

    const updatedProjects = [...member.projects, projectName];
    dispatch(updateMemberProjects({ rank, projects: updatedProjects }));

    showNotification("Project added", "The project has been assigned to the team member", "green");
  };

  const handleRemoveProject = (rank: number, projectName: string) => {
    const member = team.find(user => user.rank === rank);
    if (!member) return;

    const updatedProjects = member.projects.filter(project => project !== projectName);
    dispatch(updateMemberProjects({ rank, projects: updatedProjects }));

    showNotification("Project removed", "The project has been removed from the team member", "red");
  };

  const showNotification = (title: string, message: string, color: string) => {
    const toast = document.getElementById("project-notification");
    const iconContainer = document.getElementById("notification-icon-container");

    if (toast && iconContainer) {
      const titleElement = toast.querySelector("#notification-title");
      const messageElement = toast.querySelector("#notification-message");

      if (titleElement) titleElement.textContent = title;
      if (messageElement) messageElement.textContent = message;

      iconContainer.className = `bg-${color}-100 p-2 rounded-full`;

      toast.classList.remove("translate-y-20", "opacity-0");
      toast.classList.add("translate-y-0", "opacity-100");

      setTimeout(() => {
        toast.classList.remove("translate-y-0", "opacity-100");
        toast.classList.add("translate-y-20", "opacity-0");
      }, 3000);
    }
  };

  const filteredTeam = team.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SEO title="Team Page" description="This is my Team page" />
      <Sidebar projects={projects} sidebarOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col">
        <Navbar />

        {/* Dark Mode Toggle Button */}
        {/* <div className="flex justify-end items-center p-4">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              // Moon Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            ) : (
              // Sun Icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.66 17.66l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42" />
              </svg>
            )}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div> */}

        <div className="flex-1 px-4 py-8 sm:px-8 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Team Management</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your team members and their roles</p>
            </div>
            <button
              onClick={() => navigate("/add-user")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <FiPlus className="text-lg" /> Add New Member
            </button>
          </div>

          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search members..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredTeam.length > 0 ? (
              filteredTeam.map((user) => (
                <TeamMemberCard
                  key={user.rank}
                  user={user}
                  availableProjects={availableProjects}
                  onRemoveMember={handleRemoveMember}
                  onAddProject={handleAddProject}
                  onRemoveProject={handleRemoveProject}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-data-not-found-1965034-1662569.png"
                  alt="No members"
                  className="w-24 h-24 mb-4 opacity-50"
                />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No team members found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search</p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {team.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-6">
              <img
                src="https://cdn.iconscout.com/icon/free/png-256/free-team-1543514-1306025.png"
                alt="Team"
                className="w-32 h-32 mb-6 opacity-60"
              />
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-2">Your team is empty</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
                Start by adding team members to collaborate on your projects
              </p>
              <button
                onClick={() => navigate("/add-user")}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
              >
                <FiPlus /> Add your first team member
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      <div
        id="project-notification"
        className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-3 transform translate-y-20 opacity-0 transition-all duration-300 flex items-center gap-3"
      >
        <div id="notification-icon-container" className="bg-green-100 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p id="notification-title" className="font-medium text-gray-800 dark:text-gray-100">Notification</p>
          <p id="notification-message" className="text-gray-500 dark:text-gray-400 text-sm">Message goes here</p>
        </div>
      </div>
    </div>
  );
};

export default Team;
