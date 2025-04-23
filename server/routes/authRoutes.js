import express from 'express';
import { registerUser,loginUser,optverfy } from '../controllers/authController.js';

const router = express.Router();

router.post('/register',registerUser );
router.post('/opt-verfy',optverfy);
router.post('/login',loginUser );

export default router;
