import express from 'express';
import { createTeamMember, getAllTeamMembers } from '../controllers/team.controller';

const router = express.Router();

router.post('/team', createTeamMember);
router.get('/team', getAllTeamMembers);

export default router;
