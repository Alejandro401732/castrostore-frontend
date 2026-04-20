import React from 'react';

function TerminosServicio() {
  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Términos y Condiciones</h1>
      <p style={estilos.texto}>
        Al utilizar nuestra tienda, aceptas nuestras condiciones de venta y uso del sitio. Estas condiciones protegen tanto a
        los clientes como a nuestra plataforma para ofrecer una experiencia segura y confiable.
      </p>
      <h2 style={estilos.subtitulo}>Condiciones principales</h2>
      <ul style={estilos.lista}>
        <li>Los precios incluyen IVA y pueden cambiar sin previo aviso.</li>
        <li>Las entregas están sujetas a disponibilidad de stock.</li>
        <li>El uso del sitio debe respetar las leyes aplicables y no debe implicar fraudes.</li>
      </ul>
      <p style={estilos.texto}>
        Para cualquier duda sobre condiciones de compra o derechos del consumidor, contáctanos directamente.
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

export default TerminosServicio;
