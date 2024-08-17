import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      axios.get(`http://localhost:3000/api/auth/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setUser(response.data.user);
      }).catch(error => {
        console.error(error);
      });
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  const fetchUserVideos = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3000/api/auth/user/videos/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVideos(response.data.userVideos);
      console.log(response.data.userVideos );
      
    } catch (error) {
      console.error('Error fetching user videos', error);
    }
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
  
    if (newUsername) formData.append('username', newUsername);
    if (newPassword) formData.append('password', newPassword);
  
    // Проверка расширения для фото профиля
    if (newPhoto) {
      const fileName = newPhoto.name;
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      const fileExtension = fileName.split('.').pop().toLowerCase();
  
      if (!validExtensions.includes(fileExtension)) {
        console.error('Недопустимый формат файла. Разрешены только jpg, jpeg, png и gif.');
        return;
      }
      formData.append('photo', newPhoto);
    }
  
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      await axios.put(`http://localhost:3000/api/auth/user/${userId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditMode(false);
      setUser(prevUser => ({
        ...prevUser,
        name: newUsername || prevUser.name,
        photo: newPhoto ? URL.createObjectURL(newPhoto) : prevUser.photo
      }));
    } catch (error) {
      console.error('Ошибка при редактировании данных пользователя', error);
    }
  };
  

  const handleDeleteVideo = useCallback(async (videoId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/api/video/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVideos(videos.filter(video => video.id !== videoId));
    } catch (error) {
      console.error('Error deleting video', error);
    }
  }, [videos]);

  const handleOptionsClick = useCallback((videoId) => {
    setSelectedVideo(prevVideoId => (prevVideoId === videoId ? null : videoId));
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (!event.target.closest(`.${styles.videoCardRelative}`) && selectedVideo) {
      setSelectedVideo(null);
    }
  }, [selectedVideo]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.conteiner}>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <img src={`http://localhost:3000/${user.photo}`} alt="User" className={styles.profilePhoto} />
          <h2 className={styles.userName}>{user.name}</h2>
        </div>
        <div className={styles.profileVideos}>
          <h3 style={{ color: '#ddd' }}>Мои видео</h3>
          <div className={styles.row}>
            {videos.map((video) => (
              <div key={video.id} className={`${styles.colMd3} mb-4`}>
                <div className={`${styles.videoCard} ${styles.videoCardRelative}`}>
                  <div className={styles.videoCardHeader}>
                    <button
                      className={styles.btnOptions}
                      onClick={() => handleOptionsClick(video.id)}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {selectedVideo === video.id && (
                      <div className={`${styles.dropdownMenu} ${styles.show}`}>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
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
                        <p>{video.title}</p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
        {editMode ? (
          <div className={styles.editProfileForm}>
            <h3>Редактировать профиль</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label htmlFor="newUsername" className="form-label">Новый ник</label>
                <input
                  type="text"
                  className="form-control"
                  id="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">Новый пароль</label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPhoto" className="form-label">Новое фото профиля</label>
                <input
                  type="file"
                  className="form-control"
                  id="newPhoto"
                  accept="image/*"
                  onChange={(e) => setNewPhoto(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn btn-primary">Сохранить</button>
            </form>
          </div>
        ) : (
          <button className="btn btn-secondary" onClick={() => setEditMode(true)}>Редактировать профиль</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
