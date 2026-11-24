
import { useEffect, useState } from "react";
import "./App.css";

import Login from "./assets/Components/Login.jsx";
import BusquedaEventos from "./assets/Components/BusquedaEventos.jsx";
import AdministracionEventos from "./assets/Components/AdministracionEventos.jsx";
import Reportes from "./assets/Components/Reportes.jsx";
import { FechasBoletos } from "./assets/Components/FechasBoletos.jsx";
import { Perfil } from "./assets/Components/Perfil.jsx";
import Carrito from "./assets/Components/Carrito.jsx";
import Pagos from "./assets/Components/Pagos.jsx";

const obtenerSesion = () => {
  try {
    const guardada = localStorage.getItem("sesion");
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
};

const obtenerCarrito = (id) => {
  if (!id) return [];

  try {
    return JSON.parse(
      localStorage.getItem(`carrito_tiket_${id}`)
    ) || [];
  } catch {
    return [];
  }
};

function App() {
  const [sesion, setSesion] = useState(obtenerSesion);

  const [items, setItems] = useState(() =>
    obtenerCarrito(
      obtenerSesion()?.rol === "admin"
        ? null
        : obtenerSesion()?.id
    )
  );

  const [cartOwnerId, setCartOwnerId] = useState(() => {
    const usuarioActual = obtenerSesion();

    if (!usuarioActual || usuarioActual.rol === "admin") {
      return null;
    }

    return String(usuarioActual.id);
  });

  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario_tiket")) || null;
    } catch {
      return null;
    }
  });

  const [ordenes, setOrdenes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ordenes_tiket")) || [];
    } catch {
      return [];
    }
  });

  const [vista, setVista] = useState(() =>
    obtenerSesion() ? "inicio" : "login"
  );

  useEffect(() => {
    if (cartOwnerId !== null) {
      localStorage.setItem(
        `carrito_tiket_${cartOwnerId}`,
        JSON.stringify(items)
      );
    }
  }, [items, cartOwnerId]);

  useEffect(() => {
    localStorage.setItem("ordenes_tiket", JSON.stringify(ordenes));
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

    localStorage.setItem("sesion", JSON.stringify(nuevaSesion));
    localStorage.setItem("usuario_tiket", JSON.stringify(nuevaSesion));

    setVista("inicio");
  };

  const cerrarSesion = () => {
    setItems([]);
    setCartOwnerId(null);
    setSesion(null);
    setUsuario(null);
    setVista("login");

    localStorage.removeItem("sesion");
    localStorage.removeItem("usuario_tiket");
  };

  const actualizarOrdenes = (nuevaOrden) => {
    setOrdenes((actuales) => [...actuales, nuevaOrden]);
  };

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
                  <button onClick={() => setVista("administracion")}>
                    Administración
                  </button>

                  <button onClick={() => setVista("reportes")}>
                    Reportes
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setVista("fechas")}>
                    Boletos
                  </button>

                  <button onClick={() => setVista("carrito")}>
                    Carrito ({items.length})
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

            {vista === "administracion" && sesion.rol === "admin" && (
              <AdministracionEventos />
            )}

            {vista === "reportes" && sesion.rol === "admin" && (
              <Reportes ordenes={ordenes} />
            )}

            {vista === "fechas" && sesion.rol !== "admin" && (
              <FechasBoletos
                items={items}
                setItems={setItems}
                onIrACarrito={() => setVista("carrito")}
              />
            )}

            {vista === "carrito" && sesion.rol !== "admin" && (
              <Carrito
                items={items}
                setItems={setItems}
                onIrAPagar={() => setVista("pagos")}
              />
            )}

            {vista === "pagos" && sesion.rol !== "admin" && (
              <Pagos
                items={items}
                setItems={setItems}
                onCompraExitosa={actualizarOrdenes}
              />
            )}

            {vista === "perfil" && sesion.rol !== "admin" && (
              <Perfil
                usuario={usuario}
                setUsuario={setUsuario}
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
