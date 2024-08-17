import React, { useState } from 'react';
import axios from 'axios';
import styles from './AuthUser.module.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file && !allowedTypes.includes(file.type)) {
            setPhoto(null);
            setFileError('Можно загружать только изображения (JPG, PNG) и GIF-файлы.');
        } else {
            setPhoto(file);
            setFileError(null);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (fileError) {
            return;
        }

        if (username.length < 4) {
            setError('Никнейм должен быть не менее 4 символов');
            return;
        }

        if (password.length < 8) {
            setError('Пароль должен быть не менее 8 символов');
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setSuccess(response.data.message);
                window.location.href = '/';
            } else {
                throw new Error('Token is missing in the response');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setError('Ошибка при регистрации');
        }
    };

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <h2 className={styles.title}>Регистрация</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="username" className={styles.formLabel}>Никнейм</label>
                        <input
                            type="text"
                            className={styles.formControl}
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className={styles.formLabel}>Почта</label>
                        <input
                            type="email"
                            className={styles.formControl}
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className={styles.formLabel}>Пароль</label>
                        <input
                            type="password"
                            className={styles.formControl}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="photo" className={styles.formLabel}>Фото</label>
                        <input
                            type="file"
                            className={styles.formControl}
                            id="photo"
                            accept="image/jpeg, image/png, image/gif"
                            onChange={handleFileChange}
                        />
                        {fileError && <div className={styles.textDanger + ' mt-2'}>{fileError}</div>}
                    </div>
                    <button type="submit" className={styles.btnPrimary}>Зарегистрироваться</button>
                </form>
                {error && <div className={`${styles.errorContainer} ${styles.mt3}`}>{error}</div>}
                {success && <div className={styles.alert + ' ' + styles.alertSuccess + ' ' + styles.mt3}>{success}</div>}
                <div className={styles.mt3}>
                    <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
