// ============================================
// PAGINA: Detalle de Producto
// Muestra la informacion completa de un producto
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductoPorId } from '../servicios/servicioProducto';
import formatearPrecio from '../utils/formatearPrecio';

const PaginaDetalleProducto = ({ agregarAlCarrito }) => {
  const { id } = useParams();
  const navegar = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const respuesta = await obtenerProductoPorId(id);
        setProducto(respuesta.datos);
      } catch (err) {
        setError('Producto no encontrado');
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [id]);

  const manejarAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(producto);
    }
    alert(`Se agregaron ${cantidad} unidad(es) de "${producto.nombre}" al carrito`);
  };

  if (cargando) return <div style={estilos.mensaje}>Cargando...</div>;
  if (error) return <div style={estilos.error}>{error}</div>;
  if (!producto) return null;

  return (
    <div style={estilos.contenedor}>
      <button onClick={() => navegar(-1)} style={estilos.botonVolver}>
        &larr; Volver
      </button>

      <div style={estilos.detalle}>
        <div style={estilos.imagenPlaceholder}>
          {producto.nombre.charAt(0).toUpperCase()}
        </div>

        <div style={estilos.info}>
          <h1 style={estilos.nombre}>{producto.nombre}</h1>
          <p style={estilos.descripcion}>
            {producto.descripcion || 'Sin descripcion disponible'}
          </p>
          <p style={estilos.precio}>{formatearPrecio(producto.precio)}</p>
          <p style={estilos.stock}>
            {producto.stock > 0
              ? `Disponible: ${producto.stock} unidades`
              : 'Producto agotado'}
          </p>

          {producto.stock > 0 && (
            <div style={estilos.controles}>
              <label style={estilos.etiqueta}>Cantidad:</label>
              <select
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                style={estilos.selector}
              >
                {Array.from(
                  { length: Math.min(producto.stock, 10) },
                  (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  )
                )}
              </select>
              <button onClick={manejarAgregar} style={estilos.botonAgregar}>
                Agregar al Carrito
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const estilos = {
  contenedor: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  botonVolver: {
    padding: '10px 20px',
    backgroundColor: '#ecf0f1',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '16px',
  },
  detalle: {
    display: 'flex',
    gap: '40px',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  imagenPlaceholder: {
    width: '350px',
    height: '350px',
    backgroundColor: '#3498db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '80px',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '8px',
    flexShrink: 0,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  descripcion: {
    color: '#7f8c8d',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  precio: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '10px',
  },
  stock: {
    fontSize: '14px',
    color: '#95a5a6',
    marginBottom: '25px',
  },
  controles: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  etiqueta: {
    fontSize: '16px',
    color: '#2c3e50',
  },
  selector: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  botonAgregar: {
    padding: '12px 30px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  mensaje: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#7f8c8d',
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#e74c3c',
  },
};

export default PaginaDetalleProducto;
