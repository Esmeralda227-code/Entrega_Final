
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./assets/Components/Login.jsx";
import BusquedaEventos from "./assets/Components/BusquedaEventos.jsx";
import AdministracionEventos from "./assets/Components/AdministracionEventos.jsx";
import Reportes from "./assets/Components/Reportes.jsx";
import { FechasBoletos } from "./assets/Components/FechasBoletos.jsx";
import { Perfil } from "./assets/Components/Perfil.jsx";
import { Carrito } from "./assets/Components/Carrito.jsx";
import { Pagos } from "./assets/Components/Pagos.jsx";

const obtenerSesion = () => {
  try {
    const guardada = localStorage.getItem("sesion");
    return guardada ? JSON.parse(guardada) : null;
  } catch (error) {
    console.error("Error al recuperar la sesión:", error);
    return null;
  }
};

const obtenerCarrito = (id) => {
  if (!id) return [];

  try {
    const carritoGuardado = JSON.parse(
      localStorage.getItem(`carrito_tiket_${id}`) || "[]"
    );

    return Array.isArray(carritoGuardado)
      ? carritoGuardado
      : [];
  } catch (error) {
    console.error("Error al recuperar el carrito:", error);
    return [];
  }
};

const obtenerOrdenes = () => {
  try {
    const guardadas = JSON.parse(
      localStorage.getItem("ordenes_tiket") || "[]"
    );

    return Array.isArray(guardadas) ? guardadas : [];
  } catch (error) {
    console.error("Error al recuperar las órdenes:", error);
    return [];
  }
};

function App() {
  const [sesion, setSesion] = useState(obtenerSesion);

  const [items, setItems] = useState(() => {
    const usuarioActual = obtenerSesion();

    if (!usuarioActual || usuarioActual.rol === "admin") {
      return [];
    }

    return obtenerCarrito(usuarioActual.id);
  });

  const [cartOwnerId, setCartOwnerId] = useState(() => {
    const usuarioActual = obtenerSesion();

    if (!usuarioActual || usuarioActual.rol === "admin") {
      return null;
    }

    return String(usuarioActual.id);
  });

  const [usuario, setUsuario] = useState(() => {
    const usuarioActual = obtenerSesion();

    try {
      const guardado = JSON.parse(
        localStorage.getItem("usuario_tiket") || "null"
      );

      return guardado || usuarioActual;
    } catch {
      return usuarioActual;
    }
  });

  const [ordenes, setOrdenes] = useState(obtenerOrdenes);

  const [vista, setVista] = useState(() =>
    obtenerSesion() ? "inicio" : "login"
  );

  const [totalPagar, setTotalPagar] = useState(null);

  useEffect(() => {
    if (cartOwnerId !== null) {
      localStorage.setItem(
        `carrito_tiket_${cartOwnerId}`,
        JSON.stringify(items)
      );
    }
  }, [items, cartOwnerId]);

  useEffect(() => {
    localStorage.setItem(
      "ordenes_tiket",
      JSON.stringify(ordenes)
    );
  }, [ordenes]);

  const iniciarSesion = (nuevaSesion) => {
    const idUsuario = String(nuevaSesion.id);

    const nuevoPropietario =
      nuevaSesion.rol === "admin" ? null : idUsuario;

    const carritoUsuario = obtenerCarrito(nuevoPropietario);

    setItems(carritoUsuario);
    setCartOwnerId(nuevoPropietario);
    setSesion(nuevaSesion);
    setUsuario(nuevaSesion);
    setTotalPagar(null);
    setVista("inicio");

    localStorage.setItem(
      "sesion",
      JSON.stringify(nuevaSesion)
    );

    localStorage.setItem(
      "usuario_tiket",
      JSON.stringify(nuevaSesion)
    );
  };

  const cerrarSesion = () => {
    setItems([]);
    setCartOwnerId(null);
    setSesion(null);
    setUsuario(null);
    setTotalPagar(null);
    setVista("login");

    localStorage.removeItem("sesion");
    localStorage.removeItem("usuario_tiket");
  };

  const actualizarOrdenes = (nuevaOrden) => {
    if (!nuevaOrden) return;

    const ordenConUsuario = {
      ...nuevaOrden,
      usuarioId: sesion?.id
    };

    setOrdenes((actuales) => [
      ...actuales,
      ordenConUsuario
    ]);

    setTotalPagar(null);
  };

  const cantidadBoletos = items.reduce(
    (total, item) =>
      total + (Number(item.cantidad) || 0),
    0
  );

  return (
    <div className="app">
      {!sesion ? (
        <Login onLogin={iniciarSesion} />
      ) : (
        <>
          <header className="encabezado">
            <h1>TicketMarket</h1>

            <nav>
              <button onClick={() => setVista("inicio")}>
                Inicio
              </button>

              {sesion.rol === "admin" ? (
                <>
                  <button
                    onClick={() => setVista("administracion")}
                  >
                    Administración
                  </button>

                  <button
                    onClick={() => setVista("reportes")}
                  >
                    Reportes
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setVista("fechas")}>
                    Boletos
                  </button>

                  <button onClick={() => setVista("carrito")}>
                    Carrito ({cantidadBoletos})
                  </button>

                  <button onClick={() => setVista("perfil")}>
                    Perfil
                  </button>
                </>
              )}

              <button onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </nav>
          </header>

          <main>
            {vista === "inicio" && (
              <BusquedaEventos
                usuario={sesion}
                setVista={setVista}
              />
            )}

            {vista === "administracion" &&
              sesion.rol === "admin" && (
                <AdministracionEventos />
              )}

            {vista === "reportes" &&
              sesion.rol === "admin" && (
                <Reportes ordenes={ordenes} />
              )}

            {vista === "fechas" &&
              sesion.rol !== "admin" && (
                <FechasBoletos
                  items={items}
                  setItems={setItems}
                  onIrACarrito={() => setVista("carrito")}
                />
              )}

            {vista === "carrito" &&
              sesion.rol !== "admin" && (
                <Carrito
                  items={items}
                  setItems={setItems}
                  onIrAPagar={(total) => {
                    setTotalPagar(total);
                    setVista("pagos");
                  }}
                />
              )}

            {vista === "pagos" &&
              sesion.rol !== "admin" && (
                <Pagos
                  items={items}
                  setItems={setItems}
                  total={totalPagar}
                  onCompraExitosa={actualizarOrdenes}
                />
              )}

            {vista === "perfil" &&
              sesion.rol !== "admin" && (
                <Perfil
                  usuario={usuario}
                  setUsuario={setUsuario}
                  setSesion={setSesion}
                  ordenes={ordenes}
                  onCerrarSesion={cerrarSesion}
                />
              )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
