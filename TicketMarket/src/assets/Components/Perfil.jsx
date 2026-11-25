
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export function Perfil({
  usuario,
  setUsuario,
  setSesion,
  ordenes = [],
  onCerrarSesion
}) {
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [correo, setCorreo] = useState(usuario?.correo || "");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setNombre(usuario?.nombre || "");
    setCorreo(usuario?.correo || "");
    setMensaje("");
    setError("");
  }, [usuario]);

  const guardarPerfil = (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim().toLowerCase();

    if (
      !nombreLimpio ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)
    ) {
      setError("Ingresa un nombre y un correo válido.");
      return;
    }

    const nuevoUsuario = {
      ...usuario,
      nombre: nombreLimpio,
      correo: correoLimpio
    };

    try {
      const sesionActual = JSON.parse(
        localStorage.getItem("sesion") || "null"
      );

      const nuevaSesion = sesionActual
        ? {
            ...sesionActual,
            nombre: nombreLimpio,
            correo: correoLimpio
          }
        : null;

      const registrados = JSON.parse(
        localStorage.getItem("usuariosRegistrados") || "[]"
      );

      const usuariosActualizados = Array.isArray(registrados)
        ? registrados.map((u) =>
            String(u.id) === String(nuevoUsuario.id)
              ? {
                  ...u,
                  nombre: nombreLimpio,
                  correo: correoLimpio
                }
              : u
          )
        : [];

      localStorage.setItem(
        "usuario_tiket",
        JSON.stringify(nuevoUsuario)
      );

      if (nuevaSesion) {
        localStorage.setItem(
          "sesion",
          JSON.stringify(nuevaSesion)
        );

        setSesion?.(nuevaSesion);
      }

      localStorage.setItem(
        "usuariosRegistrados",
        JSON.stringify(usuariosActualizados)
      );

      setUsuario(nuevoUsuario);
      setMensaje("Perfil guardado correctamente.");

    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      setError("No se pudieron guardar los cambios.");
    }
  };

  const ordenesUsuario = ordenes.filter((orden) => {
    if (
      orden.usuarioId !== undefined &&
      orden.usuarioId !== null
    ) {
      return String(orden.usuarioId) === String(usuario?.id);
    }

    // Compatibilidad con compras anteriores
    // que todavía no tienen usuarioId.
    return (
      orden.correo?.toLowerCase() ===
      usuario?.correo?.toLowerCase()
    );
  });

  return (
    <section className="perfil-wrapper">
      <h2>Mi Perfil</h2>

      <form onSubmit={guardarPerfil}>
        <div>
          <label htmlFor="perfil-nombre">Nombre</label>

          <input
            id="perfil-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="perfil-correo">Correo</label>

          <input
            id="perfil-correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert">{error}</p>
        )}

        {mensaje && (
          <p role="status">{mensaje}</p>
        )}

        <button type="submit">
          Guardar perfil
        </button>

        {usuario && (
          <button
            type="button"
            onClick={onCerrarSesion}
          >
            Cerrar sesión
          </button>
        )}
      </form>

      <hr />

      <h3>Historial de compras</h3>

      {ordenesUsuario.length === 0 ? (
        <p>No tienes compras registradas todavía.</p>
      ) : (
        <ul>
          {ordenesUsuario.map((orden) => (
            <li key={orden.id}>
              <p>
                <strong>Orden:</strong> {orden.id}
                {" | "}
                <strong>Fecha:</strong> {orden.fechaCompra}
              </p>

              <p>
                <strong>Titular:</strong> {orden.titular}
                {" | "}
                <strong>Tarjeta:</strong> ** {orden.terminacion}
              </p>

              <p>
                <strong>Total:</strong> $
                {Number(orden.total || 0).toFixed(2)}
              </p>

              <ul>
                {(orden.boletos || []).map((boleto, index) => (
                  <li key={boleto.id || index}>
                    <p>
                      {boleto.evento || boleto.nombre || "Boleto"}
                      {" — Zona: "}
                      {boleto.zona || "General"}
                      {" x"}
                      {boleto.cantidad}
                    </p>

                    {boleto.entradas?.length > 0 ? (
                      <div className="boletos-qr">
                        {boleto.entradas.map((entrada) => (
                          <div
                            className="boleto-qr"
                            key={entrada.codigo}
                          >
                            <h4>Boleto electrónico</h4>

                            <QRCodeCanvas
                              value={entrada.valorQR || entrada.codigo}
                              size={180}
                              level="H"
                            />

                            <p>
                              <strong>Código:</strong>{" "}
                              {entrada.codigo}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>
                        Este boleto pertenece a una compra anterior
                        y no tiene QR generado.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
