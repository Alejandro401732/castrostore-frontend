// ============================================
// APP.JS - Componente principal de la aplicacion
// Maneja el enrutamiento, estado global del carrito y usuario
// ============================================

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Componentes
import BarraNavegacion from './componentes/BarraNavegacion';
import Sidebar from './componentes/Sidebar';

// Paginas
import PaginaInicio from './paginas/PaginaInicio';
import PaginaDetalleProducto from './paginas/PaginaDetalleProducto';
import PaginaCarrito from './paginas/PaginaCarrito';
import PaginaLogin from './paginas/PaginaLogin';
import PoliticaPrivacidad from './paginas/PoliticaPrivacidad';
import PoliticaDevoluciones from './paginas/PoliticaDevoluciones';
import TerminosServicio from './paginas/TerminosServicio';
import Footer from './componentes/Footer';
import ChatBot from './componentes/ChatBot';

function ReloadRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const navEntries = performance.getEntriesByType ? performance.getEntriesByType('navigation') : [];
    const isReload = navEntries.length
      ? navEntries[0].type === 'reload'
      : performance.navigation && performance.navigation.type === 1;

    if (isReload && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, []); // Solo al montar: redirige a inicio si la página se recargó

  return null;
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [paginaActual, setPaginaActual] = useState(1);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [hayResultadosBusqueda, setHayResultadosBusqueda] = useState(true);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }

    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const itemExistente = carritoActual.find((item) => item.id === producto.id);

      if (itemExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...carritoActual, { ...producto, cantidad: 1 }];
    });
    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.id !== productoId)
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const manejarBuscar = (texto) => {
    setBusqueda(texto);
    setPaginaActual(1);

    const seccionProductos = document.getElementById('productos');
    if (seccionProductos) {
      seccionProductos.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const manejarSeleccionCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setPaginaActual(1);
  };

  const scrollToProductos = () => {
    const seccionProductos = document.getElementById('productos');
    if (seccionProductos) {
      seccionProductos.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const cantidadTotalCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  return (
    <div style={estilos.aplicacion}>
      <ReloadRedirect />

      {mostrarMensaje && (
        <div style={estilos.mensajeAgregado}>
          <svg style={estilos.iconoMensaje} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Producto agregado al carrito
        </div>
      )}

      <BarraNavegacion
        cantidadCarrito={cantidadTotalCarrito}
        busqueda={busqueda}
        hayResultadosBusqueda={hayResultadosBusqueda}
        onBuscar={manejarBuscar}
        onAbrirSidebar={() => setSidebarAbierto(true)}
      />

      <Sidebar
        abierto={sidebarAbierto}
        categoriaSeleccionada={categoriaSeleccionada}
        onCategoriaSeleccionada={manejarSeleccionCategoria}
        onCerrar={() => setSidebarAbierto(false)}
        onScrollProductos={scrollToProductos}
      />

      <main style={estilos.contenidoPrincipal}>
        <Routes>
          <Route
            path="/"
            element={
              <PaginaInicio
                agregarAlCarrito={agregarAlCarrito}
                busqueda={busqueda}
                categoriaSeleccionada={categoriaSeleccionada}
                paginaActual={paginaActual}
                onPageChange={(pagina) => {
                  setPaginaActual(pagina);
                  const seccion = document.getElementById('productos');
                  if (seccion) {
                    seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                onSearchResults={setHayResultadosBusqueda}
              />
            }
          />
          <Route
            path="/producto/:id"
            element={<PaginaDetalleProducto agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route
            path="/carrito"
            element={
              <PaginaCarrito
                carrito={carrito}
                actualizarCantidad={actualizarCantidad}
                eliminarDelCarrito={eliminarDelCarrito}
                vaciarCarrito={vaciarCarrito}
                usuario={usuario}
              />
            }
          />
          <Route
            path="/login"
            element={<PaginaLogin establecerUsuario={setUsuario} />}
          />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/politica-devoluciones" element={<PoliticaDevoluciones />} />
          <Route path="/terminos-servicio" element={<TerminosServicio />} />
        </Routes>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}

const estilos = {
  aplicacion: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    color: '#111827',
    fontFamily: 'Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  contenidoPrincipal: {
    flex: 1,
  },
  mensajeAgregado: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    zIndex: 1000,
    opacity: 1,
    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
  },
  iconoMensaje: {
    width: '20px',
    height: '20px',
    flexShrink: 0,
  },
};

export default App;
