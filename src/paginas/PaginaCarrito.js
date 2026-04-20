import React from 'react';
import { useNavigate } from 'react-router-dom';
import { crearOrden } from '../servicios/servicioOrden';
import formatearPrecio from '../utils/formatearPrecio';
import './PaginaCarrito.css';

const PaginaCarrito = ({ carrito, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, usuario }) => {
  const navegar = useNavigate();

  const totalCarrito = carrito.reduce(
    (suma, item) => suma + parseFloat(item.precio) * item.cantidad,
    0
  );

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
      <div className="carrito__vacio">
        <h2>Tu carrito esta vacio</h2>
        <p>Agrega productos desde nuestra tienda</p>
        <button onClick={() => navegar('/')} className="carrito__boton-ir">
          Ir a la Tienda
        </button>
      </div>
    );
  }

  return (
    <div className="carrito__contenedor">
      <h1 className="carrito__titulo">Carrito de Compras</h1>

      <div className="carrito__lista">
        {carrito.map((item) => (
          <div key={item.id} className="carrito__item">
            <div className="carrito__info-item">
              <h3 className="carrito__nombre-item">{item.nombre}</h3>
              <p className="carrito__precio-item">{formatearPrecio(item.precio)} c/u</p>
            </div>

            <div className="carrito__controles">
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                className="carrito__boton-cantidad"
                disabled={item.cantidad <= 1}
              >
                -
              </button>
              <span className="carrito__cantidad">{item.cantidad}</span>
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                className="carrito__boton-cantidad"
              >
                +
              </button>
            </div>

            <p className="carrito__subtotal">
              {formatearPrecio(parseFloat(item.precio) * item.cantidad)}
            </p>

            <button
              onClick={() => eliminarDelCarrito(item.id)}
              className="carrito__boton-eliminar"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="carrito__resumen">
        <div className="carrito__total-linea">
          <span className="carrito__total-texto">Total:</span>
          <span className="carrito__total-precio">{formatearPrecio(totalCarrito)}</span>
        </div>
        <button onClick={procesarCompra} className="carrito__boton-comprar">
          Procesar Compra
        </button>
        <button onClick={vaciarCarrito} className="carrito__boton-vaciar">
          Vaciar Carrito
        </button>
      </div>
    </div>
  );
};

export default PaginaCarrito;
