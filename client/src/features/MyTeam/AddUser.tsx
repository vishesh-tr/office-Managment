import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import user1 from "../../assets/img1.png";
import user2 from "../../assets/img2.png";
import user3 from "../../assets/img3.png";
import user4 from "../../assets/img4.png";
import user5 from "../../assets/img5.png";
import user6 from "../../assets/img6.png";
import user7 from "../../assets/img7.png";
import user8 from "../../assets/img8.png";
import user9 from "../../assets/img9.png";
import user10 from "../../assets/img10.png";
import user11 from "../../assets/img11.png";
import user12 from "../../assets/img12.png";
import SEO from "../../components/SEO";
import { AppDispatch } from "../../store/store";
import { addMember } from "../MyTeam/TeamSlice";

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
  { label: "User 4", value: user4 },
  { label: "User 5", value: user5 },
  { label: "User 6", value: user6 },
  { label: "User 7", value: user7 },
  { label: "User 8", value: user8 },
  { label: "User 9", value: user9 },
  { label: "User 10", value: user10 },
  { label: "User 11", value: user11 },
  { label: "user 12", value: user12 },
];

const AddUser: React.FC = () => {
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    role: "",
    avatar: "",
    projects: [],
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const dispatch = useDispatch<AppDispatch>();
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
      // Post to backend
      await axios.post("http://localhost:4008/team/team", newUser);

      // Get current team from localStorage to determine rank
      const existingTeam = JSON.parse(localStorage.getItem("team") || "[]");
      
      const newTeamMember = {
        ...newUser,
        rank: existingTeam.length + 1,
      };

      // Add to Redux store (this will also update localStorage through the Team component)
      dispatch(addMember(newTeamMember));

      alert("User added successfully!");
      
      // Reset form
      setNewUser({
        name: "",
        role: "",
        avatar: "",
        projects: [],
      });
      
      // Navigate to team page
      navigate("/team");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SEO title="Adduser Page" description="This is my Adduser page" />
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