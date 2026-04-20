import React, { useState, useRef, useEffect } from 'react';
import { productosMock, categorias } from '../mocks/productosMock';
import formatearPrecio from '../utils/formatearPrecio';
import './ChatBot.css';

const SUGERENCIAS = ['Audífonos', 'Deportes', 'Envío', 'Precio bajo', 'Ofertas'];

function buscarRespuesta(texto) {
  const msg = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const delay = 400 + Math.random() * 600;

  // Saludos
  if (/^(hola|hey|buenas|que tal|parcero|parce|quiubo|buenos dias|buenas tardes|buenas noches)/.test(msg)) {
    return { delay, respuesta: '¡Hola, parcero! Bienvenido a CastroStore. ¿En qué te puedo ayudar hoy? Podés preguntarme por productos, categorías, precios o envíos.', productos: [] };
  }

  // Despedidas
  if (/^(gracias|chao|adios|nos vemos|listo|vale)/.test(msg)) {
    return { delay, respuesta: '¡Con mucho gusto, parce! Si necesitás algo más, aquí estoy. ¡Que te vaya bien!' , productos: [] };
  }

  // Envío
  if (/envio|envío|despacho|domicilio|entrega/.test(msg)) {
    return { delay, respuesta: 'Hacemos envíos a todo Colombia. En Medellín el envío es gratis en compras mayores a $150.000 COP y llega en 1-2 días hábiles. Para el resto del país, de 3 a 5 días hábiles.', productos: [] };
  }

  // Devoluciones
  if (/devolucion|devolver|cambio|garantia/.test(msg)) {
    return { delay, respuesta: 'Tenés 30 días para devoluciones o cambios desde la fecha de entrega. El producto debe estar sin usar y en su empaque original. La garantía cubre defectos de fábrica por 1 año.', productos: [] };
  }

  // Pagos
  if (/pago|pagar|tarjeta|nequi|daviplata|efectivo|metodo/.test(msg)) {
    return { delay, respuesta: 'Aceptamos tarjetas de crédito/débito, PSE, Nequi, Daviplata y pago contra entrega en Medellín. Todas las transacciones son seguras.', productos: [] };
  }

  // Horario / contacto
  if (/horario|atencion|contacto|telefono|whatsapp/.test(msg)) {
    return { delay, respuesta: 'Nuestro horario de atención es de lunes a sábado, 8:00am a 6:00pm. También podés escribirnos por WhatsApp o redes sociales.', productos: [] };
  }

  // Precio bajo / barato / económico
  if (/barato|economico|precio bajo|mas barato|oferta|promocion/.test(msg)) {
    const baratos = [...productosMock].sort((a, b) => a.precio - b.precio).slice(0, 4);
    return { delay, respuesta: '¡Mirá estos productos con los mejores precios, parcero!', productos: baratos };
  }

  // Precio alto / caro / premium
  if (/caro|premium|mejor|lujo|precio alto|mas caro|top/.test(msg)) {
    const caros = [...productosMock].sort((a, b) => b.precio - a.precio).slice(0, 4);
    return { delay, respuesta: 'Estos son nuestros productos premium, lo mejor de lo mejor:', productos: caros };
  }

  // Nuevo / reciente
  if (/nuevo|reciente|novedad|llegada/.test(msg)) {
    const nuevos = productosMock.slice(-4);
    return { delay, respuesta: '¡Mirá las últimas novedades que tenemos, parce!', productos: nuevos };
  }

  // Buscar por categoría
  const categoriaEncontrada = categorias.find(cat => {
    if (cat === 'Todas') return false;
    const catNorm = cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return msg.includes(catNorm) || catNorm.includes(msg.replace(/\s/g, ''));
  });

  if (categoriaEncontrada) {
    const productosCat = productosMock.filter(p => p.categoria === categoriaEncontrada).slice(0, 4);
    return { delay, respuesta: `¡Tenemos estos productos de ${categoriaEncontrada}!`, productos: productosCat };
  }

  // Buscar por nombre de producto
  const productosEncontrados = productosMock.filter(p => {
    const nombre = p.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const desc = p.descripcion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return nombre.includes(msg) || msg.split(' ').some(word => word.length > 2 && (nombre.includes(word) || desc.includes(word)));
  });

  if (productosEncontrados.length > 0) {
    const mostrar = productosEncontrados.slice(0, 4);
    return { delay, respuesta: `¡Encontré ${productosEncontrados.length} producto${productosEncontrados.length > 1 ? 's' : ''} relacionados!`, productos: mostrar };
  }

  // Stock
  if (/stock|disponible|hay|queda/.test(msg)) {
    return { delay, respuesta: 'Todos nuestros productos muestran su disponibilidad. Escribime el nombre de lo que buscás y te digo si está disponible.', productos: [] };
  }

  // Respuesta por defecto
  return { delay, respuesta: 'No entendí muy bien, parce. Podés preguntarme por:\n- Nombre de un producto (ej: "audífonos")\n- Una categoría (ej: "deportes")\n- Precios bajos o premium\n- Envíos, devoluciones o pagos', productos: [] };
}

function ChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [mensajes, setMensajes] = useState([
    { tipo: 'bot', texto: '¡Hola, parcero! Soy el asistente de CastroStore. ¿Qué estás buscando hoy?', productos: [] }
  ]);
  const [input, setInput] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const refMensajes = useRef(null);
  const refInput = useRef(null);

  useEffect(() => {
    if (refMensajes.current) {
      refMensajes.current.scrollTop = refMensajes.current.scrollHeight;
    }
  }, [mensajes, escribiendo]);

  useEffect(() => {
    if (abierto && refInput.current) {
      refInput.current.focus();
    }
  }, [abierto]);

  const toggleChat = () => {
    if (abierto) {
      setCerrando(true);
      setTimeout(() => {
        setAbierto(false);
        setCerrando(false);
      }, 250);
    } else {
      setAbierto(true);
    }
  };

  const enviarMensaje = (texto) => {
    const msg = (texto || input).trim();
    if (!msg) return;

    setMensajes(prev => [...prev, { tipo: 'usuario', texto: msg, productos: [] }]);
    setInput('');
    setEscribiendo(true);

    const { delay, respuesta, productos } = buscarRespuesta(msg);

    setTimeout(() => {
      setEscribiendo(false);
      setMensajes(prev => [...prev, { tipo: 'bot', texto: respuesta, productos }]);
    }, delay);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    enviarMensaje();
  };

  // Ícono de muñeco con auriculares
  const iconoSoporte = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12v5a3 3 0 003 3h1a2 2 0 002-2v-3a2 2 0 00-2-2H5v-1a7 7 0 0114 0v1h-1a2 2 0 00-2 2v3a2 2 0 002 2h1a3 3 0 003-3v-5c0-5.52-4.48-10-10-10z" fill="currentColor"/>
      <circle cx="12" cy="10" r="3" fill="currentColor" opacity="0.5"/>
      <path d="M9 16c0 0 1.5 2 3 2s3-2 3-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );

  return (
    <>
      {/* Botón flotante */}
      <button className="chatbot__boton" onClick={toggleChat} aria-label="Abrir chat de soporte" type="button">
        {abierto ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : iconoSoporte}
      </button>

      {/* Ventana del chat */}
      {abierto && (
        <div className={`chatbot__ventana ${cerrando ? 'chatbot__ventana--cerrado' : ''}`}>
          {/* Header */}
          <div className="chatbot__header">
            <div className="chatbot__header-icono">{iconoSoporte}</div>
            <div className="chatbot__header-info">
              <h4 className="chatbot__header-titulo">Asistente CastroStore</h4>
              <p className="chatbot__header-estado">En línea</p>
            </div>
            <button className="chatbot__header-cerrar" onClick={toggleChat} type="button" aria-label="Cerrar chat">
              &times;
            </button>
          </div>

          {/* Mensajes */}
          <div className="chatbot__mensajes" ref={refMensajes}>
            {mensajes.map((msg, i) => (
              <div key={i} className={`chatbot__mensaje chatbot__mensaje--${msg.tipo}`}>
                <span>{msg.texto}</span>
                {msg.productos && msg.productos.length > 0 && (
                  <div>
                    {msg.productos.map(p => (
                      <div key={p.id} className="chatbot__producto">
                        <img className="chatbot__producto-img" src={p.imagen} alt={p.nombre} />
                        <div className="chatbot__producto-info">
                          <p className="chatbot__producto-nombre">{p.nombre}</p>
                          <p className="chatbot__producto-precio">{formatearPrecio(p.precio)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {msg.tipo === 'bot' && i === 0 && (
                  <div className="chatbot__sugerencias">
                    {SUGERENCIAS.map(s => (
                      <button key={s} className="chatbot__sugerencia" type="button" onClick={() => enviarMensaje(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {escribiendo && (
              <div className="chatbot__escribiendo">
                <span className="chatbot__punto" />
                <span className="chatbot__punto" />
                <span className="chatbot__punto" />
              </div>
            )}
          </div>

          {/* Input */}
          <form className="chatbot__input-area" onSubmit={manejarEnvio}>
            <input
              ref={refInput}
              className="chatbot__input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu pregunta..."
              disabled={escribiendo}
            />
            <button className="chatbot__enviar" type="submit" disabled={!input.trim() || escribiendo} aria-label="Enviar mensaje">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;
