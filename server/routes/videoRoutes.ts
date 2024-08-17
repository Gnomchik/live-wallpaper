import { Router } from 'express';
import {
  uploadVideo,
  getVideos,
  searchVideo,
  getCategories,
  getVideosByQuality,
  getVideosByCategory,
  getQualities,
  deleteVideo,
  getVideoById,
  downloadVideo,
  toggleLike,
  getTopVideos
} from '../controller/videoController';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'data/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', getVideos);
router.get('/findVideo', searchVideo);
router.get('/categories', getCategories);
router.get('/qualities', getQualities);
router.get('/by-quality/:qualityId', getVideosByQuality);
router.get('/by-category/:categoryId', getVideosByCategory);
router.get('/getvideobyId/:id', getVideoById);
router.get('/download/:id', downloadVideo);
router.post('/upload', upload.single('video'), uploadVideo);
router.delete('/:id', deleteVideo);
router.post('/toggleLike', toggleLike);
router.post('/getTopVideos',getTopVideos);
export default router;
