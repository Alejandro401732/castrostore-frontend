import React from 'react';
import './TarjetaProductoSkeleton.css';

function TarjetaProductoSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__imagen" />
      <div className="skeleton-card__contenido">
        <div className="skeleton skeleton-card__titulo" />
        <div className="skeleton skeleton-card__linea" />
        <div className="skeleton skeleton-card__linea skeleton-card__linea--corta" />
        <div className="skeleton skeleton-card__precio" />
        <div className="skeleton skeleton-card__boton" />
      </div>
    </div>
  );
}

export function GridSkeleton({ cantidad = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: cantidad }).map((_, i) => (
        <TarjetaProductoSkeleton key={i} />
      ))}
    </div>
  );
}

export default TarjetaProductoSkeleton;
