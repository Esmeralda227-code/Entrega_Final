
import { useState, useEffect } from 'react';
import './App.css';

import Login from './assets/Components/Login.jsx';
import BusquedaEventos from './assets/Components/BusquedaEventos.jsx';
import AdministracionEventos from './assets/Components/AdministracionEventos.jsx';
import Reportes from './assets/Components/Reportes.jsx';
import { FechasBoletos } from './assets/Components/FechasBoletos.jsx';
import { Perfil } from './assets/Components/Perfil.jsx';
import { Pagos } from './assets/Components/Pagos.jsx';
import { Carrito } from './assets/Components/Carrito.jsx';

import { EventosProvider } from './assets/Context/EventosContext.jsx';

import logo from './assets/Imagenes/Logo.png';

function App() {
  const [sesion, setSesion] = useState(() => {
    const guardada = localStorage.getItem('sesion');
    return guardada ? JSON.parse(guardada) : null;
  });

  const [vista, setVista] = useState('inicio');

  const [items, setItems] = useState(() => {
    const guardada = localStorage.getItem('sesion');

    if (!guardada) return [];

    const usuarioActual = JSON.parse(guardada);
    const carritoGuardado = localStorage.getItem(
      `carrito_tiket_${usuarioActual.id}`
    );

    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  const [cartOwnerId, setCartOwnerId] = useState(() => {
    const guardada = localStorage.getItem('sesion');
    if (!guardada) return null;

    const usuarioActual = JSON.parse(guardada);
    return usuarioActual.rol === 'admin' ? null : usuarioActual.id;
  });

  const [ordenes, setOrdenes] = useState(() => {
    const guardado = localStorage.getItem('ordenes_tiket');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario_tiket');
    return guardado ? JSON.parse(guardado) : { nombre: '', correo: '' };
  });

  // Guardar únicamente el carrito del usuario dueño del estado actual.
  useEffect(() => {
    if (cartOwnerId !== null) {
      localStorage.setItem(
        `carrito_tiket_${cartOwnerId}`,
        JSON.stringify(items)
      );
    }
  }, [items, cartOwnerId]);

  const agregarOrden = (nuevaOrden) => {
    setOrdenes((prev) => {
      const actualizadas = [nuevaOrden, ...prev];
      localStorage.setItem('ordenes_tiket', JSON.stringify(actualizadas));
      return actualizadas;
    });
  };

  const iniciarSesion = (nuevaSesion) => {
    const carritoGuardado =
      nuevaSesion.rol === 'admin'
        ? null
        : localStorage.getItem(`carrito_tiket_${nuevaSesion.id}`);

    const carritoUsuario = carritoGuardado
      ? JSON.parse(carritoGuardado)
      : [];

    setItems(carritoUsuario);
    setCartOwnerId(nuevaSesion.rol === 'admin' ? null : nuevaSesion.id);
    setSesion(nuevaSesion);

    const nuevoUsuario = {
      nombre: nuevaSesion.nombre,
      correo: nuevaSesion.correo
    };

    setUsuario(nuevoUsuario);

    localStorage.setItem('sesion', JSON.stringify(nuevaSesion));
    localStorage.setItem('usuario_tiket', JSON.stringify(nuevoUsuario));

    setVista('inicio');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('sesion');
    localStorage.removeItem('usuario_tiket');

    setSesion(null);
    setUsuario({ nombre: '', correo: '' });
    setItems([]);
    setCartOwnerId(null);
    setVista('inicio');
  };

  return (
    <EventosProvider>
      {!sesion ? (
        <Login onLogin={iniciarSesion} />
      ) : (
        <div className="app">
          <header className="encabezado">
            <img
              src={logo}
              alt="Logo de TicketMarket"
              className="logo"
            />
            <h1>TicketMarket</h1>

            {sesion.rol !== 'admin' && (
              <nav>
                <button type="button" onClick={() => setVista('inicio')}>
                  Eventos
                </button>

                <button type="button" onClick={() => setVista('fechas')}>
                  Fechas y boletos
                </button>

                <button type="button" onClick={() => setVista('carrito')}>
                  Mi carrito ({items.length})
                </button>

                <button type="button" onClick={() => setVista('pagos')}>
                  Pagos
                </button>

                <button type="button" onClick={() => setVista('perfil')}>
                  Mi perfil
                </button>
              </nav>
            )}
          </header>

          <div className="sesion-usuario">
            <div>
              <h2>Bienvenido, {sesion.nombre}</h2>
              <p>Rol: {sesion.rol}</p>
            </div>

            <button type="button" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>

          {sesion.rol === 'admin' ? (
            <>
              <AdministracionEventos />
              <Reportes />
            </>
          ) : (
            <main>
              {vista === 'inicio' && <BusquedaEventos />}

              {vista === 'carrito' && (
                <Carrito
                  items={items}
                  setItems={setItems}
                  onIrAPagar={() => setVista('pagos')}
                />
              )}

              {vista === 'pagos' && (
                <Pagos
                  items={items}
                  setItems={setItems}
                  onCompraExitosa={agregarOrden}
                />
              )}

              {vista === 'perfil' && (
                <Perfil
                  usuario={usuario}
                  setUsuario={setUsuario}
                  ordenes={ordenes}
                  onCerrarSesion={cerrarSesion}
                />
              )}

              {vista === 'fechas' && (
                <FechasBoletos
                  items={items}
                  setItems={setItems}
                  onIrACarrito={() => setVista('carrito')}
                />
              )}
            </main>
          )}
        </div>
      )}
    </EventosProvider>
  );
}

export default App;
