import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import SidebarAndQualityBar from '../SidebarAndQualityBar/SidebarAndQualityBar';
import axios from 'axios';

export function Header({ onCategorySelect, onResetCategory, onQualitySelect, onResetQuality }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Parsed User:", parsedUser);

      const userId = parsedUser.id || (parsedUser.user && parsedUser.user.id);
      if (userId) {
        const GetUserInfo = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/auth/user/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.data && response.data.user) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
              console.error("Нет данных пользователя в ответе:", response.data);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setUser(null);
            }
          } catch (error) {
            console.error("Ошибка при получении информации о пользователе:", error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          }
        };

        GetUserInfo();
      } else {
        console.error("ID пользователя отсутствует в данных.");
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <nav className={styles.headerSidebar}>
      <NavLink className={`${styles.navbarBrand} ${styles.customLink}`} to="/">
        <i className="fas fa-home"></i> Главная
      </NavLink>

      <div className={styles.navbarNav}>
        <NavLink className={`${styles.navItem} ${styles.navLink} ${styles.customLink}`} to="/upload">
          <i className="fas fa-plus-circle"></i> Добавить
        </NavLink>
        <NavLink className={`${styles.navItem} ${styles.navLink} ${styles.customLink}`} to="/profile">
          <i className="fas fa-user-circle"></i> Профиль
        </NavLink>
        {user ? (
          <span className={styles.navbarText}>
            <img src={`http://localhost:3000/${user.photo}`} alt="User" className={styles.profilePhoto} />
            {user.name}
          </span>
        ) : (
          <NavLink className={`${styles.navItem} ${styles.navLink} ${styles.customLink}`} to="/auth">
            <i className="fas fa-sign-in-alt"></i> Войти
          </NavLink>
        )}
      </div>
      <div className={styles.sidebarAndQualityBarContainer}>
        <SidebarAndQualityBar
          onCategorySelect={onCategorySelect}
          onQualitySelect={onQualitySelect}
          onResetCategory={onResetCategory}
          onResetQuality={onResetQuality}
        />
      </div>
      <footer className={`${styles.footer} bg-dark text-white py-4`}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-left">
              <p>&copy; Просто видео.</p>
              <div className={styles.socialLinks}>
                <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                  <i className="fab fa-vk"></i> ВКонтакте
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-white">
                  <i className="fab fa-telegram-plane"></i> Телеграм
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </nav>
  );
}

export default Header;
