
import { useState } from "react";
import { useEventos } from "../Context/EventosContext.jsx";

export function Pagos({
  items = [],
  setItems,
  onCompraExitosa,
  total: totalRecibido
}) {
  const { eventos, dispatch } = useEventos();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  const subtotal = items.reduce(
    (acc, item) =>
      acc +
      (Number(item.precio) || 0) *
      (Number(item.cantidad) || 0),
    0
  );

  const total = Number.isFinite(Number(totalRecibido))
    ? Number(totalRecibido)
    : subtotal;

  const generarCodigo = () => {
    return `TK-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const validarInventario = () => {
    const cantidades = new Map();

    for (const item of items) {
      const evento = eventos.find(
        (ev) => ev.id === item.eventoId
      );

      if (!evento) {
        return {
          valido: false,
          mensaje: `No se encontró el evento ${item.evento}. Vuelve a agregarlo al carrito.`
        };
      }

      const zona = evento.zonas?.find((z) =>
        item.zonaId !== null && item.zonaId !== undefined
          ? z.id === item.zonaId
          : z.nombre === item.zona
      );

      if (!zona) {
        return {
          valido: false,
          mensaje: `No se encontró la zona ${item.zona} del evento ${item.evento}.`
        };
      }

      const cantidad = Math.floor(Number(item.cantidad) || 0);

      if (cantidad < 1) {
        return {
          valido: false,
          mensaje: "Hay una cantidad de boletos no válida."
        };
      }

      const clave = `${evento.id}-${zona.id ?? zona.nombre}`;

      const cantidadAnterior = cantidades.get(clave);

      if (cantidadAnterior) {
        cantidadAnterior.cantidad += cantidad;
      } else {
        cantidades.set(clave, {
          evento,
          zona,
          cantidad
        });
      }
    }

    for (const registro of cantidades.values()) {
      if (
        registro.zona.disponibles !== undefined &&
        registro.cantidad > Number(registro.zona.disponibles)
      ) {
        return {
          valido: false,
          mensaje: `No hay suficientes boletos disponibles para ${registro.evento.titulo}, zona ${registro.zona.nombre}. Disponibles: ${registro.zona.disponibles}.`
        };
      }
    }

    return {
      valido: true,
      cantidades
    };
  };

  const manejarPago = (e) => {
    e.preventDefault();
    setError("");

    if (procesando || confirmacion) return;

    if (items.length === 0) {
      setError("No hay boletos en el carrito para procesar el pago.");
      return;
    }

    if (
      !nombre.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) ||
      tarjeta.replace(/\s/g, "").length < 4
    ) {
      setError(
        "Completa tu nombre, un correo válido y al menos 4 dígitos de tarjeta."
      );
      return;
    }

    const resultado = validarInventario();

    if (!resultado.valido) {
      setError(resultado.mensaje);
      return;
    }

    setProcesando(true);

    setTimeout(() => {
      const ultimos4 = tarjeta.trim().slice(-4);
      const idOrden = `ORD-${Date.now()}`;

      const boletosConQR = items.map((item) => {
        const cantidad = Math.floor(Number(item.cantidad) || 0);

        const entradas = Array.from(
          { length: cantidad },
          () => {
            const codigo = generarCodigo();

            return {
              codigo,
              valorQR: `TICKETMARKET:${codigo}`
            };
          }
        );

        return {
          ...item,
          entradas
        };
      });

      // Descontar los boletos vendidos del inventario.
      const eventosActualizados = new Map();

      for (const registro of resultado.cantidades.values()) {
        const eventoActualizado =
          eventosActualizados.get(registro.evento.id) ||
          {
            ...registro.evento,
            zonas: registro.evento.zonas.map((zona) => ({
              ...zona
            }))
          };

        const zonaActualizada = eventoActualizado.zonas.find(
          (zona) =>
            zona.id === registro.zona.id &&
            zona.nombre === registro.zona.nombre
        );

        if (zonaActualizada?.disponibles !== undefined) {
          zonaActualizada.disponibles =
            Number(zonaActualizada.disponibles) -
            registro.cantidad;
        }

        eventosActualizados.set(
          registro.evento.id,
          eventoActualizado
        );
      }

      eventosActualizados.forEach((evento) => {
        dispatch({
          type: "ACTUALIZAR_EVENTO",
          payload: evento
        });
      });

      const orden = {
        id: idOrden,
        fechaCompra: new Date().toLocaleDateString("es-SV"),
        titular: nombre.trim(),
        correo: correo.trim(),
        terminacion: ultimos4,
        subtotal,
        total,
        boletos: boletosConQR
      };

      setItems([]);
      setProcesando(false);
      setConfirmacion(orden);

      if (onCompraExitosa) {
        onCompraExitosa(orden);
      }
    }, 800);
  };

  return (
    <section className="pagos-wrapper">
      <h2>Pago</h2>

      <p>Total: ${total.toFixed(2)}</p>

      <form onSubmit={manejarPago}>
        <div>
          <label htmlFor="nombre">Nombre</label>

          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={procesando || Boolean(confirmacion)}
            required
          />
        </div>

        <div>
          <label htmlFor="correo">Correo</label>

          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={procesando || Boolean(confirmacion)}
            required
          />
        </div>

        <div>
          <label htmlFor="tarjeta">
            Tarjeta (simulación)
          </label>

          <input
            id="tarjeta"
            type="text"
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
            disabled={procesando || Boolean(confirmacion)}
            placeholder="Ingresa al menos 4 dígitos"
            required
          />
        </div>

        {error && (
          <p role="alert">{error}</p>
        )}

        <button
          type="submit"
          disabled={procesando || Boolean(confirmacion)}
        >
          {procesando ? "Procesando..." : "Pagar"}
        </button>
      </form>

      {confirmacion && (
        <div>
          <h3>Compra confirmada</h3>

          <p>Orden: {confirmacion.id}</p>
          <p>Titular: {confirmacion.titular}</p>
          <p>Tarjeta: ** {confirmacion.terminacion}</p>
          <p>
            Total pagado: ${confirmacion.total.toFixed(2)}
          </p>

          <p>
            Boletos electrónicos generados correctamente.
          </p>
        </div>
      )}
    </section>
  );
}
