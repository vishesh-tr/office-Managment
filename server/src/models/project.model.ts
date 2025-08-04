import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  short: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    short: { type: String, required: true },
    color: { type: String, default: "" },
  },
  { timestamps: true }
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;
