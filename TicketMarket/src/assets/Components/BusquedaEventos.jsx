
import { useState, useEffect } from 'react';
import { useEventos } from '../Context/EventosContext.jsx';

function BusquedaEventos() {
  const { eventos } = useEventos();

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todo');
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setCargando(false);
    }, 700);

    return () => clearTimeout(temporizador);
  }, []);

  const eventosFiltrados = eventos.filter((evento) => {
    const coincideNombre = (evento.titulo || '')
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === 'Todo' || evento.categoria === categoria;

    return coincideNombre && coincideCategoria;
  });

  if (cargando) {
    return <p>Cargando eventos...</p>;
  }

  return (
    <section className="busqueda-eventos">
      <div className="catalogo-encabezado">
        <h2>Descubre próximos eventos</h2>
        <p>Encuentra y disfruta de tus eventos favoritos.</p>
      </div>

      <div className="filtros-eventos">
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="Todo">Todas las categorías</option>
          <option value="Música">Música</option>
          <option value="Comedia">Comedia</option>
          <option value="Videojuegos">Videojuegos</option>
        </select>
      </div>

      {eventoSeleccionado ? (
        <article className="evento-detalle">
          {eventoSeleccionado.imagen ? (
            <img
              src={eventoSeleccionado.imagen}
              alt={eventoSeleccionado.titulo || 'Imagen del evento'}
              className="imagen-detalle"
            />
          ) : (
            <div className="imagen-sin-evento">
              Imagen no disponible
            </div>
          )}

          <h2>{eventoSeleccionado.titulo || 'Sin título'}</h2>
          <p>{eventoSeleccionado.descripcion || 'Sin descripción'}</p>
          <p>Fecha: {eventoSeleccionado.fecha || 'No especificada'}</p>
          <p>Hora: {eventoSeleccionado.hora || 'No especificada'}</p>
          <p>Lugar: {eventoSeleccionado.lugar || 'No especificado'}</p>
          <p>Categoría: {eventoSeleccionado.categoria || 'Sin categoría'}</p>
          <p>Estado: {eventoSeleccionado.estado || 'No especificado'}</p>

          <h3>Zonas y precios</h3>

          {eventoSeleccionado.zonas?.length > 0 ? (
            eventoSeleccionado.zonas.map((zona, indice) => (
              <p key={zona.id ?? indice}>
                {zona.nombre || 'Zona'} - $
                {Number(zona.precio || 0).toFixed(2)}
                {' '}Disponibles: {zona.disponibles ?? 0}
              </p>
            ))
          ) : (
            <p>No hay zonas registradas para este evento.</p>
          )}

          <button onClick={() => setEventoSeleccionado(null)}>
            Volver a eventos
          </button>
        </article>
      ) : (
        <>
          <div className="catalogo-titulo">
            <h3>
              {categoria === 'Todo' ? 'Todos los eventos' : categoria}
            </h3>
            <p>{eventosFiltrados.length} eventos encontrados</p>
          </div>

          {eventosFiltrados.length > 0 ? (
            <div className="eventos-grid">
              {eventosFiltrados.map((evento) => (
                <article className="evento-card" key={evento.id}>
                  {evento.imagen ? (
                    <img
                      src={evento.imagen}
                      alt={evento.titulo || 'Imagen del evento'}
                      className="imagen-evento"
                    />
                  ) : (
                    <div className="imagen-sin-evento">
                      Imagen no disponible
                    </div>
                  )}

                  <div className="evento-card-contenido">
                    <span className="evento-categoria">
                      {evento.categoria}
                    </span>

                    <h3>{evento.titulo}</h3>
                    <p>{evento.descripcion}</p>
                    <p>Fecha: {evento.fecha}</p>
                    <p>Lugar: {evento.lugar}</p>

                    <p className="evento-precio">
                      Desde $
                      {Number(evento.zonas?.[0]?.precio || 0).toFixed(2)}
                    </p>

                    <button
                      onClick={() => setEventoSeleccionado(evento)}
                    >
                      Ver detalles
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="sin-resultados">
              No se encontraron eventos.
            </p>
          )}
        </>
      )}
    </section>
  );
}

export default BusquedaEventos;
