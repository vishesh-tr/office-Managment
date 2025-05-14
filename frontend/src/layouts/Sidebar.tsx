// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router";
// import { Project } from "../pages/Dashboard/types";
// import { Settings } from "lucide-react";

// interface SidebarProps {
//   projects: Project[];
//   sidebarOpen: boolean;
// }

// interface User {
//   name: string;
//   role: string;
//   avatar: string;
//   projects: string[];
//   rank: number;
// }

// const Sidebar: React.FC<SidebarProps> = ({ projects, sidebarOpen }) => {
//   const navigate = useNavigate();
//   const [showLogout, setShowLogout] = useState(false);
//   const [teamMembers, setTeamMembers] = useState<User[]>([]);
//   const [hoveredProject, setHoveredProject] = useState<string | null>(null);

//   // Fetch team members from localStorage on component mount
//   useEffect(() => {
//     const savedTeam = JSON.parse(localStorage.getItem("team") || "[]");
//     setTeamMembers(savedTeam);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/");
//     window.location.reload();
//   };

//   // Find team members working on a specific project
//   const findMembersForProject = (projectTitle: string) => {
//     return teamMembers.filter(member => 
//       member.projects.some(project => 
//         project.toLowerCase() === projectTitle.toLowerCase()
//       )
//     );
//   };

//   // Get a project's assigned members to display on hover
//   const getProjectMembers = (projectTitle: string) => {
//     const members = findMembersForProject(projectTitle);
//     if (members.length === 0) return "No members assigned";
    
//     if (members.length === 1) {
//       return `${members[0].name} (${members[0].role})`;
//     } else {
//       return `${members.length} members including ${members[0].name}`;
//     }
//   };

//   return (
//     <aside
//       className={`${
//         sidebarOpen ? "block" : "hidden"
//       } lg:block flex flex-col justify-between bg-zinc-900 text-white w-full lg:w-64 p-6 transition-all duration-300 shadow-lg relative`}
//     >
//       <div>
//         <div className="mb-6 text-center">
//           <h1 className="text-2xl font-bold tracking-wide text-blue-400">TeamBoard</h1>
//         </div>

//         <h2 className="text-xs font-semibold mb-4 text-gray-400 tracking-wider">PROJECTS</h2>
//         <ul className="space-y-2 text-sm">
//           {[...projects.map((project) => ({
//             title: project.title,
//             color: project.color,
//           })),
//           { title: "Topics", color: "bg-pink-400" },
//           { title: "Bugs and fixes", color: "bg-green-500" }].map(
//             (item, index) => (
//               <li
//                 key={index}
//                 className="relative flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all group"
//                 onClick={() => navigate(`/page/${encodeURIComponent(item.title)}`)}
//                 onMouseEnter={() => setHoveredProject(item.title)}
//                 onMouseLeave={() => setHoveredProject(null)}
//               >
//                 <span
//                   className={`w-2.5 h-2.5 rounded-full ${item.color} group-hover:scale-125 transition-transform`}
//                 ></span>
//                 <span className="group-hover:text-blue-300">{item.title}</span>
                
//                 {/* Team member tooltip */}
//                 {hoveredProject === item.title && (
//                   <div className="absolute left-full ml-2 bg-zinc-800 text-xs px-3 py-2 rounded-md shadow-md whitespace-nowrap z-10 border border-zinc-700">
//                     <p className="text-blue-300 font-medium mb-1">Currently working:</p>
//                     <p className="text-gray-300">{getProjectMembers(item.title)}</p>
//                   </div>
//                 )}
//               </li>
//             )
//           )}
//           <li
//             className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all group"
//             onClick={() => navigate("/bin")}
//           >
//             <span className="w-2.5 h-2.5 rounded-full bg-red-400 group-hover:scale-125 transition-transform"></span>
//             <span className="group-hover:text-red-500">Bin</span>
//           </li>
//         </ul>
//       </div>

//       <div className="absolute bottom-4 left-5 flex flex-col items-center">
//         <button
//           onClick={() => setShowLogout((prev) => !prev)}
//           className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 hover:scale-105 transition-transform shadow-md"
//           title="Settings"
//         >
//           <Settings className="w-5 h-5 text-gray-300" />
//         </button>

//         {showLogout && (
//           <button
//             onClick={handleLogout}
//             className="mt-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-1 px-4 rounded-full text-xs shadow-lg transition-all"
//           >
//             Logout
//           </button>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;













import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Project } from "../pages/Dashboard/types";
import { Settings, Users, Info } from "lucide-react";

interface SidebarProps {
  projects: Project[];
  sidebarOpen: boolean;
}

interface User {
  name: string;
  role: string;
  avatar: string;
  projects: string[];
  rank: number;
}

const Sidebar: React.FC<SidebarProps> = ({ projects, sidebarOpen }) => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  
  // Listen for any changes to team data in localStorage
  useEffect(() => {
    const loadTeamData = () => {
      try {
        const savedTeam = JSON.parse(localStorage.getItem("team") || "[]");
        setTeamMembers(savedTeam);
      } catch (error) {
        console.error("Error loading team data:", error);
        setTeamMembers([]);
      }
    };
    
    // Load initial data
    loadTeamData();
    
    // Set up event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "team") {
        loadTeamData();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Create a polling mechanism to check for localStorage changes
    // This helps when localStorage is updated in the same window
    const intervalId = setInterval(() => {
      loadTeamData();
    }, 2000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  // Find team members working on a specific project
  const findMembersForProject = (projectTitle: string) => {
    return teamMembers.filter(member => 
      member.projects.some(project => 
        project.toLowerCase() === projectTitle.toLowerCase()
      )
    );
  };

  // Get project member details for tooltip
  const renderProjectMemberDetails = (projectTitle: string) => {
    const members = findMembersForProject(projectTitle);
    
    if (members.length === 0) {
      return (
        <div className="py-1">
          <p className="text-gray-400 text-xs">No team members assigned</p>
        </div>
      );
    }
    
    return (
      <div>
        <p className="text-blue-300 font-medium mb-2 text-xs">TEAM MEMBERS ({members.length})</p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {members.map((member, index) => (
            <div key={index} className="flex items-center gap-2">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-6 h-6 rounded-full border border-zinc-700 object-cover"
              />
              <div>
                <p className="text-zinc-300 text-xs font-medium">{member.name}</p>
                <p className="text-zinc-500 text-xs">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "block" : "hidden"
      } lg:block flex flex-col justify-between bg-zinc-900 text-white w-full lg:w-64 p-6 transition-all duration-300 shadow-lg relative`}
    >
      <div>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-wide text-blue-400">TeamBoard</h1>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-gray-400 tracking-wider">PROJECTS</h2>
          <button 
            onClick={() => navigate("/team")}
            className="text-xs text-gray-400 hover:text-blue-300 flex items-center gap-1"
            title="Manage Team"
          >
            <Users size={14} />
            <span>Team</span>
          </button>
        </div>

        <ul className="space-y-2 text-sm">
          {[...projects.map((project) => ({
            title: project.title,
            color: project.color,
          })),
          { title: "Topics", color: "bg-pink-400" },
          { title: "Bugs and fixes", color: "bg-green-500" }].map(
            (item, index) => {
              const members = findMembersForProject(item.title);
              return (
                <li
                  key={index}
                  className="relative flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all group"
                  onClick={() => navigate(`/page/${encodeURIComponent(item.title)}`)}
                  onMouseEnter={() => setHoveredProject(item.title)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${item.color} group-hover:scale-125 transition-transform`}
                  ></span>
                  <span className="group-hover:text-blue-300">{item.title}</span>
                  
                  {/* Team member tooltip */}
                  {hoveredProject === item.title && (
                    <div className="absolute left-full ml-2 bg-zinc-800 px-3 py-2 rounded-md shadow-md z-10 border border-zinc-700 min-w-48">
                      <div className="flex items-center gap-2 mb-1">
                        <Info size={14} className="text-blue-300" />
                        <p className="text-blue-300 font-medium text-xs">PROJECT DETAILS</p>
                      </div>
                      
                      {renderProjectMemberDetails(item.title)}
                      
                      {members.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-zinc-700">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/team");
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Manage team assignments
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            }
          )}
          <li
            className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all group"
            onClick={() => navigate("/bin")}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 group-hover:scale-125 transition-transform"></span>
            <span className="group-hover:text-red-500">Bin</span>
          </li>
        </ul>
      </div>

      <div className="absolute bottom-4 left-5 flex flex-col items-center">
        <button
          onClick={() => setShowLogout((prev) => !prev)}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 hover:scale-105 transition-transform shadow-md"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-300" />
        </button>

        {showLogout && (
          <button
            onClick={handleLogout}
            className="mt-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-1 px-4 rounded-full text-xs shadow-lg transition-all"
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;