import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { motion } from "framer-motion";
import user1 from "../../assets/img1.png";
import user2 from "../../assets/img10.png";
import user3 from "../../assets/img11.png";
import vishesh from "../../assets/img12.png";

interface NewUser {
  name: string;
  role: string;
  avatar: string;
  projects: string[];
  rank?: number;
}

interface Project {
  _id: string;
  title: string;
  description?: string;
}

const avatarOptions = [
  { label: "User 1", value: user1 },
  { label: "User 2", value: user2 },
  { label: "User 3", value: user3 },
  { label: "Vishesh", value: vishesh },
];

const AddUser: React.FC = () => {
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    role: "",
    avatar: "",
    projects: [],
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:4008/project");
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewUser((prevUser) => ({ ...prevUser, avatar: e.target.value }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProject = e.target.value;
    setNewUser((prevUser) => ({
      ...prevUser,
      projects: selectedProject ? [selectedProject] : [],
    }));
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.role || !newUser.avatar || !newUser.projects.length) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await axios.post("http://localhost:4008/team/team", newUser);

      const existingTeam = JSON.parse(localStorage.getItem("team") || "[]");

      const newTeamMember = {
        ...newUser,
        rank: existingTeam.length + 1,
      };

      const updatedTeam = [...existingTeam, newTeamMember];
      localStorage.setItem("team", JSON.stringify(updatedTeam));

      alert("User added successfully!");
      navigate("/team");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Team Member
        </h2>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="flex flex-col gap-5"
        >
          {[
            {
              label: "Full Name",
              name: "name",
              placeholder: "Enter full name",
              value: newUser.name,
            },
            {
              label: "Role",
              name: "role",
              placeholder: "e.g., Frontend, Backend",
              value: newUser.role,
            },
          ].map((field, idx) => (
            <motion.div
              key={idx}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <label className="block text-gray-700 mb-1 font-medium">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                placeholder={field.placeholder}
                value={field.value}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </motion.div>
          ))}

          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <label className="block text-gray-700 mb-1 font-medium">Select Avatar</label>
            <select
              onChange={handleAvatarChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newUser.avatar}
            >
              <option value="">Choose an avatar</option>
              {avatarOptions.map((avatar) => (
                <option key={avatar.label} value={avatar.value}>
                  {avatar.label}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <label className="block text-gray-700 mb-1 font-medium">Assign Project</label>
            <select
              onChange={handleProjectChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newUser.projects[0] || ""}
            >
              <option value="">Choose a project</option>
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <option key={proj._id} value={proj.title}>
                    {proj.title}
                  </option>
                ))
              ) : (
                <option disabled>Loading projects...</option>
              )}
            </select>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddUser}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add User
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddUser;
