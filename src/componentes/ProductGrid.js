import React from 'react';
import TarjetaProducto from './TarjetaProducto';
import './ProductGrid.css';

const ProductGrid = ({ productos, agregarAlCarrito, productoSeleccionado, onSeleccionar }) => {
  return (
    <div className="product-grid">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          producto={producto}
          agregarAlCarrito={agregarAlCarrito}
          seleccionado={productoSeleccionado === producto.id}
          onSeleccionar={() => onSeleccionar(producto.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
