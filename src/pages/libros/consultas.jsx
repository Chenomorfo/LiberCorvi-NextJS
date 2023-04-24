import React, { useState, useEffect } from "react";
import Router from "next/router";
//PrimeReact
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AutoComplete } from "primereact/autocomplete";
import { LibrosAPI } from "@/scripts/apiConn";

export async function getServerSideProps(context) {
  const { query } = context;
  const res = await fetch(
    LibrosAPI + "/consultar/libro?filtro=" + query.buscar
  );
  const data = await res.json();

  return { props: { data } };
}

function Consultas({ data }) {
  const [Search, setSearch] = useState("");
  return (
    <div className=" overflow-hidden grid gap-4">
      <AutoComplete
        placeholder="Buscar Coincidencias"
        style={{ height: "50px" }}
        value={Search}
        onChange={(e) => {
          setSearch(e.target.value);
          Router.push("/libros/consultas?buscar=" + e.target.value);
        }}
      />

      <DataTable
        value={data}
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
    </div>
  );
}

export default Consultas;
