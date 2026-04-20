// ============================================
// COMPONENTE: TarjetaProducto
// Muestra la informacion de un producto en formato tarjeta
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import formatearPrecio from '../utils/formatearPrecio';
import './TarjetaProducto.css';

const TarjetaProducto = ({ producto, agregarAlCarrito, seleccionado, onSeleccionar }) => {
  const [visible, setVisible] = useState(false);
  const referencia = useRef(null);

  useEffect(() => {
    const nodo = referencia.current;
    if (!nodo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(nodo);
    return () => observer.disconnect();
  }, []);

  return (
      <div
        ref={referencia}
        className={`tarjeta-producto${seleccionado ? ' seleccionado' : ''}`}
        style={{ transform: visible ? 'translateY(0)' : 'translateY(28px)', opacity: visible ? 1 : 0 }}
        onClick={onSeleccionar}
      >
      <img className="tarjeta-producto__imagen" src={producto.imagen} alt={producto.nombre} loading="lazy" decoding="async" />

      <div className="tarjeta-producto__contenido">
        <div className="tarjeta-producto__info">
          <h3 className="tarjeta-producto__nombre">{producto.nombre}</h3>
          <div className="tarjeta-producto__descripcion-contenedor">
            <p className="tarjeta-producto__descripcion">
              {producto.descripcion || 'Sin descripción'}
            </p>
          </div>
          <div className="tarjeta-producto__detalles">
            <p className="tarjeta-producto__precio">{formatearPrecio(producto.precio)}</p>
            <p className="tarjeta-producto__stock">
              {producto.stock > 0 ? `En stock: ${producto.stock} unidades` : 'Agotado'}
            </p>
          </div>
        </div>

        <div className="tarjeta-producto__footer">
          <button
            className="tarjeta-producto__boton tarjeta-producto__agregar"
            onClick={(event) => {
              event.stopPropagation();
              agregarAlCarrito(producto);
            }}
            disabled={producto.stock <= 0}
            type="button"
          >
            <svg
              className="tarjeta-producto__btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            Agregar al Carrito
          </button>
        </div>
      </div>
      </div>
  );
};

export default TarjetaProducto;
