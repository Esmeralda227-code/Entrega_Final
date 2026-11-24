
import { useState } from 'react';
import { usuarios } from '../Data/usuarios.js';
import logo from '../Imagenes/logo.png';

function Login({ onLogin }) {
  const [vista, setVista] = useState('login');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const validarCorreo = (valor) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
  };

  const manejarArroba = (e) => {
    if (e.ctrlKey && e.altKey && e.code === 'KeyQ') {
      e.preventDefault();

      const input = e.currentTarget;
      const inicio = input.selectionStart ?? input.value.length;
      const final = input.selectionEnd ?? inicio;

      setCorreo((actual) =>
        actual.slice(0, inicio) + '@' + actual.slice(final)
      );

      requestAnimationFrame(() => {
        input.setSelectionRange(inicio + 1, inicio + 1);
      });
    }
  };

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    setNombre('');
    setCorreo('');
    setPassword('');
    setMensaje('');
  };

  const iniciarSesion = (e) => {
    e.preventDefault();
    setMensaje('');

    if (!validarCorreo(correo)) {
      setMensaje('Ingresa un correo válido. Ejemplo: correo@gmail.com');
      return;
    }

    const registrados = JSON.parse(
      localStorage.getItem('usuariosRegistrados') || '[]'
    );

    const todosLosUsuarios = [...usuarios, ...registrados];

    const usuario = todosLosUsuarios.find(
      (u) =>
        u.correo.toLowerCase() === correo.trim().toLowerCase() &&
        u.password === password
    );

    if (!usuario) {
      setMensaje('Correo o contraseña incorrectos.');
      return;
    }

    const sesion = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };

    localStorage.setItem('sesion', JSON.stringify(sesion));
    onLogin(sesion);
  };

  const registrarCuenta = (e) => {
    e.preventDefault();
    setMensaje('');

    if (!validarCorreo(correo)) {
      setMensaje('Ingresa un correo válido. Ejemplo: correo@gmail.com');
      return;
    }

    if (password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const registrados = JSON.parse(
      localStorage.getItem('usuariosRegistrados') || '[]'
    );

    const existe = [...usuarios, ...registrados].some(
      (u) => u.correo.toLowerCase() === correo.trim().toLowerCase()
    );

    if (existe) {
      setMensaje('Este correo ya está registrado.');
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      password,
      rol: 'cliente'
    };

    localStorage.setItem(
      'usuariosRegistrados',
      JSON.stringify([...registrados, nuevoUsuario])
    );

    const sesion = {
      id: nuevoUsuario.id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol
    };

    localStorage.setItem('sesion', JSON.stringify(sesion));
    onLogin(sesion);
  };

  return (
    <main className="contenedor-sesion">
      <section className="panel-formulario">
        <img
          src={logo}
          alt="TicketMarket"
          className="logo-sesion"
        />

        {vista === 'login' ? (
          <div>
            <h1>Iniciar sesión</h1>
            <p className="subtexto">
              Ingresa con tu cuenta para continuar
            </p>

            <form onSubmit={iniciarSesion}>
              <label htmlFor="loginCorreo">
                Correo electrónico
              </label>

              <input
                id="loginCorreo"
                type="text"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onKeyDown={manejarArroba}
                required
              />

              <label htmlFor="loginClave">Contraseña</label>
              <input
                id="loginClave"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn-principal">
                Entrar
              </button>
            </form>

            <p className="cambio-vista">
              ¿No tienes cuenta?
              <button
                type="button"
                className="btn-enlace"
                onClick={() => cambiarVista('registro')}
              >
                Regístrate
              </button>
            </p>
          </div>
        ) : (
          <div>
            <h1>Crear cuenta</h1>
            <p className="subtexto">
              Regístrate para reservar tus entradas
            </p>

            <form onSubmit={registrarCuenta}>
              <label htmlFor="regNombre">Nombre</label>
              <input
                id="regNombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <label htmlFor="regCorreo">
                Correo electrónico
              </label>

              <input
                id="regCorreo"
                type="text"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onKeyDown={manejarArroba}
                required
              />

              <label htmlFor="regClave">Contraseña</label>
              <input
                id="regClave"
                type="password"
                placeholder="Crea una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              <button type="submit" className="btn-principal">
                Registrarse
              </button>
            </form>

            <p className="cambio-vista">
              ¿Ya tienes cuenta?
              <button
                type="button"
                className="btn-enlace"
                onClick={() => cambiarVista('login')}
              >
                Inicia sesión
              </button>
            </p>
          </div>
        )}

        {mensaje && (
          <p className="mensaje-sesion">{mensaje}</p>
        )}
      </section>

      <aside className="panel-lateral">
        <h2>Reserva tus entradas</h2>
        <p>
          Encuentra eventos de música, videojuegos y comedia
        </p>
      </aside>
    </main>
  );
}

export default Login;
