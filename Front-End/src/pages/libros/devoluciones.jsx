import { useState } from "react";

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
  const [DataAlumno, setDataAlumno] = useState({});
  const [ListaAlumnos, setListaAlumnos] = useState([]);

  const [Prestamos, setPrestamos] = useState(data);

  const RenovarLibro = async (Id) => {
    await fetch(LibrosAPI + `/renovar/prestamo/${Id}`, {
      method: "PUT",
    });

    const res = await fetch(LibrosAPI + "/consultar/prestamo");
    setPrestamos(await res.json());
  };

  const DevolverLibro = async (Id) => {
    await fetch(LibrosAPI + `/devolver/prestamo/${Id}`, {
      method: "PUT",
    });

    const res = await fetch(LibrosAPI + "/consultar/prestamo");
    setPrestamos(await res.json());
  };

  const EncontrarAlumno = async (nc) => {
    const res = await fetch(AlumnosAPI + `/buscar?nc=${nc}`);
    const data = await res.json();

    console.log(data);
    if (!data.Error) setDataAlumno(data);
    else setDataAlumno({});
  };

  const Search = (event) => {
    fetch(AlumnosAPI + `/consultar?nc=${event.query}`)
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
          <InputText placeholder="Nombre" value={DataAlumno.Nombre ?? ""} />
        </div>
        <div style={{ height: "75px" }} className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-briefcase"></i>
          </span>
          <InputText
            placeholder="Especialidad"
            value={DataAlumno.Especialidad ?? ""}
          />
        </div>
      </section>

      <DataTable value={Prestamos} className="col-span-3">
        <Column field="Estudiante_Numero_Control" header="# Control" />
        <Column field="Estudiante_Numero_Control" header="Nombre" />
        <Column field="Libro_Numero_Ficha" header="# Ficha" />
        <Column
          field="Fecha_Adquisicion"
          header="Fecha Adquisicion"
          body={({ Fecha_Adquisicion }) =>
            new Date(Fecha_Adquisicion).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }
        />
        <Column
          field="Fecha_Devolucion"
          header="Fecha Devolucion"
          body={({ Fecha_Devolucion }) =>
            new Date(Fecha_Devolucion).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }
        />
        <Column
          body={({ Id, Renovacion }) => (
            <Button
              label="Renovar"
              disabled={Renovacion == 0}
              onClick={() => RenovarLibro(Id)}
            />
          )}
        />
        <Column
          body={({ Id }) => (
            <Button label="Devolver" onClick={() => DevolverLibro(Id)} />
          )}
        />
      </DataTable>
    </div>
  );
}

export default Devoluciones;
