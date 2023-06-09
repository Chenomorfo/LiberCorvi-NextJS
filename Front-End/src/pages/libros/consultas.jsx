import React, { useState, useEffect } from "react";

//PrimeReact
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AutoComplete } from "primereact/autocomplete";
import { LibrosAPI } from "@/scripts/apiConn";
import { Dialog } from "primereact/dialog";

export default function Consultas() {
  function fetchConsultas(libro = "", autor = "", contenido = "") {
    fetch(
      LibrosAPI +
        "/consultar/libro?libro=" +
        libro +
        "&autor=" +
        autor +
        "&contenido=" +
        contenido
    )
      .then((data) => data.json())
      .then((data) => setLibros(data));
  }

  const [Libros, setLibros] = useState([]);
  const [filtroAutor, setFiltroAutor] = useState("");
  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroContenido, setFiltroContenido] = useState("");

  const [visible, setVisible] = useState(false);
  const [consulta, setConsulta] = useState({});

  const onRowSelect = async ({ data }) => {
    const res = await fetch(
      LibrosAPI + "/buscar/ficha?ficha=" + data.Numero_Ficha
    );
    const ficha = await res.json();
    const example = {
      Libro: data,
      Lista: ficha.Lista,
    };
    setConsulta({
      Libro: data,
      Lista: ficha.Lista,
    });
    console.log(example);
    setVisible(true);
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  return (
    <>
      <Dialog
        header={"Ficha: " + consulta.Libro?.Numero_Ficha ?? "Sin informacion"}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <section className="grid grid-flow-col gap-3">
          <div>
            <h3 className="text-xl">{consulta.Libro?.Autor ?? "Sin Autor"}</h3>
            <h1 className="text-2xl">
              {consulta.Libro?.Titulo ?? "Sin titulo"}
            </h1>
            <p className="pt-3 text-justify">
              {consulta.Libro?.Contenido ?? "Sin Contenido"}
            </p>
          </div>
          <div>
            <h1 className="text-2xl p-2">Ejemplares</h1>

            <DataTable
              scrollHeight="350px"
              scrollable
              selectionMode="single"
              value={consulta.Lista}
            >
              <Column
                body={({ Disponibilidad, Numero_Adquisicion }) => {
                  return (
                    <h1 className={Disponibilidad > 0 ? null : "text-red-500"}>
                      {Numero_Adquisicion}
                    </h1>
                  );
                }}
                field="Numero_Adquisicion"
                header={"# Ejemplar"}
              />
            </DataTable>
          </div>
        </section>
      </Dialog>
      <section className=" overflow-hidden grid gap-4">
        <div className="flex gap-2">
          <AutoComplete
            placeholder="Buscar Titulo"
            style={{ height: "50px" }}
            value={filtroTitulo}
            onChange={(e) => {
              setFiltroTitulo(e.value);
              fetchConsultas(e.value, filtroAutor, filtroContenido);
            }}
          />
          <AutoComplete
            placeholder="Buscar Autor"
            style={{ height: "50px" }}
            value={filtroAutor}
            onChange={(e) => {
              setFiltroAutor(e.value);
              fetchConsultas(filtroTitulo, e.value, filtroContenido);
            }}
          />
          <AutoComplete
            placeholder="Buscar Contenido"
            style={{ height: "50px" }}
            value={filtroContenido}
            onChange={(e) => {
              setFiltroContenido(e.value);
              fetchConsultas(filtroTitulo, filtroAutor, e.value);
            }}
          />
        </div>

        <DataTable
          value={Libros}
          stripedRows
          selectionMode="single"
          tableStyle={{ minWidth: "50rem", height: "100%" }}
          scrollHeight="75vh"
          onRowSelect={onRowSelect}
        >
          <Column field="Numero_Ficha" header="# Ficha" />
          <Column
            field="Clasificacion"
            header="Clasificacion"
            style={{ width: "12%" }}
          />
          <Column field="Titulo" header="Titulo" style={{ width: "60%" }} />
          <Column field="Autor" header="Autor" style={{ width: "16%" }} />
        </DataTable>
      </section>
    </>
  );
}
