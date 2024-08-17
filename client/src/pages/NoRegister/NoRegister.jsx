import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NoRegister.css'

const NoRegister = () => {
  return (
    <div className='conteiner'>
      <div className="no-register-container">
        <h2 className="text-center" style={{color:'#ddd'}}>Добро пожаловать!</h2>
        <div className="image-container">
          <img
            src="https://i.pinimg.com/564x/59/82/1d/59821d2b1f90fab670a425caaf3c9557.jpg"
            alt="Не зарегистрирован"
            className="no-register-image"
          />
        </div>
        <p className="text-center">Или... войдите или зарегистрируйтесь, чтобы продолжить.</p>
        <div className="text-center mt-3">
          <NavLink to="/login" className="btn btn-primary mx-2">Войти</NavLink>
          <NavLink to="/register" className="btn btn-secondary mx-2">Регистрация</NavLink>
        </div>
      </div>
    </div>
  );
};

export default NoRegister;
