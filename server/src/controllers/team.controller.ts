import { Request, Response } from 'express';
import TeamMember from '../models/team.model';

export const createTeamMember = async (req: Request, res: Response) => {
  const { name, role, avatar, projects } = req.body;

  if (!name || !role || !avatar || !projects) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMember = new TeamMember({
      name,
      role,
      avatar,
      projects,
      rank: Math.floor(Math.random() * 100), 
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating team member", error });
  }
};

export const getAllTeamMembers = async (_req: Request, res: Response) => {
  try {
    const members = await TeamMember.find();
    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching team members", error });
  }
};
