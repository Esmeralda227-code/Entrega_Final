import { useState } from 'react';
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
    const guardado = localStorage.getItem('carrito_tiket');
    return guardado ? JSON.parse(guardado) : [];
  });
  const [ordenes, setOrdenes] = useState(() => {
    const guardado = localStorage.getItem('ordenes_tiket');
    return guardado ? JSON.parse(guardado) : [];
  });

  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario_tiket');
    return guardado ? JSON.parse(guardado) : { nombre: '', correo: '' };
  });

  const agregarOrden = (nuevaOrden) => {
    setOrdenes((prev) => {
      const actualizadas = [nuevaOrden, ...prev];
      localStorage.setItem('ordenes_tiket', JSON.stringify(actualizadas));
      return actualizadas;
    });

  };
  const cerrarSesion = () => {
    localStorage.removeItem('sesion');s
    setSesion(null);
  };

  return (
    <EventosProvider>
      {!sesion ? (
        <Login onLogin={setSesion} />
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

            <button onClick={cerrarSesion}>
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