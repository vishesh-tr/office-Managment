import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  role: string;
  avatar: string;
  projects: string[];
  rank: number;
}

const TeamMemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String, required: true },
  projects: { type: [String], required: true },
  rank: { type: Number, required: true }
});

export default mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
