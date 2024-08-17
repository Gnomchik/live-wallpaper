import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './SidebarAndQualityBar.module.css';

const SidebarAndQualityBar = ({ onCategorySelect, onResetCategory, onQualitySelect, onResetQuality }) => {
  const [categories, setCategories] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedQualities, setExpandedQualities] = useState(false);

  const cachedCategories = useRef(null);
  const cachedQualities = useRef(null);

  useEffect(() => {
    if (!cachedCategories.current) {
      fetchCategories();
    } else {
      setCategories(cachedCategories.current);
    }

    if (!cachedQualities.current) {
      fetchQualities();
    } else {
      setQualities(cachedQualities.current);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/video/categories');
      cachedCategories.current = response.data;
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchQualities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/video/qualities');
      cachedQualities.current = response.data;
      setQualities(response.data);
    } catch (error) {
      console.error('Error fetching qualities', error);
    }
  };

  const handleQualitySelect = (id) => {
    onQualitySelect(id);
  };

  const handleResetQuality = () => {
    onResetQuality();
  };

  const toggleExpandCategories = () => {
    setExpandedCategories(!expandedCategories);
  };

  const toggleExpandQualities = () => {
    setExpandedQualities(!expandedQualities);
  };

  return (
    <div className={styles.sidebarAndQualityBarContainer}>
      <div className={`${styles.sidebarContainer} card shadow-sm`}>
        <div className={styles.listGroup}>
          {categories.slice(0, 6).map((category, index) => (
            <button
              key={index}
              className={`${styles.listGroupItem} list-group-item list-group-item-action`}
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name} ({category.videoCount})
            </button>
          ))}
          <div className={`${styles.collapsibleContent} ${expandedCategories ? styles.show : ''}`}>
            {categories.slice(6).map((category, index) => (
              <button
                key={index + 6}
                className={`${styles.listGroupItem} list-group-item list-group-item-action`}
                onClick={() => onCategorySelect(category.id)}
              >
                {category.name} ({category.videoCount})
              </button>
            ))}
          </div>
          {categories.length > 6 && (
            <button
              className={`${styles.listGroupItem} list-group-item list-group-item-action ${styles.customLink}`}
              onClick={toggleExpandCategories}
            >
              {expandedCategories ? 'Скрыть' : 'Показать все'}
              <i className={`fas fa-chevron-${expandedCategories ? 'up' : 'down'} fa-sm`} />
            </button>
          )}
          <button
            className={`${styles.listGroupItem} list-group-item list-group-item-action ${styles.customLink}`}
            onClick={onResetCategory}
          >
            Сбросить фильтр
          </button>
        </div>
      </div>

      <div className={`${styles.qualityBarContainer} card shadow-sm`}>
        <div className={styles.cardHeader} onClick={toggleExpandQualities}>
          <h4 className="card-title mb-0">Качество</h4>
          <i className={`fas fa-chevron-${expandedQualities ? 'up' : 'down'} fa-sm`} />
        </div>
        <div className={`${styles.collapsibleContent} ${expandedQualities ? styles.show : ''}`}>
          <div className={styles.listGroup}>
            {qualities.map((quality, index) => (
              <button
                key={index}
                className={`${styles.listGroupItem} list-group-item list-group-item-action`}
                onClick={() => handleQualitySelect(quality.id)}
              >
                {quality.name} ({quality.videoCount})
              </button>
            ))}
            <button
              className={`${styles.listGroupItem} list-group-item list-group-item-action ${styles.customLink}`}
              onClick={handleResetQuality}
            >
              Сбросить фильтр
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarAndQualityBar;
