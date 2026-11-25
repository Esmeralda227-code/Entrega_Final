
import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from "react";

const SesionContext = createContext(null);

function sesionReducer(state, action) {
  switch (action.type) {
    case "INICIAR_SESION":
      return action.payload;

    case "CERRAR_SESION":
      return null;

    default:
      return state;
  }
}

function obtenerSesionInicial() {
  try {
    const guardada = localStorage.getItem("sesion");
    return guardada ? JSON.parse(guardada) : null;
  } catch (error) {
    console.error("Error al recuperar la sesión:", error);
    localStorage.removeItem("sesion");
    return null;
  }
}

export function SesionProvider({ children }) {
  const [sesion, dispatch] = useReducer(
    sesionReducer,
    null,
    obtenerSesionInicial
  );

  useEffect(() => {
    if (sesion) {
      localStorage.setItem("sesion", JSON.stringify(sesion));
    } else {
      localStorage.removeItem("sesion");
    }
  }, [sesion]);

  const iniciarSesion = (usuario) => {
    dispatch({
      type: "INICIAR_SESION",
      payload: usuario
    });
  };

  const cerrarSesion = () => {
    dispatch({ type: "CERRAR_SESION" });
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
  const contexto = useContext(SesionContext);

  if (!contexto) {
    throw new Error(
      "useSesion debe utilizarse dentro de SesionProvider."
    );
  }

  return contexto;
}
