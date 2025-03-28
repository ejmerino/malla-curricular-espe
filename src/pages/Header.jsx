import React from 'react';
import { useTheme } from './themeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './Header.css';
import espeLogo from '../assets/img/espe.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleClickLogo = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <header className={`header ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-content">
        <img
          src={espeLogo}
          alt="Logo ESPE"
          className="logo-image"
          onClick={handleClickLogo}
          style={{ cursor: 'pointer' }}
        />
        <span
          className="logo-text"
          onClick={handleClickLogo}
          style={{ cursor: 'pointer' }}
        >
          Mallas Curriculares - ESPE
        </span>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {isDarkMode ? <FaSun size={24} color="yellow" /> : <FaMoon size={24} color="gray" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
