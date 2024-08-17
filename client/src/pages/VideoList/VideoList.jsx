import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import SidebarAndQualityBar from '../../components/SidebarAndQualityBar/SidebarAndQualityBar';
import styles from './VideoListPage.module.css';
import Header  from '../../components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash.debounce';

const VideoListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');
  const [sortByQuality, setSortByQuality] = useState('asc');
  const [sortBy, setSortBy] = useState('best');
  const [showTooltip, setShowTooltip] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchTopVideos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/video/getTopVideos');
      let sortedVideos = response.data;

      if (sortBy === 'worst') {
        sortedVideos = sortedVideos.sort((a, b) => a.likeCount - b.likeCount);
      } else {
        sortedVideos = sortedVideos.sort((a, b) => b.likeCount - a.likeCount);
      }

      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching top videos', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const fetchFilteredVideos = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        quality: selectedQuality,
        sortByQuality,
      };
      const response = await axios.get('http://localhost:3000/api/video', { params });

      let sortedVideos = response.data;

      if (sortBy === 'worst') {
        sortedVideos = sortedVideos.sort((a, b) => a.likeCount - b.likeCount);
      } else {
        sortedVideos = sortedVideos.sort((a, b) => b.likeCount - a.likeCount);
      }

      setVideos(sortedVideos);
    } catch (error) {
      console.error('Error fetching filtered videos', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedQuality, sortByQuality, sortBy]);

  useEffect(() => {
    fetchTopVideos();
    fetchFilteredVideos();
  }, [fetchTopVideos, fetchFilteredVideos]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/video/findVideo', {
        params: { title: searchQuery },
      });
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching search results', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleResetCategory = () => {
    setSelectedCategory('');
  };

  const handleQualitySelect = (qualityId) => {
    setSelectedQuality(qualityId);
  };

  const handleResetQuality = () => {
    setSelectedQuality('');
  };

  const handleSortByQualityChange = (e) => {
    setSortByQuality(e.target.value);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleLike = useCallback(
    debounce(async (videoId) => {
      if (!user || !token) return;

      try {
        const video = videos.find((video) => video.id === videoId);
        if (!video) return;

        const userId = user.id;

        const response = await axios.post('http://localhost:3000/api/video/toggleLike', { userId, videoId });

        setVideos((prevVideos) =>
          prevVideos.map((v) =>
            v.id === videoId
              ? {
                ...v,
                liked: response.data.liked,
                likeCount: response.data.likeCount,
              }
              : v
          )
        );
      } catch (error) {
        console.error('Ошибка при обработке лайка', error);
        setError(error);
      }
    }, 500),
    [videos, user, token]
  );

  const handleMouseEnter = (videoId) => {
    if (!user || !token) {
      setShowTooltip(videoId);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(null);
  };

  return (
    <div className={styles.container}>
      <Header
        onCategorySelect={handleCategorySelect}
        onResetCategory={handleResetCategory}
        onQualitySelect={handleQualitySelect}
        onResetQuality={handleResetQuality}
      />
      <div className={styles.sortGroup}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Поиск"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={styles.searchButton} type="submit">
            <i className="fas fa-search"></i>
          </button>
        </form>
        <div className={styles.sortContainer}>
          <select className={styles.sortSelect} onChange={handleSortByChange} value={sortBy}>
            <option value="best">Начинать с лучших</option>
            <option value="worst">Начинать с худших</option>
          </select>
        </div>
      </div>

      {/* Отображение списка видео */}
      <div className="row">
        {videos.length === 0 && !loading && (
          <div className={styles.noResults}>
            <p>Ничего не найдено</p>
          </div>
        )}

        {videos.map((video) => (
          <div key={video.id} className="col-md-3 mb-2">
            <div className={styles.videoCard}>
              <div className={styles.videoWrapper}>
                <NavLink to={`/show-video/${video.id}`}>
                  <div className={styles.videoContainer}>
                    {video.preview ? (
                      <img
                        src={`http://localhost:3000/data/preview/${video.preview}`}
                        alt={video.title}
                        className={styles.videoImg}
                      />
                    ) : (
                      <div className={styles.videoImg}>Загрузка</div>
                    )}
                    <div className={styles.videoInfo}>
                      <p className={styles.videoTitle}>{video.title}</p>
                    </div>
                  </div>
                </NavLink>
                <div
                  className={`${styles.likeContainer} ${video.liked ? styles.liked : ''}`}
                  onMouseEnter={() => handleMouseEnter(video.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <FontAwesomeIcon
                    icon={video.liked ? faHeartSolid : faHeartRegular}
                    className={styles.heartIcon}
                    onClick={() => toggleLike(video.id)}
                    style={{ cursor: user && token ? 'pointer' : 'not-allowed' }}
                  />
                  <span className={styles.likesCount}>{video.likeCount}</span>
                  {showTooltip === video.id && !user && !token && (
                    <div className={styles.tooltip}>
                      Необходимо зарегистрироваться
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoListPage;
