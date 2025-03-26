import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Usaremos iconos de react-icons
import './Footer.css';  // Asegúrate de que tienes los estilos correctos

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Desarrollado por Josué Merino Calderón | 2025</p>
        <div className="social-links">
          <a href="https://github.com/ejmerino" target="_blank" rel="noopener noreferrer">
            <FaGithub size={30} />
          </a>
          <a href="https://www.linkedin.com/in/josue-merino-calderon-52639510a/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
