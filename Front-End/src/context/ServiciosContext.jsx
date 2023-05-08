import { createContext, useState } from "react";

export const ServiciosContext = createContext();

export function ServiciosContextProvider({ children }) {
  const [Lista, setLista] = useState([]);

  const EnlistarAlumno = (alumno) => {
    setLista([...Lista, alumno]);
  };

  const RemoverAlumno = (alumno) => {
    setLista(Lista.filter((e) => e.Numero_Control != alumno.Numero_Control));
  };

  const AsignarServicio = () => {
    const alumnos = Lista;
    setLista([]);
    return alumnos;
  };

  return (
    <ServiciosContext.Provider
      value={{
        Lista,
        EnlistarAlumno,
        RemoverAlumno,
        AsignarServicio,
      }}
    >
      {children}
    </ServiciosContext.Provider>
  );
}
