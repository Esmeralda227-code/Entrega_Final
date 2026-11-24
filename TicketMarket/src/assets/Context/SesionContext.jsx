
import { createContext, useContext, useEffect, useReducer } from 'react';

const SesionContext = createContext();

function sesionReducer(state, action) {
  switch (action.type) {
    case 'INICIAR_SESION':
      return action.payload;

    case 'CERRAR_SESION':
      return null;

    default:
      return state;
  }
}

export function SesionProvider({ children }) {
  const [sesion, dispatch] = useReducer(
    sesionReducer,
    null,
    () => {
      const guardada = localStorage.getItem('sesion');
      return guardada ? JSON.parse(guardada) : null;
    }
  );

  useEffect(() => {
    if (sesion) {
      localStorage.setItem('sesion', JSON.stringify(sesion));
    } else {
      localStorage.removeItem('sesion');
    }
  }, [sesion]);

  const iniciarSesion = (usuario) => {
    dispatch({ type: 'INICIAR_SESION', payload: usuario });
  };

  const cerrarSesion = () => {
    dispatch({ type: 'CERRAR_SESION' });
  };

  return (
    <SesionContext.Provider
      value={{ sesion, iniciarSesion, cerrarSesion }}
    >
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SesionContext);
}
