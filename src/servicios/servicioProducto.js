import api from './api';

export const obtenerProductos = async () => {
  const respuesta = await api.get('/productos');
  return respuesta.data;
};
