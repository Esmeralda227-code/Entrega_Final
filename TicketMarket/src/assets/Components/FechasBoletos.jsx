
import { useState } from "react";
import { eventos } from "../Data/eventos2";

const EVENTOS = [
    {
        id: "evt-1",
        evento: "valorant",
        fecha: "15-12-2026",
        lugar: "Auditorio Uca",
        zonas: [
            { nombre: "General", precio: 60 },
            { nombre: "VIP", precio: 90 },
            { nombre: "Estudiante", precio: 40 }
        ],
    },
    {
        id: "evt-2",
        evento: "Billie Eilish",
        fecha: "14-11-2026",
        lugar: "Estadio Magico Gonzales",
        zonas: [
            { nombre: "General", precio: 90 },
            { nombre: "VIP", precio: 160 },
            { nombre: "Estudiante", precio: 60 }
        ]
    },
    {
        id: "evt-3",
        evento: "Franco Escamilla",
        fecha: "14-11-2026",
        lugar: "Auditorio BINAES",
        zonas: [
            { nombre: "General", precio: 45 },
            { nombre: "VIP", precio: 75 },
            { nombre: "Estudiante", precio: 25 }
        ]
    },
    {
        id: "evt-4",
        evento: "Brincos Dieras",
        fecha: "21-11-2026",
        lugar: "Auditorio BINAES",
        zonas: [
            { nombre: "General", precio: 45 },
            { nombre: "VIP", precio: 80 },
            { nombre: "Estudiante", precio: 30 }
        ]
    },
];

export function FechasBoletos({ items = [], setItems, onIrACarrito }) {
    const [seleccion, setSeleccion] = useState({});
    const [aviso, setAviso] = useState("");

    const obtenerConfig = (evt) =>
        seleccion[evt.id] || {
            zona: evt.zonas[0].nombre,
            cantidad: 1,
        };

    const cambiarZona = (evtId, zona) => {
        setSeleccion((prev) => ({
            ...prev,
            [evtId]: {
                ...(prev[evtId] || { cantidad: 1 }),
                zona,
            },
        }));
    };

    const cambiarCantidad = (evtId, cantidad) => {
        const val = Math.max(1, Number(cantidad) || 1);

        setSeleccion((prev) => ({
            ...prev,
            [evtId]: {
                ...(prev[evtId] || {}),
                cantidad: val,
            },
        }));
    };

    const agregarAlCarrito = (evt) => {
        const { zona, cantidad } = obtenerConfig(evt);
        const zonaActual = evt.zonas.find((z) => z.nombre === zona) || evt.zonas[0];

        const eventoRelacionado = eventos.find(
            (ev) => ev.nombre.toLowerCase() === evt.evento.toLowerCase()
        );

        const indiceExistente = items.findIndex(
            (item) => item.evento === evt.evento && item.zona === zonaActual.nombre
        );

        const actualizados =
            indiceExistente >= 0
                ? items.map((item, idx) =>
                    idx === indiceExistente
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                )
                : [
                    ...items,
                    {
                        id: `${evt.id}-${zonaActual.nombre}-${Date.now()}`,
                        evento: evt.evento,
                        fecha: evt.fecha,
                        imagen: eventoRelacionado?.imagen || "",
                        zona: zonaActual.nombre,
                        precio: zonaActual.precio,
                        cantidad,
                    },
                ];

        setItems(actualizados);
        localStorage.setItem("carrito_tiket", JSON.stringify(actualizados));

        setAviso(
            `Se agregaron ${cantidad} boleto(s) de ${evt.evento} (${zonaActual.nombre}).`
        );
    };

    return (
        <section className="fechas-wrapper">
            <h2>Fechas y boletos</h2>

            {aviso && <p>{aviso}</p>}

            {EVENTOS.map((evt) => {
                const config = obtenerConfig(evt);
                const zonaObj =
                    evt.zonas.find((z) => z.nombre === config.zona) || evt.zonas[0];

                return (
                    <article key={evt.id}>
                        <h3>{evt.evento}</h3>

                        <p>
                            Fecha: {evt.fecha} | Lugar: {evt.lugar}
                        </p>

                        <label>
                            Zona:
                            <select
                                value={zonaObj.nombre}
                                onChange={(e) => cambiarZona(evt.id, e.target.value)}
                            >
                                {evt.zonas.map((z) => (
                                    <option key={z.nombre} value={z.nombre}>
                                        {z.nombre} — ${z.precio.toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Cantidad:
                            <input
                                type="number"
                                min="1"
                                value={config.cantidad}
                                onChange={(e) => cambiarCantidad(evt.id, e.target.value)}
                            />
                        </label>

                        <button type="button" onClick={() => agregarAlCarrito(evt)}>
                            Agregar al carrito
                        </button>
                    </article>
                );
            })}

            {onIrACarrito && (
                <button type="button" onClick={onIrACarrito}>
                    Ir al carrito
                </button>
            )}
        </section>
    );
}
