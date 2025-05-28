import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import { useLocalStoragePromise } from "../hooks/useLocalStoragePromise";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";
import { Project } from "../pages/Dashboard/types";

const BinContextMenu: React.FC<{
  x: number;
  y: number;
  onRestore: () => void;
  onPermanentDelete: () => void;
}> = ({ x, y, onRestore, onPermanentDelete }) => {
  return (
    <div
      className="fixed bg-white shadow-lg rounded-md py-2 z-50 w-48"
      style={{ top: y, left: x }}
    >
      <SEO title="Bin Page" description="This is my Bin page" />
      <button
        onClick={onRestore}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600"
      >
        Restore
      </button>
      <button
        onClick={onPermanentDelete}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
      >
        Permanent Delete
      </button>
    </div>
  );
};

const Bin: React.FC = () => {
  const [deletedProjects, setDeletedProjects] = useState<Project[]>([]);
  const [sidebarOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; index: number | null }>({ x: 0, y: 0, index: null });
  const { getItem, setItem } = useLocalStoragePromise();

  useEffect(() => {
    const fetchDeletedProjects = async () => {
      try {
        const binData = await getItem("bin");
        if (binData && binData.length > 0) {
          setDeletedProjects(binData);
        }
      } catch (error) {
        console.error("Error fetching deleted projects:", error);
      }
    };

    fetchDeletedProjects();

    const handleClick = () => {
      setContextMenu({ x: 0, y: 0, index: null });
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, index });
  };

  const handleRestore = async () => {
    if (contextMenu.index === null) return;

    const index = contextMenu.index;
    setContextMenu({ x: 0, y: 0, index: null });

    try {
      const binData = [...deletedProjects];
      const projectToRestore = binData[index];

      binData.splice(index, 1);
      setDeletedProjects(binData);
      await setItem("bin", binData);

      let existingProjects = await getItem("projects") || [];
      existingProjects = Array.isArray(existingProjects) ? existingProjects : [];

      try {
        const response = await fetch("http://localhost:4008/project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectToRestore),
        });

        if (response.ok) {
          const restoredProject = await response.json();
          existingProjects.push(restoredProject);
        } else {
          existingProjects.push(projectToRestore);
        }
      } catch (error) {
        console.error("Error restoring to server, adding to local storage only:", error);
        existingProjects.push(projectToRestore);
      }

      await setItem("projects", existingProjects);
    } catch (error) {
      console.error("Error restoring project:", error);
    }
  };

  const handlePermanentDelete = async () => {
    if (contextMenu.index === null) return;

    const index = contextMenu.index;
    setContextMenu({ x: 0, y: 0, index: null });

    const confirmed = window.confirm("Are you sure you want to permanently delete this project? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const binData = [...deletedProjects];
      binData.splice(index, 1);
      setDeletedProjects(binData);
      await setItem("bin", binData);
    } catch (error) {
      console.error("Error permanently deleting project:", error);
    }
  };

  const handleEmptyBin = async () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete all projects in the bin? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setDeletedProjects([]);
      await setItem("bin", []);
    } catch (error) {
      console.error("Error emptying bin:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans">
      <Sidebar projects={[]} sidebarOpen={sidebarOpen} />

      <main className="flex-1 px-4 sm:px-8 lg:px-16 py-8">
        <Navbar />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Bin</h1>

          {deletedProjects.length > 0 && (
            <button
              onClick={handleEmptyBin}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
            >
              Empty Bin
            </button>
          )}
        </div>

        {deletedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p className="text-lg">Bin is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deletedProjects.map((project, index) => (
              <div
                key={project._id || index}
                className="relative flex flex-col items-center gap-2 cursor-pointer"
                onContextMenu={(e) => handleContextMenu(e, index)}
              >
                <div
                  className={`${project.color} rounded-2xl w-full h-36 text-white flex justify-center items-center shadow-lg text-5xl font-bold`}
                >
                  {project.short}
                </div>
                <div className="text-black font-medium text-center mt-1">{project.title}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {contextMenu.index !== null && (
        <BinContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
        />
      )}
    </div>
  );
};

export default Bin;