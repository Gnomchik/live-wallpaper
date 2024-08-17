import { Router } from 'express';
import { registerUser, loginUser, getUserInfo, updateUser, uploadMiddleware, returnUserVideos } from '../controller/authController';

const router = Router();

router.post('/register', uploadMiddleware, registerUser);
router.post('/login', loginUser);
router.get('/user/:userId', getUserInfo);
router.put('/user/:userId', uploadMiddleware, updateUser);
router.get('/user/videos/:userId', returnUserVideos);

export default router;
