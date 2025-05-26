// src/App.js
import React from 'react';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import MainRoutes from './routes/Route.js';

import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div className={isHomePage ? 'relative z-10' : 'static'}>
        <Header className={isHomePage ? 'absolute top-0 left-0 w-full z-30 transition-all duration-300' : 'relative'} />
      </div>

      <main className="main-content">
        <MainRoutes />
      </main>

      <Footer id="page-footer" />
    </>
  );
}

export default App;
