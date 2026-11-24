
import { useState } from "react";
import { eventos } from '../Data/eventos2';

const CODIGOS = {
    TIKETS10: 0.10,
};

export function Carrito({ items, setItems, onIrAPagar }) {
    const [codigo, setCodigo] = useState("");
    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
    const [mensajePromo, setMensajePromo] = useState("");

    const cambiarCantidad = (id, nuevaCantidad) => {
        if (nuevaCantidad <= 0) {
            eliminarItem(id);
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, cantidad: nuevaCantidad }
                    : item
            )
        );
    };

    const eliminarItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
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
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    const descuento = subtotal * descuentoPorcentaje;
    const total = subtotal - descuento;

    if (items.length === 0) {
        return (
            <section className="carrito-wrapper">
                <div className="carrito-banner">
                    CARRITOS GUARDADOS
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
                CARRITOS GUARDADOS
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
                const eventoRelacionado = eventos.find(
                    (ev) =>
                        ev.nombre?.toLowerCase() ===
                        item.evento?.toLowerCase()
                );

                const rutaImagen =
                    eventoRelacionado?.imagen ||
                    item.imagen ||
                    '/img/logo.png';

                return (
                    <div key={item.id} className="carrito-fila">
                        <img
                            src={rutaImagen}
                            alt={`Imagen del evento ${item.evento || 'seleccionado'}`}
                            className="carrito-foto"
                        />

                        <div className="carrito-nombre">
                            <div>{item.evento}</div>
                            <small>{item.zona}</small>

                            <div>
                                <button
                                    type="button"
                                    className="btn-quitar-mini"
                                    onClick={() => eliminarItem(item.id)}
                                >
                                    Quitar
                                </button>
                            </div>
                        </div>

                        <div className="carrito-dato">
                            <input
                                type="number"
                                min="1"
                                value={item.cantidad}
                                aria-label={`Cantidad de boletos para ${item.evento}`}
                                onChange={(e) =>
                                    cambiarCantidad(
                                        item.id,
                                        Number(e.target.value)
                                    )
                                }
                                style={{
                                    width: "70px",
                                    margin: 0,
                                    textAlign: "center"
                                }}
                            />
                        </div>

                        <div className="carrito-dato">
                            ${(item.precio * item.cantidad).toFixed(2)}
                        </div>
                    </div>
                );
            })}

            <div className="carrito-footer">
                <form onSubmit={aplicarPromo} className="promo-caja">
                    <label htmlFor="promo" className="promo-titulo">
                    </label>

                    <div className="promo-controles">
                        <input
                            id="promo"
                            type="text"
                            className="promo-input"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="Código (Ej. TIKETS10)"
                        />

                        <button
                            type="submit"
                            className="btn-reclamar"
                        >
                        </button>
                    </div>

                    {mensajePromo && (
                        <p className="promo-aviso">
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
                        onClick={() => onIrAPagar(total)}
                    >
                        Pagar
                    </button>
                </div>
            </div>
        </section>
    );
}
