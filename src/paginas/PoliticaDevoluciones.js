import React from 'react';

function PoliticaDevoluciones() {
  return (
    <div style={estilos.contenedor}>
      <h1 style={estilos.titulo}>Política de Devoluciones</h1>
      <p style={estilos.texto}>
        Queremos que tu compra sea perfecta. Si no estás satisfecho, puedes devolver tu pedido dentro de los 30 días
        posteriores a la entrega, siempre que el producto esté en condiciones originales.
      </p>
      <h2 style={estilos.subtitulo}>Cómo solicitar una devolución</h2>
      <ol style={estilos.lista}>
        <li>Contacta con nuestro equipo de soporte.</li>
        <li>Indica el número de pedido y motivo de la devolución.</li>
        <li>Empaca el producto en su embalaje original.</li>
      </ol>
      <p style={estilos.texto}>
        Una vez recibida la devolución, procesaremos el reembolso o el cambio según tu preferencia.
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

export default PoliticaDevoluciones;
