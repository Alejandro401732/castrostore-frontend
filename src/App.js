import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import BarraNavegacion from './componentes/BarraNavegacion';
import Sidebar from './componentes/Sidebar';
import Footer from './componentes/Footer';
import ChatBot from './componentes/ChatBot';

import PaginaInicio from './paginas/PaginaInicio';

import { obtenerProductos } from './servicios/servicioProducto';
import resolverImagen from './utils/imagenesProductos';

// Code splitting: estas páginas se cargan solo cuando se visitan
const PaginaCarrito = lazy(() => import('./paginas/PaginaCarrito'));
const PaginaLogin = lazy(() => import('./paginas/PaginaLogin'));
const PoliticaPrivacidad = lazy(() => import('./paginas/PoliticaPrivacidad'));
const PoliticaDevoluciones = lazy(() => import('./paginas/PoliticaDevoluciones'));
const TerminosServicio = lazy(() => import('./paginas/TerminosServicio'));

const CACHE_KEY = 'castrostore_productos_v1';
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hora

function leerCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { productos, timestamp } = JSON.parse(raw);
    if (!productos || !timestamp) return null;
    return { productos, expirado: Date.now() - timestamp > CACHE_TTL_MS };
  } catch {
    return null;
  }
}

function guardarCache(productos) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ productos, timestamp: Date.now() }));
  } catch {
    // Ignore storage errors (quota, private mode, etc.)
  }
}

function mapearConImagen(productos) {
  return productos.map((p) => ({ ...p, imagen: resolverImagen(p.imagen) }));
}

function quitarImagen(productos) {
  return productos.map(({ imagen, ...resto }) => resto);
}

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
  }, []);

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
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState(null);

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
    // Estrategia stale-while-revalidate:
    // 1. Si hay cache, lo mostramos inmediatamente (instantáneo)
    // 2. En paralelo, pedimos datos frescos al backend
    // 3. Cuando lleguen, actualizamos la vista y el cache
    const cache = leerCache();
    if (cache) {
      setProductos(mapearConImagen(cache.productos));
      setCargandoProductos(false);
    }

    const cargarDesdeBackend = async () => {
      try {
        const respuesta = await obtenerProductos();
        const datosApi = respuesta.datos;
        guardarCache(quitarImagen(datosApi));
        setProductos(mapearConImagen(datosApi));
        setErrorProductos(null);
      } catch (error) {
        if (!cache) {
          setErrorProductos('No se pudieron cargar los productos. Intenta recargar la página.');
        }
      } finally {
        setCargandoProductos(false);
      }
    };
    cargarDesdeBackend();
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const itemExistente = carritoActual.find((item) => item.id === producto.id);
      if (itemExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
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
    setCarrito((carritoActual) => carritoActual.filter((item) => item.id !== productoId));
  };

  const vaciarCarrito = () => setCarrito([]);

  const scrollToProductos = () => {
    const seccion = document.getElementById('productos');
    if (seccion) seccion.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const manejarBuscar = (texto) => {
    setBusqueda(texto);
    setPaginaActual(1);
    scrollToProductos();
  };

  const manejarSeleccionCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setPaginaActual(1);
  };

  const manejarCambioPagina = (pagina) => {
    setPaginaActual(pagina);
    scrollToProductos();
  };

  const cantidadTotalCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);

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
        <Suspense fallback={<div style={estilos.suspenseFallback}>Cargando...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                <PaginaInicio
                  productos={productos}
                  cargando={cargandoProductos}
                  error={errorProductos}
                  agregarAlCarrito={agregarAlCarrito}
                  busqueda={busqueda}
                  categoriaSeleccionada={categoriaSeleccionada}
                  paginaActual={paginaActual}
                  onPageChange={manejarCambioPagina}
                  onSearchResults={setHayResultadosBusqueda}
                />
              }
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
            <Route path="/login" element={<PaginaLogin establecerUsuario={setUsuario} />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/politica-devoluciones" element={<PoliticaDevoluciones />} />
            <Route path="/terminos-servicio" element={<TerminosServicio />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <ChatBot productos={productos} />
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
  contenidoPrincipal: { flex: 1 },
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
  },
  iconoMensaje: { width: '20px', height: '20px', flexShrink: 0 },
  suspenseFallback: {
    padding: '60px 20px',
    textAlign: 'center',
    color: '#6b7280',
  },
};

export default App;
