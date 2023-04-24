import { useState, useRef } from "react";
import Router from "next/router";
import { AlumnosAPI, LibrosAPI } from "@/scripts/apiConn";

//PrimeReact
import { AutoComplete } from "primereact/autocomplete";

import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export async function getServerSideProps(context) {
  const { query } = context;
  const res = await fetch(
    LibrosAPI + "/consultar/ejemplar?ficha=" + query.ficha
  );
  const data = await res.json();

  return { props: { data: data[0] ?? {} } };
}

function Prestamos({ data }) {
  const [Estudiante, setEstudiante] = useState("");
  const [DatosEstudiante, setDatosEstudiante] = useState({});
  const [ListaAlumnos, setListaAlumnos] = useState([]);

  const [Libro, setLibro] = useState("");

  const toast = useRef(null);

  const Search = (event) => {
    fetch(AlumnosAPI + `/consultar?Ncontrol=${event.query}`)
      .then((data) => data.json())
      .then((data) =>
        setListaAlumnos(data.map(({ Numero_Control }) => Numero_Control))
      );
  };
  const EncontrarAlumno = async (alumno) => {
    const res = await fetch(AlumnosAPI + `/buscar?Ncontrol=${alumno}`);
    const data = await res.json();

    if (data.length) setDatosEstudiante(data[0]);
    else setDatosEstudiante({});
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid grid-cols-4 gap-8">
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
            <InputText
              placeholder="Nombre"
              value={DatosEstudiante.NombreCompleto ?? ""}
            />
          </div>
          <div style={{ height: "75px" }} className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-briefcase"></i>
            </span>
            <InputText
              placeholder="Especialidad"
              value={DatosEstudiante.Especialidad ?? ""}
            />
          </div>
          <div className="grid grid-flow-col gap-2 h-19">
            <Button label="Prestamo Interno" onClick={() => null} />
            <Button label="Prestamo Externo" onClick={() => null} />
          </div>
        </div>

        <div className="grid col-span-3 gap-4">
          <AutoComplete
            style={{ height: "75px" }}
            value={Libro}
            placeholder="Buscar Ficha"
            onChange={(e) => {
              setLibro(e.value);
              Router.push("/libros/prestamos?ficha=" + e.value);
            }}
          />
          <Fieldset legend={data.Autor}>
            <h2>{data.Titulo}</h2>
            <p style={{ textAlign: "justify" }}>{data.Contenido}</p>
            <h4 style={{ textAlign: "right" }}>{data.Clasificacion}</h4>
            <h5 style={{ textAlign: "right" }}>
              {data.Editorial} {data.Edicion}
            </h5>
          </Fieldset>
        </div>
      </div>
    </>
  );
}

export default Prestamos;
