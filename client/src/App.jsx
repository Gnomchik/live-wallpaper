import React from 'react';
import { Header } from './components/Header/Header';
import './App.css';
import { Outlet } from 'react-router-dom';
import '../src/style/Global.module.css';

function App() {
  return (
    <div id="root">
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
