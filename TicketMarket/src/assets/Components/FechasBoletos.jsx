
import { useState } from "react";
import { useEventos } from "../Context/EventosContext.jsx";

export function FechasBoletos({
  items = [],
  setItems,
  onIrACarrito
}) {
  const { eventos } = useEventos();

  const [seleccion, setSeleccion] = useState({});
  const [aviso, setAviso] = useState("");

  const eventosDisponibles = eventos.filter(
    (evento) =>
      !evento.estado || evento.estado === "Disponible"
  );

  const obtenerConfig = (evento) => {
    const primeraZona = evento.zonas?.[0];

    return (
      seleccion[evento.id] || {
        zona: primeraZona?.nombre || "",
        cantidad: 1
      }
    );
  };

  const cambiarZona = (eventoId, zona) => {
    setSeleccion((anterior) => ({
      ...anterior,
      [eventoId]: {
        ...anterior[eventoId],
        zona,
        cantidad: anterior[eventoId]?.cantidad || 1
      }
    }));

    setAviso("");
  };

  const cambiarCantidad = (eventoId, cantidad) => {
    const valor = Math.max(
      1,
      Math.floor(Number(cantidad) || 1)
    );

    setSeleccion((anterior) => ({
      ...anterior,
      [eventoId]: {
        ...anterior[eventoId],
        cantidad: valor
      }
    }));

    setAviso("");
  };

  const agregarAlCarrito = (evento) => {
    const { zona, cantidad } = obtenerConfig(evento);

    const zonaActual = evento.zonas?.find(
      (item) => item.nombre === zona
    );

    if (!zonaActual) {
      setAviso("Este evento no tiene zonas disponibles.");
      return;
    }

    const indiceExistente = items.findIndex(
      (item) =>
        item.eventoId === evento.id &&
        item.zona === zonaActual.nombre
    );

    const cantidadExistente =
      indiceExistente >= 0
        ? Number(items[indiceExistente].cantidad) || 0
        : 0;

    const cantidadTotal = cantidadExistente + cantidad;

    if (
      zonaActual.disponibles !== undefined &&
      cantidadTotal > Number(zonaActual.disponibles)
    ) {
      setAviso(
        `Solo hay ${zonaActual.disponibles} boletos disponibles para la zona ${zonaActual.nombre}.`
      );
      return;
    }

    const nuevoItem = {
      id: `${evento.id}-${zonaActual.id ?? zonaActual.nombre}`,
      eventoId: evento.id,
      zonaId: zonaActual.id ?? null,
      evento: evento.titulo,
      fecha: evento.fecha,
      lugar: evento.lugar,
      imagen: evento.imagen || "",
      zona: zonaActual.nombre,
      precio: Number(zonaActual.precio) || 0,
      cantidad
    };

    const actualizados =
      indiceExistente >= 0
        ? items.map((item, indice) =>
            indice === indiceExistente
              ? {
                  ...item,
                  cantidad: cantidadTotal
                }
              : item
          )
        : [...items, nuevoItem];

    setItems(actualizados);

    setAviso(
      `Se agregaron ${cantidad} boleto(s) de ${evento.titulo} (${zonaActual.nombre}).`
    );
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "No especificada";

    const fechaValida = new Date(`${fecha}T00:00:00`);

    if (Number.isNaN(fechaValida.getTime())) {
      return fecha;
    }

    return fechaValida.toLocaleDateString("es-SV");
  };

  return (
    <section className="fechas-wrapper">
      <h2>Fechas y boletos</h2>

      {aviso && (
        <p role="status">{aviso}</p>
      )}

      {eventosDisponibles.length > 0 ? (
        eventosDisponibles.map((evento) => {
          const config = obtenerConfig(evento);

          const zonaObj = evento.zonas?.find(
            (zona) => zona.nombre === config.zona
          ) || evento.zonas?.[0];

          return (
            <article key={evento.id}>
              <h3>{evento.titulo}</h3>

              <p>
                Fecha: {formatearFecha(evento.fecha)}
                {" | "}
                Lugar: {evento.lugar || "No especificado"}
              </p>

              {evento.imagen && (
                <img
                  src={evento.imagen}
                  alt={evento.titulo}
                  className="imagen-evento"
                />
              )}

              {evento.zonas?.length > 0 ? (
                <>
                  <label>
                    Zona:

                    <select
                      value={zonaObj?.nombre || ""}
                      onChange={(e) =>
                        cambiarZona(evento.id, e.target.value)
                      }
                    >
                      {evento.zonas.map((zona, indice) => (
                        <option
                          key={zona.id ?? indice}
                          value={zona.nombre}
                        >
                          {zona.nombre} — $
                          {Number(zona.precio || 0).toFixed(2)}
                          {zona.disponibles !== undefined
                            ? ` (${zona.disponibles} disponibles)`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Cantidad:

                    <input
                      type="number"
                      min="1"
                      max={zonaObj?.disponibles}
                      value={config.cantidad}
                      onChange={(e) =>
                        cambiarCantidad(evento.id, e.target.value)
                      }
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => agregarAlCarrito(evento)}
                  >
                    Agregar al carrito
                  </button>
                </>
              ) : (
                <p>Este evento todavía no tiene zonas registradas.</p>
              )}
            </article>
          );
        })
      ) : (
        <p className="sin-resultados">
          No hay eventos disponibles actualmente.
        </p>
      )}

      {onIrACarrito && (
        <button
          type="button"
          onClick={onIrACarrito}
        >
          Ir al carrito
        </button>
      )}
    </section>
  );
}
