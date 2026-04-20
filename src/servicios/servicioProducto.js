// ============================================
// SERVICIO: Producto
// Funciones para consumir la API de productos
// ============================================

import api from './api';

export const obtenerProductos = async () => {
  const respuesta = await api.get('/productos');
  return respuesta.data;
};

export const obtenerProductoPorId = async (id) => {
  const respuesta = await api.get(`/productos/${id}`);
  return respuesta.data;
};
