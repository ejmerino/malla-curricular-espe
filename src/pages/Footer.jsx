import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import styles from './Footer.module.css'; // Importa los estilos modulares
import { useTheme } from './themeContext'; // Importa el hook del tema

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`${styles.footer} ${isDarkMode ? styles.darkModeFooter : ''}`}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Josué Merino Calderón. Todos los derechos reservados.
        </p>
        <div className={styles.socialLinks}>
          <a href="https://github.com/ejmerino" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className={styles.footerIcon} size={30} />
          </a>
          <a href="https://www.linkedin.com/in/josue-merino-calderon-52639510a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className={styles.footerIcon} size={30} />
          </a>
          <a href="mailto:ejmerino@espe.edu.ec" target="_blank" rel="noopener noreferrer" aria-label="Email">
            <FaEnvelope className={styles.footerIcon} size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;