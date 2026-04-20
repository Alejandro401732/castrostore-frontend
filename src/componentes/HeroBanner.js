import React from 'react';
import './HeroBanner.css';
import heroImage from '../assets/images/Principal.png';

function HeroBanner() {
  const irAProductos = () => {
    const seccion = document.getElementById('productos');
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="hero-banner"
      style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(59, 130, 246, 0.15)), url(${heroImage})` }}
    >
      <div className="hero-banner__overlay" />
      <div className="hero-banner__contenido">
        <span className="hero-banner__tag">Colección exclusiva</span>
        <h1 className="hero-banner__titulo">Tecnología que inspira cada compra</h1>
        <p className="hero-banner__texto">
          Encuentra las mejores marcas con envíos rápidos, ofertas especiales y diseño premium.
        </p>
        <div className="hero-banner__acciones">
          <button className="hero-banner__boton hero-banner__boton--principal" onClick={irAProductos}>
            Ver productos
          </button>
          <button className="hero-banner__boton hero-banner__boton--secundario" onClick={irAProductos}>
            Ofertas rápidas
          </button>
        </div>
        <div className="hero-banner__beneficios">
          <span>🚚 Envío rápido</span>
          <span>🔒 Pago seguro</span>
          <span>📞 Soporte 24/7</span>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
