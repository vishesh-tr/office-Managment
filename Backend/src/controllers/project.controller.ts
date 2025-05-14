import { Request, Response } from "express";
import mongoose from "mongoose";
import Project, { IProject } from "../models/project.model";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

export const createProject = async (req: Request, res: Response) => {
  const { title, short, color } = req.body;

  if (!title || !short) {
    return res.status(400).json({ message: "Title and Short Code are required" });
  }

  const newProject = new Project({
    title,
    short,
    color,
  });

  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Project ID" });
  }

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, short, color } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Project ID" });
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, short, color },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Project ID" });
  }

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};
