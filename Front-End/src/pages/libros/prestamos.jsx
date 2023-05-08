import { useState, useRef } from "react";
import { AlumnosAPI, LibrosAPI, ServiciosAPI } from "@/scripts/apiConn";

//PrimeReact
import { AutoComplete } from "primereact/autocomplete";

import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { verifyUser } from "@/scripts/auths";
import { showInfo } from "@/scripts/alerts";

function Prestamos() {
  const [Estudiante, setEstudiante] = useState("");
  const [Datos, setDatos] = useState({});
  const [ListaAlumnos, setListaAlumnos] = useState([]);

  const [Libro, setLibro] = useState({});
  const [Filtro, setFiltro] = useState("");

  const toast = useRef(null);

  const Search = (event) => {
    fetch(AlumnosAPI + `/consultar?nc=${event.query}`)
      .then((data) => data.json())
      .then((data) =>
        setListaAlumnos(data.map(({ Numero_Control }) => Numero_Control))
      );
  };

  const EncontrarAlumno = async (nc) => {
    const res = await fetch(AlumnosAPI + `/buscar?nc=${nc}`);
    const data = await res.json();

    if (!data.Error) setDatos(data);
    else setDatos({});
  };

  const EncontrarLibro = (value) => {
    fetch(LibrosAPI + "/consultar/ejemplar?libro=" + value)
      .then((data) => data.json())
      .then((data) => {
        if (data.length) setLibro(data[0]);
        else setLibro({});
      });
  };

  const RegistrarPrestamo = async (esInterno = false) => {
    if (Object.keys(Libro).length === 0 || Object.keys(Datos).length === 0) {
      toast.current.show(
        showInfo("¿Necesitas un Tip?", "Necesita tener un alumno y un libro")
      );
    } else {
      await fetch(LibrosAPI + "/registrar/prestamo", {
        method: "POST",
        body: JSON.stringify({
          ficha: Libro.Numero_Ficha,
          ejemplar: Libro.Numero_Adquisicion,
          nc: Datos.Numero_Control,
        }),
        headers: { "Content-type": "application/json" },
      });

      const servicio = esInterno ? "Prestamo_Interno" : "Prestamo_Externo";

      const user = await verifyUser();

      await fetch(ServiciosAPI + "/registrar?area=" + servicio, {
        method: "POST",
        body: JSON.stringify({
          lista: [Datos.Numero_Control],
          usuario: user.Rol.Code,
        }),
        headers: { "Content-type": "application/json" },
      });

      setDatos({});
      setEstudiante("");
      setLibro({});
      setFiltro("");
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <section className="grid grid-cols-4 gap-8">
        <div className="grid gap-4 h-48">
          <AutoComplete
            value={Estudiante}
            suggestions={ListaAlumnos}
            placeholder="Buscar Alumno"
            completeMethod={Search}
            onChange={(e) => {
              setEstudiante(e.value);
              EncontrarAlumno(e.value);
            }}
            dropdown
            style={{ height: "75px" }}
          />
          <div style={{ height: "75px" }} className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText placeholder="Nombre" value={Datos.Nombre ?? ""} />
          </div>
          <div style={{ height: "75px" }} className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-briefcase"></i>
            </span>
            <InputText
              placeholder="Especialidad"
              value={Datos.Especialidad ?? ""}
            />
          </div>
          <div className="grid grid-flow-col gap-2 h-19">
            <Button
              label="Prestamo Interno"
              onClick={() => RegistrarPrestamo(true)}
            />
            <Button
              label="Prestamo Externo"
              onClick={() => RegistrarPrestamo()}
            />
          </div>
        </div>

        <div className="grid col-span-3 gap-4">
          <AutoComplete
            style={{ height: "75px" }}
            value={Filtro}
            placeholder="Buscar Ficha"
            onChange={(e) => {
              setFiltro(e.value);
              EncontrarLibro(e.value);
            }}
          />
          <Fieldset legend={Libro.Autor}>
            <h2>{Libro.Titulo}</h2>
            <p style={{ textAlign: "justify" }}>{Libro.Contenido}</p>
            <h4 style={{ textAlign: "right" }}>{Libro.Clasificacion}</h4>
            <h5 style={{ textAlign: "right" }}>
              {Libro.Editorial} {Libro.Edicion}
            </h5>
          </Fieldset>
        </div>
      </section>
    </>
  );
}

export default Prestamos;
