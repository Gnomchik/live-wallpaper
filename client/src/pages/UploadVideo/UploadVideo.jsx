import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Upload.module.css';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [video, setVideo] = useState(null);
  const [selectedQualityId, setSelectedQualityId] = useState('');
  const [qualities, setQualities] = useState([]);
  const [description, setDescription] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/video/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    const fetchQualities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/video/qualities');
        setQualities(response.data);
      } catch (error) {
        console.error('Error fetching qualities', error);
      }
    };

    fetchCategories();
    fetchQualities();
  }, []);

  const handleCategoryChange = useCallback((id) => {
    setSelectedCategoryIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((categoryId) => categoryId !== id);
      } else if (prevIds.length < 6) {
        return [...prevIds, id];
      }
      return prevIds;
    });
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      const validExtensions = ['mp4', 'webm', 'ogg'];
      const fileExtension = fileName.split('.').pop().toLowerCase();
  
      if (!validExtensions.includes(fileExtension)) {
        setUploadError('Вы можете загрузить только видеофайлы с расширением mp4, webm или ogg.');
        setVideo(null);
        return;
      }
  
      setUploadError('');
      setVideo(file);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Название видео обязательно';
    if (selectedCategoryIds.length === 0) newErrors.categories = 'Выберите хотя бы одну категорию';
    if (!selectedQualityId) newErrors.quality = 'Выберите качество видео';
    if (!video) newErrors.video = 'Выберите видеофайл';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      setUploadError('Необходимо авторизоваться');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    selectedCategoryIds.forEach(id => formData.append('categoryIds', id));
    formData.append('video', video);
    formData.append('qualityId', selectedQualityId);
    formData.append('authorId', user.id);
    formData.append('description', description);

    try {
      await axios.post('http://localhost:3000/api/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      setUploadSuccess(true);
      setUploadError('');
      navigate('/');
    } catch (error) {
      console.error('Error uploading video', error);
      setUploadError('Ошибка при загрузке видео.');
      setUploadSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.containerFluid}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className={styles.card}>
            <div className={`${styles.cardHeader} text-center`}>
              <h4>Добавление своего видео</h4>
            </div>
            <div className={styles.cardBody}>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Название</label>
                  <input
                    type="text"
                    className={`${styles.formControl} form-control`}
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Введите название видео"
                  />
                  {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Тематика</label>
                  <div className="d-flex flex-wrap">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className={`${styles.categoryCard} ${selectedCategoryIds.includes(category.id) ? styles.selected : ''}`}
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  {errors.categories && <div className="text-danger">{errors.categories}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Качество видео</label>
                  <div className="d-flex flex-wrap">
                    {qualities.map((quality) => (
                      <button
                        key={quality.id}
                        type="button"
                        className={`${styles.qualityCard} ${selectedQualityId === quality.id ? styles.selected : ''}`}
                        onClick={() => setSelectedQualityId(quality.id)}
                      >
                        {quality.name}
                      </button>
                    ))}
                  </div>
                  {errors.quality && <div className="text-danger">{errors.quality}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="video" className="form-label">Выберите видео</label>
                  <input
                    type="file"
                    className={`${styles.formControl} form-control`}
                    id="video"
                    accept="video/*"
                    onChange={handleVideoChange}
                    required
                  />
                  {errors.video && <div className="text-danger">{errors.video}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Описание</label>
                  <textarea
                    className={`${styles.formControl} form-control`}
                    id="description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите описание видео"
                  />
                </div>
                {uploadError && <div className="alert alert-danger">{uploadError}</div>}
                {uploadSuccess && <div className="alert alert-success">Видео успешно загружено!</div>}
                <button
                  type="submit"
                  className={styles.uploadButton}
                  disabled={isSubmitting} // Disable button when submitting
                >
                  {isSubmitting ? 'Загрузка...' : 'Загрузить'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;