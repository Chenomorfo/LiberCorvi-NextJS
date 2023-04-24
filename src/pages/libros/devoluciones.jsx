import { useState } from "react";
import Router from "next/router";
//PrimeReact
import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { AlumnosAPI, LibrosAPI } from "@/scripts/apiConn";
import { addDays } from "@/scripts/dates";

export async function getServerSideProps(context) {
  const res = await fetch(LibrosAPI + "/consultar/prestamo");
  const data = await res.json();

  return { props: { data } };
}

function Devoluciones({ data }) {
  const [Alumno, setAlumno] = useState("");
  const [DatosEstudiante, setDatosEstudiante] = useState({});
  const [ListaAlumnos, setListaAlumnos] = useState([]);

  const RenovarLibro = async (IdRegistro) => {
    await fetch(LibrosAPI + `/prestamo/renovar/${IdRegistro}`, {
      method: "PUT",
      body: JSON.stringify({ FechaDevolucion: addDays(new Date(), 2) }),
      headers: { "Content-type": "application/json" },
    });
    Router.push("/libros/devoluciones");
  };

  const DevolverLibro = async (IdRegistro) => {
    await fetch(LibrosAPI + `/prestamo/devolver/${IdRegistro}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
    });
    Router.push("/libros/devoluciones");
  };

  const EncontrarAlumno = async (alumno) => {
    const res = await fetch(AlumnosAPI + `/buscar?Ncontrol=${alumno}`);
    const data = await res.json();

    if (data.length) setDatosEstudiante(data[0]);
    else setDatosEstudiante({});
  };

  const Search = (event) => {
    fetch(AlumnosAPI + `/consultar?Ncontrol=${event.query}`)
      .then((data) => data.json())
      .then((data) =>
        setListaAlumnos(data.map(({ Numero_Control }) => Numero_Control))
      );
  };

  return (
    <div className="grid grid-cols-4 gap-8">
      <section className="grid gap-4 h-40">
        <AutoComplete
          value={Alumno}
          suggestions={ListaAlumnos}
          placeholder="Buscar Alumno"
          completeMethod={Search}
          onChange={(e) => {
            setAlumno(e.value);
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
      </section>

      <DataTable value={data} className="col-span-3">
        <Column field="Estudiante" header="# Control" />
        <Column field="Nombre" header="Nombre" />
        <Column field="FichaEjemplar" header="# Ficha" />
        <Column
          field="FechaAdquisicion"
          header="Fecha Adquisicion"
          body={({ FechaAdquisicion }) =>
            new Date(FechaAdquisicion).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }
        />
        <Column
          field="FechaDevolucion"
          header="Fecha Devolucion"
          body={({ FechaDevolucion }) =>
            new Date(FechaDevolucion).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }
        />
        <Column
          body={({ Id_Prestamo, Renovacion }) => (
            <Button
              label="Renovar"
              disabled={Renovacion == 0}
              onClick={() => RenovarLibro(Id_Prestamo)}
            />
          )}
        />
        <Column
          body={({ Id_Prestamo }) => (
            <Button
              label="Devolver"
              onClick={() => DevolverLibro(Id_Prestamo)}
            />
          )}
        />
      </DataTable>
    </div>
  );
}

export default Devoluciones;
