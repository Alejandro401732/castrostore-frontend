import React, { useEffect, useMemo, useState } from 'react';
import ProductGrid from '../componentes/ProductGrid';
import Pagination from '../componentes/Pagination';
import HeroBanner from '../componentes/HeroBanner';

const ITEMS_POR_PAGINA = 12;

const PaginaInicio = ({
  productos,
  cargando,
  error,
  agregarAlCarrito,
  busqueda,
  categoriaSeleccionada,
  paginaActual,
  onPageChange,
  onSearchResults,
}) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return productos.filter((producto) => {
      const coincideCategoria = categoriaSeleccionada === 'Todas' || producto.categoria === categoriaSeleccionada;
      const coincideBusqueda = producto.nombre.toLowerCase().includes(termino);
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, busqueda, categoriaSeleccionada]);

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA));
  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * ITEMS_POR_PAGINA;
  const productosPagina = productosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      onPageChange(totalPaginas);
    }
  }, [paginaActual, totalPaginas, onPageChange]);

  useEffect(() => {
    if (typeof onSearchResults === 'function') {
      onSearchResults(busqueda.trim() ? productosFiltrados.length > 0 : true);
    }
  }, [busqueda, productosFiltrados.length, onSearchResults]);

  return (
    <>
      <HeroBanner />
      <section style={estilos.seccion}>
        <div style={estilos.contenedor} id="productos">
          <div style={estilos.headerTitulo}>
            <div>
              <p style={estilos.subtitulo}>¡Bienvenido a CastroStore!</p>
              <h1 style={estilos.titulo}>Encuentra tu próximo producto</h1>
            </div>
            <div style={estilos.filtroResumen}>
              <span style={estilos.categoriaEtiqueta}>{categoriaSeleccionada}</span>
              <span style={estilos.resultadoTexto}>
                {productosFiltrados.length} productos disponibles
              </span>
            </div>
          </div>

          {cargando ? (
            <div style={estilos.mensaje}>Cargando productos...</div>
          ) : error ? (
            <div style={{ ...estilos.mensaje, color: '#e74c3c' }}>{error}</div>
          ) : productosPagina.length === 0 ? (
            <div style={estilos.mensaje}>
              {busqueda.trim()
                ? 'Producto no disponible. Intenta otra búsqueda.'
                : 'No se encontraron productos con esa búsqueda.'}
            </div>
          ) : (
            <ProductGrid
              productos={productosPagina}
              agregarAlCarrito={agregarAlCarrito}
              productoSeleccionado={productoSeleccionado}
              onSeleccionar={setProductoSeleccionado}
            />
          )}

          <Pagination
            paginaActual={paginaSegura}
            totalPaginas={totalPaginas}
            onPageChange={onPageChange}
          />
        </div>
      </section>
    </>
  );
};

const estilos = {
  seccion: {
    width: '100%',
    padding: '44px 24px 72px',
    backgroundColor: '#f8f9fb',
  },
  contenedor: {
    width: 'clamp(320px, 92%, 1200px)',
    margin: '0 auto',
    borderRadius: '32px',
    backgroundColor: '#ffffff',
    padding: '36px 32px',
    boxShadow: '0 25px 80px rgba(15, 23, 42, 0.08)',
  },
  headerTitulo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '28px',
    flexWrap: 'wrap',
  },
  titulo: {
    margin: '0 0 8px',
    fontSize: '2.5rem',
    color: '#111827',
    lineHeight: 1.05,
  },
  subtitulo: {
    margin: 0,
    color: '#4b5563',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
  },
  filtroResumen: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  categoriaEtiqueta: {
    display: 'inline-flex',
    padding: '10px 18px',
    backgroundColor: '#eef2ff',
    color: '#4338ca',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  resultadoTexto: {
    color: '#6b7280',
    fontSize: '0.95rem',
  },
  mensaje: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1rem',
  },
};

export default PaginaInicio;
