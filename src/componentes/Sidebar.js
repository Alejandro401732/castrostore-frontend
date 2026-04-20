import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const categorias = [
  'Todas',
  'Electrónica',
  'Ropa y accesorios',
  'Hogar y cocina',
  'Deportes',
  'Juguetes y juegos',
  'Belleza y cuidado personal',
  'Salud y bienestar',
  'Libros',
];

const Sidebar = ({ abierto, categoriaSeleccionada, onCategoriaSeleccionada, onCerrar, onScrollProductos }) => {
  const navigate = useNavigate();

  const seleccionarCategoria = (categoria) => {
    onCategoriaSeleccionada(categoria);
    navigate('/');
    onCerrar();
    setTimeout(() => {
      if (typeof onScrollProductos === 'function') {
        onScrollProductos();
      }
    }, 160);
  };

  return (
    <>
      <div
        className={`sidebar__overlay ${abierto ? 'sidebar__overlay--visible' : ''}`}
        onClick={onCerrar}
      />
      <aside className={`sidebar ${abierto ? 'sidebar--open' : ''}`}>
        <div className="sidebar__cabecera">
          <div>
            <span className="sidebar__logo">CastroStore</span>
            <p className="sidebar__subtitulo">Explora por categoría</p>
          </div>
          <button className="sidebar__cerrar" type="button" onClick={onCerrar} aria-label="Cerrar menú">
            ×
          </button>
        </div>

        <nav className="sidebar__nav">
          <button type="button" className="sidebar__inicio" onClick={() => seleccionarCategoria('Todas')}>
            🏠 Inicio
          </button>
          <div className="sidebar__separador">Categorías</div>
          <div className="sidebar__lista">
            {categorias.map((categoria) => (
              <button
                type="button"
                key={categoria}
                className={`sidebar__item ${categoriaSeleccionada === categoria ? 'sidebar__item--activo' : ''}`}
                onClick={() => seleccionarCategoria(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
