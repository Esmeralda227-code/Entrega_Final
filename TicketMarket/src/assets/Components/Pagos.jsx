import { useState } from "react";
export function Pagos({ items, setItems, onCompraExitosa }) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [tarjeta, setTarjeta] = useState('');
    const [error, setError] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [confirmacion, setConfirmacion] = useState(null);

    const subtotal = items.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0
    );
    const manejarPago = (e) => {
        e.preventDefault();
        setError('')

        if (items.length === 0) {
            setError('No hay boletos en el carrito para procesar el pago');
            return;
        }

        if (!nombre.trim() || !correo.includes('@') || tarjeta.trim().length < 4) {
            setError('Completa tu nombre, un correo valido y al menos 4 digitos de tarjeta.');
            return;
        }

        setProcesando(true);

        setTimeout(() => {
            const ultimos4 = tarjeta.trim().slice(-4);
            const orden = {
                id: `ORD-${Date.now().toString().slice(-6)}`,
                fechaCompra: new Date().toLocaleDateString(),
                titular: nombre.trim(),
                correo: correo.trim(),
                terminacion: ultimos4,
                total: subtotal,
                boletos: items
            };

            setItems([]);
            localStorage.removeItem('carrito_tiket');
            setProcesando(false);
            setConfirmacion(orden);

            if (onCompraExitosa) {
                onCompraExitosa(orden);
            }
        }, 800);
    };

    return (
        <section>
            <h2>pago</h2>
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

                    <button type="submit" disabled={procesando || Boolean(confirmacion)}>
                        {procesando ? "procesando..." : "pagar"}
                    </button>
                </form>
                
                {confirmacion && (
                    <div>
                        <h3>Compra confirmada</h3>
                        <p>Orden: {confirmacion.id}</p>
                        <p>Titular: {confirmacion.titular}</p>
                        <p>Tarjeta: ** {confirmacion.terminacion}</p>
                        <p>Total pagado: ${confirmacion.total.toFixed(2)}</p>
                    </div>
                )}
        </section>
    )
}