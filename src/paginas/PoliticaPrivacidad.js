import React from 'react';

function PoliticaPrivacidad() {
  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Política de Privacidad</h1>
      <p style={estilos.texto}>
        En nuestra tienda valoramos tu privacidad. Recopilamos solo los datos necesarios para procesar tus pedidos
        y mejorar tu experiencia de compra. No compartimos tu información personal con terceros sin tu permiso.
      </p>
      <h2 style={estilos.subtitulo}>Datos que recopilamos</h2>
      <ul style={estilos.lista}>
        <li>Nombre y datos de contacto</li>
        <li>Dirección de envío y facturación</li>
        <li>Información de pago segura</li>
      </ul>
      <p style={estilos.texto}>
        Si tienes alguna pregunta sobre cómo usamos tus datos, contáctanos a través de nuestros canales de atención.
      </p>
    </div>
  );
}

const estilos = {
  contenedor: {
    maxWidth: '980px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  titulo: {
    color: '#2d3b52',
    marginBottom: '18px',
  },
  subtitulo: {
    color: '#2f4b74',
    marginTop: '24px',
    marginBottom: '12px',
  },
  texto: {
    color: '#515f75',
    lineHeight: '1.75',
    marginBottom: '16px',
    fontSize: '1rem',
  },
  lista: {
    color: '#515f75',
    lineHeight: '1.8',
    marginLeft: '20px',
    marginBottom: '16px',
  },
};

export default PoliticaPrivacidad;
