
import { useState } from "react";
import { useEventos } from "../Context/EventosContext.jsx";

function crearFormularioInicial() {
  return {
    titulo: "",
    descripcion: "",
    categoria: "Música",
    fecha: "",
    hora: "",
    lugar: "",
    estado: "Disponible",
    imagen: "",
    zonas: [
      {
        id: 1,
        nombre: "General",
        precio: 15,
        disponibles: 100
      }
    ]
  };
}

function AdministracionEventos() {
  const { eventos, dispatch } = useEventos();

  const [formulario, setFormulario] = useState(
    crearFormularioInicial
  );

  const [eventoEditando, setEventoEditando] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value
    }));

    setError("");
    setMensaje("");
  };

  const manejarImagen = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      e.target.value = "";
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      setError("La imagen no debe superar los 2 MB.");
      e.target.value = "";
      return;
    }

    const lector = new FileReader();

    lector.onload = () => {
      setFormulario((anterior) => ({
        ...anterior,
        imagen: lector.result
      }));

      setError("");
    };

    lector.onerror = () => {
      setError("No se pudo cargar la imagen.");
    };

    lector.readAsDataURL(archivo);
  };

  const manejarCambioZona = (index, campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,
      zonas: anterior.zonas.map((zona, i) =>
        i === index
          ? {
              ...zona,
              [campo]: valor
            }
          : zona
      )
    }));

    setError("");
  };

  const agregarZona = () => {
    const nuevoId =
      Math.max(
        0,
        ...formulario.zonas.map((zona) => Number(zona.id) || 0)
      ) + 1;

    setFormulario((anterior) => ({
      ...anterior,
      zonas: [
        ...anterior.zonas,
        {
          id: nuevoId,
          nombre: "",
          precio: 0,
          disponibles: 0
        }
      ]
    }));
  };

  const eliminarZona = (index) => {
    setFormulario((anterior) => ({
      ...anterior,
      zonas: anterior.zonas.filter((_, i) => i !== index)
    }));
  };

  const cancelarEdicion = () => {
    setEventoEditando(null);
    setFormulario(crearFormularioInicial());
    setError("");
    setMensaje("");
  };

  const validarFormulario = () => {
    if (
      !formulario.titulo.trim() ||
      !formulario.descripcion.trim() ||
      !formulario.fecha ||
      !formulario.hora ||
      !formulario.lugar.trim()
    ) {
      return "Completa todos los campos del evento.";
    }

    if (formulario.zonas.length === 0) {
      return "El evento debe tener al menos una zona.";
    }

    const nombresZonas = formulario.zonas.map(
      (zona) => zona.nombre.trim().toLowerCase()
    );

    if (nombresZonas.some((nombre) => !nombre)) {
      return "Todas las zonas deben tener un nombre.";
    }

    if (new Set(nombresZonas).size !== nombresZonas.length) {
      return "No puedes registrar dos zonas con el mismo nombre.";
    }

    for (const zona of formulario.zonas) {
      const precio = Number(zona.precio);
      const disponibles = Number(zona.disponibles);

      if (!Number.isFinite(precio) || precio < 0) {
        return `El precio de la zona ${zona.nombre} no es válido.`;
      }

      if (
        !Number.isInteger(disponibles) ||
        disponibles < 0
      ) {
        return `Las existencias de la zona ${zona.nombre} deben ser un número entero igual o mayor que cero.`;
      }
    }

    return "";
  };

  const guardarEvento = (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    const errorFormulario = validarFormulario();

    if (errorFormulario) {
      setError(errorFormulario);
      return;
    }

    const zonasActualizadas = formulario.zonas.map((zona) => ({
      ...zona,
      nombre: zona.nombre.trim(),
      precio: Number(zona.precio),
      disponibles: Number(zona.disponibles)
    }));

    const idEvento = eventoEditando
      ? eventoEditando.id
      : Math.max(
          0,
          ...eventos.map((item) => Number(item.id) || 0)
        ) + 1;

    const evento = {
      ...formulario,
      id: idEvento,
      titulo: formulario.titulo.trim(),
      descripcion: formulario.descripcion.trim(),
      lugar: formulario.lugar.trim(),
      zonas: zonasActualizadas
    };

    dispatch({
      type: eventoEditando
        ? "ACTUALIZAR_EVENTO"
        : "AGREGAR_EVENTO",
      payload: evento
    });

    setFormulario(crearFormularioInicial());
    setEventoEditando(null);

    setMensaje(
      eventoEditando
        ? "Evento actualizado correctamente."
        : "Evento registrado correctamente."
    );
  };

  const editarEvento = (evento) => {
    setEventoEditando(evento);

    setFormulario({
      ...evento,
      imagen: evento.imagen || "",
      zonas: (evento.zonas || []).map((zona) => ({
        ...zona
      }))
    });

    setError("");
    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const eliminarEvento = (id) => {
    if (!window.confirm("¿Deseas eliminar este evento?")) {
      return;
    }

    dispatch({
      type: "ELIMINAR_EVENTO",
      payload: id
    });

    if (eventoEditando?.id === id) {
      cancelarEdicion();
    }

    setMensaje("Evento eliminado correctamente.");
  };

  return (
    <section className="administracion-eventos">
      <h2>Administración de eventos</h2>

      <h3>
        {eventoEditando ? "Editar evento" : "Agregar evento"}
      </h3>

      <form onSubmit={guardarEvento}>
        <label htmlFor="titulo-evento">
          Nombre del evento
        </label>

        <input
          id="titulo-evento"
          name="titulo"
          value={formulario.titulo}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="descripcion-evento">
          Descripción
        </label>

        <textarea
          id="descripcion-evento"
          name="descripcion"
          value={formulario.descripcion}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="categoria-evento">
          Categoría
        </label>

        <select
          id="categoria-evento"
          name="categoria"
          value={formulario.categoria}
          onChange={manejarCambio}
        >
          <option value="Música">Música</option>
          <option value="Comedia">Comedia</option>
          <option value="Videojuegos">Videojuegos</option>
        </select>

        <label htmlFor="fecha-evento">Fecha</label>

        <input
          id="fecha-evento"
          type="date"
          name="fecha"
          value={formulario.fecha}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="hora-evento">Hora</label>

        <input
          id="hora-evento"
          type="time"
          name="hora"
          value={formulario.hora}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="lugar-evento">Lugar</label>

        <input
          id="lugar-evento"
          name="lugar"
          value={formulario.lugar}
          onChange={manejarCambio}
          required
        />

        <label htmlFor="estado-evento">Estado</label>

        <select
          id="estado-evento"
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
          <label
            htmlFor="imagenEvento"
            className="btn-archivo"
          >
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
          <div key={zona.id}>
            <h4>Zona {index + 1}</h4>

            <label>
              Nombre de la zona
            </label>

            <input
              value={zona.nombre}
              onChange={(e) =>
                manejarCambioZona(
                  index,
                  "nombre",
                  e.target.value
                )
              }
              required
            />

            <label>
              Precio
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={zona.precio}
              onChange={(e) =>
                manejarCambioZona(
                  index,
                  "precio",
                  e.target.value
                )
              }
              required
            />

            <label>
              Boletos disponibles
            </label>

            <input
              type="number"
              min="0"
              step="1"
              value={zona.disponibles}
              onChange={(e) =>
                manejarCambioZona(
                  index,
                  "disponibles",
                  e.target.value
                )
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

        <button
          type="button"
          onClick={agregarZona}
        >
          Agregar zona
        </button>

        <button type="submit">
          {eventoEditando
            ? "Guardar cambios"
            : "Registrar evento"}
        </button>

        {eventoEditando && (
          <button
            type="button"
            onClick={cancelarEdicion}
          >
            Cancelar
          </button>
        )}

        {error && (
          <p role="alert">{error}</p>
        )}

        {mensaje && (
          <p role="status">{mensaje}</p>
        )}
      </form>

      <h3>Eventos registrados</h3>

      {eventos.length === 0 ? (
        <p>No hay eventos registrados.</p>
      ) : (
        eventos.map((evento) => (
          <article key={evento.id}>
            {evento.imagen && (
              <img
                src={evento.imagen}
                alt={evento.titulo}
                style={{
                  width: "200px",
                  maxHeight: "140px",
                  objectFit: "cover"
                }}
              />
            )}

            <h4>{evento.titulo}</h4>

            <p>Categoría: {evento.categoria}</p>
            <p>Fecha: {evento.fecha}</p>
            <p>Hora: {evento.hora}</p>
            <p>Lugar: {evento.lugar}</p>
            <p>Estado: {evento.estado}</p>

            <h4>Zonas y existencias</h4>

            {(evento.zonas || []).map((zona) => (
              <p key={zona.id}>
                {zona.nombre}: ${Number(zona.precio).toFixed(2)}
                {" | "}
                Disponibles: {zona.disponibles}
              </p>
            ))}

            <button
              type="button"
              onClick={() => editarEvento(evento)}
            >
              Editar
            </button>

            <button
              type="button"
              onClick={() => eliminarEvento(evento.id)}
            >
              Eliminar
            </button>
          </article>
        ))
      )}
    </section>
  );
}

export default AdministracionEventos;
