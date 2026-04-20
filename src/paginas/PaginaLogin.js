// ============================================
// PAGINA: Login / Registro
// Formularios para iniciar sesion y registrarse
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesion, registrarUsuario } from '../servicios/servicioUsuario';

const PaginaLogin = ({ establecerUsuario }) => {
  const navegar = useNavigate();
  const [esRegistro, setEsRegistro] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
  });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      let respuesta;

      if (esRegistro) {
        respuesta = await registrarUsuario(formulario);
      } else {
        respuesta = await iniciarSesion({
          correo: formulario.correo,
          contrasena: formulario.contrasena,
        });
      }

      if (respuesta.exito) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', respuesta.datos.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.datos.usuario));
        establecerUsuario(respuesta.datos.usuario);
        navegar('/');
      }
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al procesar la solicitud';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.formularioContenedor}>
        <h2 style={estilos.titulo}>
          {esRegistro ? 'Crear Cuenta' : 'Iniciar Sesion'}
        </h2>

        {error && <div style={estilos.error}>{error}</div>}

        <form onSubmit={manejarEnvio}>
          {esRegistro && (
            <div style={estilos.campo}>
              <label style={estilos.etiqueta}>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Tu nombre completo"
                style={estilos.entrada}
                required
              />
            </div>
          )}

          <div style={estilos.campo}>
            <label style={estilos.etiqueta}>Correo Electronico</label>
            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="tu@correo.com"
              style={estilos.entrada}
              required
            />
          </div>

          <div style={estilos.campo}>
            <label style={estilos.etiqueta}>Contrasena</label>
            <input
              type="password"
              name="contrasena"
              value={formulario.contrasena}
              onChange={manejarCambio}
              placeholder="Minimo 6 caracteres"
              style={estilos.entrada}
              required
              minLength={6}
            />
          </div>

          <button type="submit" style={estilos.botonEnviar} disabled={cargando}>
            {cargando
              ? 'Procesando...'
              : esRegistro
              ? 'Registrarse'
              : 'Iniciar Sesion'}
          </button>
        </form>

        <p style={estilos.cambiarModo}>
          {esRegistro ? 'Ya tienes cuenta?' : 'No tienes cuenta?'}{' '}
          <button
            onClick={() => {
              setEsRegistro(!esRegistro);
              setError(null);
            }}
            style={estilos.enlaceCambiar}
          >
            {esRegistro ? 'Inicia Sesion' : 'Registrate'}
          </button>
        </p>
      </div>
    </div>
  );
};

const estilos = {
  contenedor: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#f5f6fa',
  },
  formularioContenedor: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  titulo: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '25px',
  },
  error: {
    padding: '12px',
    backgroundColor: '#fde8e8',
    color: '#e74c3c',
    borderRadius: '4px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  campo: {
    marginBottom: '20px',
  },
  etiqueta: {
    display: 'block',
    marginBottom: '6px',
    color: '#2c3e50',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  entrada: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  botonEnviar: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  cambiarModo: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#7f8c8d',
  },
  enlaceCambiar: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
};

export default PaginaLogin;
