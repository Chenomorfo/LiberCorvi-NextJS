import React, { useState, useEffect } from "react";

//PrimeReact
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AutoComplete } from "primereact/autocomplete";
import { LibrosAPI } from "@/scripts/apiConn";
import { Dialog } from "primereact/dialog";
import { ListBox } from "primereact/listbox";

function Consultas() {
  function fetchConsultas(filtro = "") {
    fetch(LibrosAPI + "/consultar/libro?filter=" + filtro)
      .then((data) => data.json())
      .then((data) => setLibros(data));
  }

  const [Libros, setLibros] = useState([]);
  const [Search, setSearch] = useState("");

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
        header={"Ficha: "+ consulta.Libro?.Numero_Ficha ?? "Sin informacion"}
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
            <h1 className="text-2xl p-2">Fichas</h1>
            <ListBox
              options={consulta.Lista}
              optionLabel="Numero_Adquisicion"
              virtualScrollerOptions={{ itemSize: 38 }}
              listStyle={{ height: "250px", width: "150px" }}
            />
          </div>
        </section>
      </Dialog>
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

export default Consultas;
