// ============================================
// SERVICIO: Usuario
// Funciones para consumir la API de usuarios
// ============================================

import api from './api';

export const registrarUsuario = async (datos) => {
  const respuesta = await api.post('/usuarios/registro', datos);
  return respuesta.data;
};

export const iniciarSesion = async (datos) => {
  const respuesta = await api.post('/usuarios/login', datos);
  return respuesta.data;
};

export const obtenerPerfil = async () => {
  const respuesta = await api.get('/usuarios/perfil');
  return respuesta.data;
};
