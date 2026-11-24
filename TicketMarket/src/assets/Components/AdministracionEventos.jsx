

import { useState } from 'react';
import { useEventos } from '../Context/EventosContext.jsx';

function AdministracionEventos() {
  const { eventos, dispatch } = useEventos();

  const formularioInicial = {
    titulo: '',
    descripcion: '',
    categoria: 'Música',
    fecha: '',
    hora: '',
    lugar: '',
    estado: 'Disponible',
    imagen: '',
    zonas: [
      { nombre: 'General', precio: 15, disponibles: 100 }
    ]
  };

  const [formulario, setFormulario] = useState(formularioInicial);
  const [eventoEditando, setEventoEditando] = useState(null);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const manejarImagen = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      alert('Selecciona un archivo de imagen válido.');
      e.target.value = '';
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2 MB.');
      e.target.value = '';
      return;
    }

    const lector = new FileReader();

    lector.onloadend = () => {
      setFormulario((anterior) => ({
        ...anterior,
        imagen: lector.result
      }));
    };

    lector.readAsDataURL(archivo);
  };

  const manejarCambioZona = (index, campo, valor) => {
    const nuevasZonas = [...formulario.zonas];

    nuevasZonas[index] = {
      ...nuevasZonas[index],
      [campo]: valor
    };

    setFormulario({
      ...formulario,
      zonas: nuevasZonas
    });
  };

  const agregarZona = () => {
    setFormulario({
      ...formulario,
      zonas: [
        ...formulario.zonas,
        { nombre: '', precio: 0, disponibles: 0 }
      ]
    });
  };

  const eliminarZona = (index) => {
    setFormulario({
      ...formulario,
      zonas: formulario.zonas.filter((_, i) => i !== index)
    });
  };

  const cancelarEdicion = () => {
    setEventoEditando(null);
    setFormulario(formularioInicial);
  };

  const guardarEvento = (e) => {
    e.preventDefault();

    const evento = {
      ...formulario,
      id: eventoEditando
        ? eventoEditando.id
        : Math.max(0, ...eventos.map((item) => item.id)) + 1,
      zonas: formulario.zonas.map((zona, index) => ({
        ...zona,
        id: index + 1,
        precio: Number(zona.precio),
        disponibles: Number(zona.disponibles)
      }))
    };

    dispatch({
      type: eventoEditando ? 'ACTUALIZAR_EVENTO' : 'AGREGAR_EVENTO',
      payload: evento
    });

    cancelarEdicion();
  };

  const editarEvento = (evento) => {
    setEventoEditando(evento);

    setFormulario({
      ...evento,
      imagen: evento.imagen || '',
      zonas: evento.zonas.map((zona) => ({ ...zona }))
    });
  };

  const eliminarEvento = (id) => {
    if (window.confirm('¿Deseas eliminar este evento?')) {
      dispatch({
        type: 'ELIMINAR_EVENTO',
        payload: id
      });

      if (eventoEditando?.id === id) {
        cancelarEdicion();
      }
    }
  };

  return (
    <section className="administracion-eventos">
      <h2>Administración de eventos</h2>

      <h3>{eventoEditando ? 'Editar evento' : 'Agregar evento'}</h3>

      <form onSubmit={guardarEvento}>
        <label>Nombre del evento</label>
        <input
          name="titulo"
          value={formulario.titulo}
          onChange={manejarCambio}
          required
        />

        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={manejarCambio}
          required
        />

        <label>Categoría</label>
        <select
          name="categoria"
          value={formulario.categoria}
          onChange={manejarCambio}
        >
          <option value="Música">Música</option>
          <option value="Comedia">Comedia</option>
          <option value="Videojuegos">Videojuegos</option>
        </select>

        <label>Fecha</label>
        <input
          type="date"
          name="fecha"
          value={formulario.fecha}
          onChange={manejarCambio}
          required
        />

        <label>Hora</label>
        <input
          type="time"
          name="hora"
          value={formulario.hora}
          onChange={manejarCambio}
          required
        />

        <label>Lugar</label>
        <input
          name="lugar"
          value={formulario.lugar}
          onChange={manejarCambio}
          required
        />

        <label>Estado</label>
        <select
          name="estado"
          value={formulario.estado}
          onChange={manejarCambio}
        >
          <option value="Disponible">Disponible</option>
          <option value="Agotado">Agotado</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <h3>Imagen del evento</h3>

        <div className="selector-imagen">
          <label htmlFor="imagenEvento" className="btn-archivo">
            Seleccionar imagen
          </label>

          <input
            id="imagenEvento"
            type="file"
            accept="image/*"
            onChange={manejarImagen}
            className="input-archivo"
          />

          {formulario.imagen && (
            <div className="vista-previa">
              <p>Vista previa de la imagen:</p>
              <img
                src={formulario.imagen}
                alt="Vista previa del evento"
              />
            </div>
          )}
        </div>

        <h3>Zonas, precios y disponibilidad</h3>

        {formulario.zonas.map((zona, index) => (
          <div key={index}>
            <h4>Zona {index + 1}</h4>

            <label>Nombre de la zona</label>
            <input
              value={zona.nombre}
              onChange={(e) =>
                manejarCambioZona(index, 'nombre', e.target.value)
              }
              required
            />

            <label>Precio</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={zona.precio}
              onChange={(e) =>
                manejarCambioZona(index, 'precio', e.target.value)
              }
              required
            />

            <label>Boletos disponibles</label>
            <input
              type="number"
              min="0"
              step="1"
              value={zona.disponibles}
              onChange={(e) =>
                manejarCambioZona(index, 'disponibles', e.target.value)
              }
              required
            />

            {formulario.zonas.length > 1 && (
              <button
                type="button"
                onClick={() => eliminarZona(index)}
              >
                Eliminar zona
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={agregarZona}>
          Agregar zona
        </button>

        <button type="submit">
          {eventoEditando ? 'Guardar cambios' : 'Registrar evento'}
        </button>

        {eventoEditando && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar
          </button>
        )}
      </form>

      <h3>Eventos registrados</h3>

      {eventos.map((evento) => (
        <article key={evento.id}>
          {evento.imagen && (
            <img
              src={evento.imagen}
              alt={evento.titulo}
              style={{
                width: '200px',
                maxHeight: '140px',
                objectFit: 'cover'
              }}
            />
          )}

          <h4>{evento.titulo}</h4>
          <p>Categoría: {evento.categoria}</p>
          <p>Fecha: {evento.fecha}</p>
          <p>Estado: {evento.estado}</p>

          <button onClick={() => editarEvento(evento)}>
            Editar
          </button>

          <button onClick={() => eliminarEvento(evento.id)}>
            Eliminar
          </button>
        </article>
      ))}
    </section>
  );
}

export default AdministracionEventos;
