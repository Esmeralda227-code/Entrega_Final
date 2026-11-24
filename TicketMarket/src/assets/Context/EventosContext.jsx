
import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from 'react';

import { eventos as eventosIniciales } from '../Data/eventos.js';

const EventosContext = createContext();

function eventosReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_EVENTO':
      return [...state, action.payload];

    case 'ACTUALIZAR_EVENTO':
      return state.map((evento) =>
        evento.id === action.payload.id
          ? action.payload
          : evento
      );

    case 'ELIMINAR_EVENTO':
      return state.filter(
        (evento) => evento.id !== action.payload
      );

    default:
      return state;
  }
}

function obtenerEventosIniciales() {
  const guardados = localStorage.getItem('eventos');

  if (!guardados) {
    return eventosIniciales;
  }

  const eventosGuardados = JSON.parse(guardados);

  const eventosActualizados = eventosIniciales.map((inicial) => {
    const guardado = eventosGuardados.find(
      (evento) => evento.id === inicial.id
    );

    if (!guardado) {
      return inicial;
    }

    return {
      ...inicial,
      ...guardado,
      titulo: inicial.titulo,
      descripcion: inicial.descripcion,
      categoria: inicial.categoria,
      imagen: inicial.imagen
    };
  });

  const eventosAdicionales = eventosGuardados.filter(
    (evento) =>
      !eventosIniciales.some(
        (inicial) => inicial.id === evento.id
      )
  );

  return [...eventosActualizados, ...eventosAdicionales];
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
  return useContext(EventosContext);
}
