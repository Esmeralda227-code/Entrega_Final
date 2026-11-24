
import { useState } from "react";

export function Pagos({ items, setItems, onCompraExitosa }) {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [tarjeta, setTarjeta] = useState("");
    const [error, setError] = useState("");
    const [procesando, setProcesando] = useState(false);
    const [confirmacion, setConfirmacion] = useState(null);

    const subtotal = items.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );

    const generarCodigo = () => {
        return `TK-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    };

    const manejarPago = (e) => {
        e.preventDefault();
        setError("");

        if (items.length === 0) {
            setError("No hay boletos en el carrito para procesar el pago");
            return;
        }

        if (
            !nombre.trim() ||
            !correo.includes("@") ||
            tarjeta.trim().length < 4
        ) {
            setError(
                "Completa tu nombre, un correo válido y al menos 4 dígitos de tarjeta."
            );
            return;
        }

        setProcesando(true);

        setTimeout(() => {
            const ultimos4 = tarjeta.trim().slice(-4);
            const idOrden = `ORD-${Date.now()}`;

            const boletosConQR = items.map((item) => {
                const cantidad = Math.max(
                    0,
                    Math.floor(Number(item.cantidad) || 0)
                );

                const entradas = Array.from(
                    { length: cantidad },
                    () => {
                        const codigo = generarCodigo();

                        return {
                            codigo,
                            valorQR: `TICKETMARKET:${codigo}`,
                        };
                    }
                );

                return {
                    ...item,
                    entradas,
                };
            });

            const orden = {
                id: idOrden,
                fechaCompra: new Date().toLocaleDateString(),
                titular: nombre.trim(),
                correo: correo.trim(),
                terminacion: ultimos4,
                total: subtotal,
                boletos: boletosConQR,
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
            <p>Total: ${subtotal.toFixed(2)}</p>

            <form onSubmit={manejarPago}>
                <div>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        disabled={procesando}
                    />
                </div>

                <div>
                    <label htmlFor="correo">Correo</label>
                    <input
                        id="correo"
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        disabled={procesando}
                    />
                </div>

                <div>
                    <label htmlFor="tarjeta">Tarjeta</label>
                    <input
                        id="tarjeta"
                        type="text"
                        value={tarjeta}
                        onChange={(e) => setTarjeta(e.target.value)}
                        disabled={procesando}
                    />
                </div>

                {error && <p>{error}</p>}

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
                    <p>Total pagado: ${confirmacion.total.toFixed(2)}</p>
                    <p>Boletos electrónicos generados correctamente.</p>
                </div>
            )}
        </section>
    );
}
