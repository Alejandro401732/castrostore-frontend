// ============================================
// COMPONENTE: BarraNavegacion
// Barra de navegación principal de la aplicación
// ============================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BarraNavegacion.css';

const BarraNavegacion = ({ busqueda, onBuscar, cantidadCarrito, hayResultadosBusqueda, onAbrirSidebar }) => {
  const [valorBusqueda, setValorBusqueda] = useState(busqueda);

  useEffect(() => {
    setValorBusqueda(busqueda);
  }, [busqueda]);

  const manejarSubmit = (e) => {
    e.preventDefault();
    onBuscar(valorBusqueda.trim());
  };

  return (
    <header className="barra-navegacion">
      <div className="barra-navegacion__brand-search">
        <button
          className="barra-navegacion__btn-menu"
          onClick={onAbrirSidebar}
          aria-label="Abrir menú de categorías"
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <Link to="/" className="barra-navegacion__logo">
          CastroStore
        </Link>

        <div className="barra-navegacion__search-group">
          <span className="barra-navegacion__label">Búsqueda</span>
          <form className={`barra-navegacion__search barra-navegacion__search--compact ${!hayResultadosBusqueda && valorBusqueda.trim() ? 'barra-navegacion__search--error' : ''}`} onSubmit={manejarSubmit}>
            <input
              type="text"
              value={valorBusqueda}
              onChange={(e) => setValorBusqueda(e.target.value)}
              placeholder="Realizar tu búsqueda"
              aria-label="Buscar productos"
            />
            <button type="submit" className="barra-navegacion__search-button" aria-label="Buscar">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <div className="barra-navegacion__right">
        <Link to="/carrito" className="barra-navegacion__icono-boton" aria-label="Ver carrito">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M5 6h14l-1.5 9h-11L5 6zm3 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {cantidadCarrito > 0 && <span className="barra-navegacion__badge">{cantidadCarrito}</span>}
        </Link>

        <Link to="/login" className="barra-navegacion__link barra-navegacion__link--accent">
          Acceder
        </Link>
      </div>
    </header>
  );
};

export default BarraNavegacion;
