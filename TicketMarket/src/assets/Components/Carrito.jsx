
import { useState } from "react";
import { useEventos } from "../Context/EventosContext.jsx";

const CODIGOS = {
  TIKETS10: 0.10
};

export function Carrito({
  items = [],
  setItems,
  onIrAPagar
}) {
  const { eventos } = useEventos();

  const [codigo, setCodigo] = useState("");
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [mensajePromo, setMensajePromo] = useState("");

  const eliminarItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const obtenerDisponibles = (item) => {
    const evento = eventos.find(
      (ev) => ev.id === item.eventoId
    );

    const zona = evento?.zonas?.find(
      (z) =>
        item.zonaId !== null && item.zonaId !== undefined
          ? z.id === item.zonaId
          : z.nombre === item.zona
    );

    return zona?.disponibles;
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    const cantidad = Math.floor(Number(nuevaCantidad));

    if (!Number.isFinite(cantidad)) return;

    if (cantidad <= 0) {
      eliminarItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const disponibles = obtenerDisponibles(item);

        const cantidadFinal =
          disponibles !== undefined
            ? Math.min(cantidad, Number(disponibles))
            : cantidad;

        return {
          ...item,
          cantidad: Math.max(1, cantidadFinal)
        };
      })
    );
  };

  const aplicarPromo = (e) => {
    e.preventDefault();

    const limpio = codigo.trim().toUpperCase();

    if (CODIGOS[limpio]) {
      setDescuentoPorcentaje(CODIGOS[limpio]);
      setMensajePromo(`Promoción ${limpio} aplicada`);
    } else {
      setDescuentoPorcentaje(0);
      setMensajePromo("Código no válido");
    }
  };

  const subtotal = items.reduce(
    (acc, item) =>
      acc +
      (Number(item.precio) || 0) *
      (Number(item.cantidad) || 0),
    0
  );

  const descuento = subtotal * descuentoPorcentaje;
  const total = subtotal - descuento;

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no especificada";

    const fechaValida = new Date(`${fecha}T00:00:00`);

    if (Number.isNaN(fechaValida.getTime())) {
      return fecha;
    }

    return fechaValida.toLocaleDateString("es-SV");
  };

  if (items.length === 0) {
    return (
      <section className="carrito-wrapper">
        <div className="carrito-banner">
          CARRITO DE COMPRAS
        </div>

        <div className="carrito-cuerpo">
          <p className="carrito-vacio">
            No tienes boletos en tu carrito.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="carrito-wrapper">
      <div className="carrito-banner">
        CARRITO DE COMPRAS
      </div>

      <div className="carrito-cuerpo">
        <div className="carrito-encabezado-tabla">
          <span></span>
          <span>Nombre</span>
          <span>Cantidad</span>
          <span>Precio</span>
        </div>
      </div>

      {items.map((item) => {
        const disponibles = obtenerDisponibles(item);

        return (
          <div key={item.id} className="carrito-fila">
            {item.imagen ? (
              <img
                src={item.imagen}
                alt={`Imagen del evento ${item.evento || "seleccionado"}`}
                className="carrito-foto"
              />
            ) : (
              <div className="carrito-foto">
                Imagen no disponible
              </div>
            )}

            <div className="carrito-nombre">
              <div>{item.evento || "Evento sin nombre"}</div>

              <small>{item.zona || "Zona no especificada"}</small>

              <small>
                Fecha: {formatearFecha(item.fecha)}
              </small>

              {item.lugar && (
                <small>Lugar: {item.lugar}</small>
              )}

              <button
                type="button"
                className="btn-quitar-mini"
                onClick={() => eliminarItem(item.id)}
              >
                Quitar
              </button>
            </div>

            <div className="carrito-dato">
              <input
                type="number"
                min="1"
                max={disponibles}
                value={item.cantidad}
                aria-label={`Cantidad de boletos para ${item.evento}`}
                onChange={(e) =>
                  cambiarCantidad(item.id, e.target.value)
                }
                style={{
                  width: "70px",
                  margin: 0,
                  textAlign: "center"
                }}
              />
            </div>

            <div className="carrito-dato">
              ${(
                (Number(item.precio) || 0) *
                (Number(item.cantidad) || 0)
              ).toFixed(2)}
            </div>
          </div>
        );
      })}

      <div className="carrito-footer">
        <form onSubmit={aplicarPromo} className="promo-caja">
          <label htmlFor="promo" className="promo-titulo">
            Código promocional
          </label>

          <div className="promo-controles">
            <input
              id="promo"
              type="text"
              className="promo-input"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej. TIKETS10"
            />

            <button
              type="submit"
              className="btn-reclamar"
            >
              Aplicar
            </button>
          </div>

          {mensajePromo && (
            <p className="promo-aviso" role="status">
              {mensajePromo}
            </p>
          )}
        </form>

        <div className="resumen-derecha">
          <div className="resumen-caja">
            <div className="resumen-linea">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {descuento > 0 && (
              <div className="resumen-linea">
                <span>Descuento</span>
                <span>-${descuento.toFixed(2)}</span>
              </div>
            )}

            <div className="resumen-linea">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="badge-tikeck">
            <span>Tikeck</span>
            <span>Market</span>
          </div>

          <button
            type="button"
            className="btn-pagar-carrito"
            onClick={() => onIrAPagar?.(total)}
          >
            Pagar
          </button>
        </div>
      </div>
    </section>
  );
}
