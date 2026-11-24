
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export function Perfil({
  usuario,
  setUsuario,
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

    if (!nombre.trim() || !correo.includes("@")) {
      setError("Ingresa un nombre y un correo activo.");
      return;
    }

    const nuevoUsuario = {
      ...usuario,
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
    };

    setUsuario(nuevoUsuario);

    localStorage.setItem(
      "usuario_tiket",
      JSON.stringify(nuevoUsuario)
    );

    const sesionActual = JSON.parse(
      localStorage.getItem("sesion") || "null"
    );

    if (sesionActual) {
      const nuevaSesion = {
        ...sesionActual,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
      };

      localStorage.setItem(
        "sesion",
        JSON.stringify(nuevaSesion)
      );
    }

    const registrados = JSON.parse(
      localStorage.getItem("usuariosRegistrados") || "[]"
    );

    const usuariosActualizados = registrados.map((u) =>
      String(u.id) === String(nuevoUsuario.id)
        ? {
          ...u,
          nombre: nuevoUsuario.nombre,
          correo: nuevoUsuario.correo,
        }
        : u
    );

    localStorage.setItem(
      "usuariosRegistrados",
      JSON.stringify(usuariosActualizados)
    );

    setMensaje("Perfil guardado.");
  };

  const cerrarSesion = () => {
    if (onCerrarSesion) {
      onCerrarSesion();
    }
  };

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

        {error && <p>{error}</p>}
        {mensaje && <p>{mensaje}</p>}

        <button type="submit">Guardar perfil</button>

        {usuario && (
          <button type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        )}
      </form>

      <hr />

      <h3>Historial de compras</h3>

      {ordenes.length === 0 ? (
        <p>No tienes compras registradas todavía.</p>
      ) : (
        <ul>
          {ordenes.map((orden) => (
            <li key={orden.id}>
              <p>
                <strong>Orden:</strong> {orden.id} |{" "}
                <strong>Fecha:</strong> {orden.fechaCompra}
              </p>

              <p>
                <strong>Titular:</strong> {orden.titular} |{" "}
                <strong>Tarjeta:</strong> ** {orden.terminacion}
              </p>

              <p>
                <strong>Total:</strong> $
                {Number(orden.total).toFixed(2)}
              </p>

              <ul>
                {orden.boletos.map((boleto, index) => (
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
                              value={entrada.valorQR}
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
                        Este boleto pertenece a una compra
                        anterior y no tiene QR generado.
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
