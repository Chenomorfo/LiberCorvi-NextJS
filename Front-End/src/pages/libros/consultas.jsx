import React, { useState, useEffect } from "react";

//PrimeReact
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AutoComplete } from "primereact/autocomplete";
import { LibrosAPI } from "@/scripts/apiConn";

function Consultas() {
  function fetchConsultas(filtro = "") {
    fetch(LibrosAPI + "/consultar/libro?filter=" + filtro)
      .then((data) => data.json())
      .then((data) => setLibros(data));
  }

  const [Libros, setLibros] = useState([]);
  const [Search, setSearch] = useState("");

  useEffect(() => {
    fetchConsultas();
  }, []);

  return (
    <section className=" overflow-hidden grid gap-4">
      <AutoComplete
        placeholder="Buscar Coincidencias"
        style={{ height: "50px" }}
        value={Search}
        onChange={(e) => {
          setSearch(e.value);
          fetchConsultas(e.value);
        }}
      />

      <DataTable
        value={Libros}
        stripedRows
        tableStyle={{ minWidth: "50rem", height: "100%" }}
        scrollHeight="75vh"
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
  );
}

export default Consultas;
