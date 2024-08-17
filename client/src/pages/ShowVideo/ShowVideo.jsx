import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './ShowVideo.module.css';

const ShowVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/video/getvideobyId/${id}`);
        setVideo(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching video', err);
        setError('Ошибка загрузки видео');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const videoSrc = useMemo(() => {
    return video ? `http://localhost:3000/data/uploads/${video.path}` : '';
  }, [video]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className={styles.textDanger}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>{video?.title}</h2>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.videoJs}
          controls
          preload="auto"
        >
          <source src={videoSrc} type="video/mp4" />
          Ваш браузер не поддерживает видео тег.
        </video>
      </div>
      <div className={styles.videoDetails}>
        <p><strong>Описание:</strong> {video?.description}</p>
        <p><strong>Категории:</strong> {video?.categories.map(c => c.category.name).join(', ')}</p>
        <p><strong>Качество:</strong> {video?.quality.name}</p>
        <p>
          <img
            src={`http://localhost:3000/${video.author.photo}`}
            className={styles.avatar}
          />{' '}
          {video.author.name}
        </p>
      </div>
    </div>
  );
};

export default ShowVideo;
