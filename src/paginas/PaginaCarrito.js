// ============================================
// PAGINA: Carrito de Compras
// Muestra los productos en el carrito y permite crear una orden
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { crearOrden } from '../servicios/servicioOrden';
import formatearPrecio from '../utils/formatearPrecio';

const PaginaCarrito = ({ carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, usuario }) => {
  const navegar = useNavigate();

  // Calcula el total del carrito
  const totalCarrito = carrito.reduce(
    (suma, item) => suma + parseFloat(item.precio) * item.cantidad,
    0
  );

  // Procesa la compra creando una orden
  const procesarCompra = async () => {
    if (!usuario) {
      alert('Debes iniciar sesion para realizar una compra');
      navegar('/login');
      return;
    }

    try {
      const items = carrito.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad,
      }));

      const respuesta = await crearOrden(items);

      if (respuesta.exito) {
        alert('Orden creada exitosamente. Gracias por tu compra!');
        vaciarCarrito();
        navegar('/');
      }
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al procesar la compra';
      alert(mensaje);
    }
  };

  if (carrito.length === 0) {
    return (
      <div style={estilos.vacio}>
        <h2>Tu carrito esta vacio</h2>
        <p>Agrega productos desde nuestra tienda</p>
        <button onClick={() => navegar('/')} style={estilos.botonIrATienda}>
          Ir a la Tienda
        </button>
      </div>
    );
  }

  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Carrito de Compras</h1>

      <div style={estilos.listaItems}>
        {carrito.map((item) => (
          <div key={item.id} style={estilos.item}>
            <div style={estilos.infoItem}>
              <h3 style={estilos.nombreItem}>{item.nombre}</h3>
              <p style={estilos.precioItem}>
                {formatearPrecio(item.precio)} c/u
              </p>
            </div>

            <div style={estilos.controlesItem}>
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                style={estilos.botonCantidad}
                disabled={item.cantidad <= 1}
              >
                -
              </button>
              <span style={estilos.cantidad}>{item.cantidad}</span>
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                style={estilos.botonCantidad}
              >
                +
              </button>
            </div>

            <p style={estilos.subtotal}>
              {formatearPrecio(parseFloat(item.precio) * item.cantidad)}
            </p>

            <button
              onClick={() => eliminarDelCarrito(item.id)}
              style={estilos.botonEliminar}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div style={estilos.resumen}>
        <div style={estilos.totalLinea}>
          <span style={estilos.totalTexto}>Total:</span>
          <span style={estilos.totalPrecio}>{formatearPrecio(totalCarrito)}</span>
        </div>
        <button onClick={procesarCompra} style={estilos.botonComprar}>
          Procesar Compra
        </button>
        <button onClick={vaciarCarrito} style={estilos.botonVaciar}>
          Vaciar Carrito
        </button>
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
  titulo: {
    color: '#2c3e50',
    marginBottom: '25px',
  },
  vacio: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#7f8c8d',
  },
  botonIrATienda: {
    padding: '12px 30px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '15px',
  },
  listaItems: {
    marginBottom: '30px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    gap: '20px',
  },
  infoItem: {
    flex: 1,
  },
  nombreItem: {
    margin: '0 0 5px 0',
    color: '#2c3e50',
  },
  precioItem: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '14px',
  },
  controlesItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  botonCantidad: {
    width: '35px',
    height: '35px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '18px',
  },
  cantidad: {
    fontSize: '18px',
    fontWeight: 'bold',
    minWidth: '30px',
    textAlign: 'center',
  },
  subtotal: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#27ae60',
    minWidth: '100px',
    textAlign: 'right',
  },
  botonEliminar: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resumen: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  totalLinea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #ecf0f1',
  },
  totalTexto: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalPrecio: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  botonComprar: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  botonVaciar: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#ecf0f1',
    color: '#7f8c8d',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default PaginaCarrito;
