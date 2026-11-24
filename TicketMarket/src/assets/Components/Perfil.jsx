
import { useState } from "react";

export function Perfil({ usuario, setUsuario, ordenes = [] }) {
  const [nombre, setNombre] = useState(usuario?.nombre || "");
  const [correo, setCorreo] = useState(usuario?.correo || "");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

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
      correo: correo.trim(),
    };

    setUsuario(nuevoUsuario);
    localStorage.setItem("usuario_tiket", JSON.stringify(nuevoUsuario));
    setMensaje("Perfil guardado.");
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setNombre("");
    setCorreo("");
    setMensaje("");
    setError("");
    localStorage.removeItem("usuario_tiket");
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
                <strong>Total:</strong> ${Number(orden.total).toFixed(2)}
              </p>

              <ul>
                {orden.boletos.map((boleto, index) => (
                  <li key={boleto.id || index}>
                    {boleto.evento || boleto.nombre || "Boleto"} — Zona:{" "}
                    {boleto.zona || "General"} x{boleto.cantidad}
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
