import React from 'react';
import './Pagination.css';

const Pagination = ({ paginaActual, totalPaginas, onPageChange }) => {
  const paginas = Array.from({ length: totalPaginas }, (_, index) => index + 1);

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination__boton"
        onClick={() => onPageChange(paginaActual - 1)}
        disabled={paginaActual === 1}
      >
        ←
      </button>

      <div className="pagination__numeros">
        {paginas.map((numero) => (
          <button
            key={numero}
            type="button"
            className={`pagination__numero ${paginaActual === numero ? 'pagination__numero--activo' : ''}`}
            onClick={() => onPageChange(numero)}
          >
            {numero}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination__boton"
        onClick={() => onPageChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
