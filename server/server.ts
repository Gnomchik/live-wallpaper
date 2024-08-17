import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import videoRoutes from './routes/videoRoutes';
import path from 'path';
const compression = require('compression');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public', {
    maxAge: '1y' 
  }));
app.use('/data/uploads', express.static(path.join(__dirname, 'data/uploads')));
app.use('/data/preview', express.static(path.join(__dirname, 'data/preview')));
app.use('/data/image', express.static(path.join(__dirname, 'data/image')))
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
