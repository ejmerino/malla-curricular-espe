import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'; // Añadido FaEnvelope para el icono de correo
import './Footer.css';  // Asegúrate de que tienes los estilos correctos

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          &copy; 2025 Josué Merino Calderón. Todos los derechos reservados.
        </p>
        <div className="social-links">
          <a href="https://github.com/ejmerino" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="footer-icon" size={30} />
          </a>
          <a href="https://www.linkedin.com/in/josue-merino-calderon-52639510a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="footer-icon" size={30} />
          </a>
          <a href="mailto:ejmerino@espe.edu.ec" target="_blank" rel="noopener noreferrer" aria-label="Email">
            <FaEnvelope className="footer-icon" size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
