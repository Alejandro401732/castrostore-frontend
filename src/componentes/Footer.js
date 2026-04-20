import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contenedor">
        <p className="footer__texto">© {new Date().getFullYear()} CastroStore. Todos los derechos reservados.</p>
        <div className="footer__politicas">
          <Link to="/politica-privacidad" className="footer__link">Política de Privacidad</Link>
          <Link to="/politica-devoluciones" className="footer__link">Política de Devoluciones</Link>
          <Link to="/terminos-servicio" className="footer__link">Términos y Condiciones</Link>
        </div>
        <p className="footer__subtexto">Envío rápido · Atención 24/7 · Compra segura</p>
      </div>
    </footer>
  );
}

export default Footer;
