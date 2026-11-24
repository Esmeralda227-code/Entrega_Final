import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from 'react';

import { eventos as eventosIniciales } from '../Data/eventos.js';

const EventosContext = createContext(null);

function eventosReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_EVENTO':
      return [...state, action.payload];

    case 'ACTUALIZAR_EVENTO':
      return state.map((evento) =>
        String(evento.id) === String(action.payload.id)
          ? action.payload
          : evento
      );

    case 'ELIMINAR_EVENTO':
      return state.filter(
        (evento) => String(evento.id) !== String(action.payload)
      );

    default:
      return state;
  }
}

function obtenerEventosIniciales() {
  try {
    const guardados = localStorage.getItem('eventos');

    if (!guardados) {
      return eventosIniciales;
    }

    const eventosGuardados = JSON.parse(guardados);

    if (!Array.isArray(eventosGuardados)) {
      return eventosIniciales;
    }

    return eventosGuardados;
  } catch {
    return eventosIniciales;
  }
}

export function EventosProvider({ children }) {
  const [eventos, dispatch] = useReducer(
    eventosReducer,
    null,
    obtenerEventosIniciales
  );

  useEffect(() => {
    localStorage.setItem('eventos', JSON.stringify(eventos));
  }, [eventos]);

  return (
    <EventosContext.Provider value={{ eventos, dispatch }}>
      {children}
    </EventosContext.Provider>
  );
}

export function useEventos() {
  const contexto = useContext(EventosContext);

  if (!contexto) {
    throw new Error(
      'useEventos debe utilizarse dentro de EventosProvider'
    );
  }

  return contexto;
}