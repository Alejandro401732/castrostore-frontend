// ============================================
// SERVICIO: Orden
// Funciones para consumir la API de ordenes
// ============================================

import api from './api';

export const crearOrden = async (items) => {
  const respuesta = await api.post('/ordenes', { items });
  return respuesta.data;
};

export const obtenerMisOrdenes = async () => {
  const respuesta = await api.get('/ordenes/mis-ordenes');
  return respuesta.data;
};
