import express from 'express';
import { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, addTeamMember } from '../controllers/team.js';
import { authenticateManager } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateManager,createTeam);
router.get('/',getTeams);
router.get('/:id', getTeamById);
router.put('/:id',authenticateManager, updateTeam);
router.delete('/:id',authenticateManager, deleteTeam);
router.post('/:id/members',authenticateManager, addTeamMember);

export default router;
