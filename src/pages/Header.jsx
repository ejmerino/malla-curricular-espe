import React from 'react';
import { useTheme } from './themeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './Header.css';
import espeLogo from '../assets/img/espe.png';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleClickLogo = () => {
    navigate("/"); // Navega a la página principal
    window.location.reload(); // Recarga la página
  };

  return (
    <header className="header">
      <div className="header-content">
        <img
          src={espeLogo}
          alt="Logo ESPE"
          className="logo-image"
          onClick={handleClickLogo} // Agrega el evento onClick al logo
          style={{ cursor: 'pointer' }} // Cambia el cursor al pasar por encima
        />
        <span
          className="logo-text"
          onClick={handleClickLogo} // Agrega el evento onClick al texto
          style={{ cursor: 'pointer' }} // Cambia el cursor al pasar por encima
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