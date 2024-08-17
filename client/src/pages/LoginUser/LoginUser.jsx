import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import styles from './LoginUser.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = '/';
        } catch (error) {
            console.log(error.message);
            setError('Ошибка при входе');
        }
    }

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <h2 className={styles.title}>Вход</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className={styles.formLabel}>Email</label>
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
                    <button type="submit" className={styles.btnPrimary}>Войти</button>
                </form>
                {error && <div className={`${styles.alertDanger} ${styles.mt3}`}>{error}</div>}
                <div className={styles.mt3}>
                    <p>Нет аккаунта? <NavLink to="/auth">Регистрация</NavLink></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
