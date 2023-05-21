import React, { useEffect, useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { showError, showSuccess } from "@/scripts/alerts";
//import { ws } from "@/scripts/esp32ws";

function Label({ title, value, icon = "user" }) {
  return (
    <div style={{ height: "75px" }} className="p-inputgroup">
      <span className="p-inputgroup-addon">
        <i className={"pi pi-" + icon}></i>
      </span>
      <InputText placeholder={title} value={value} />
    </div>
  );
}

function uid() {
  const [uid, setUid] = useState("");
  const [alumno, setAlumno] = useState({});
  const toast = useRef(null);

  const encontrarAlumno = async (rfid) => {
    const res = await fetch("http://localhost:4200/test/rfid/registros", {
      method: "POST",
      body: JSON.stringify({ rfid }),
      headers: { "Content-type": "application/json" },
    });

    const data = await res.json();
    setAlumno(data);
  };

  const getMessage = (event) => {
    setUid(event.data.substring(1));
    encontrarAlumno(event.data.substring(1));
  };

  useEffect(() => {
    (async () => {
      const ws = await new WebSocket("ws://192.168.1.116:3100/ws");
      await setTimeout(() => {
        if (ws.readyState > 0) {
          ws.onmessage = getMessage;
          toast.current?.show(
            showSuccess(
              "WebSocket Conectado",
              "La conexion al websocket ha resultado exitosa"
            )
          );
        } else {
          toast.current?.show(
            showError(
              "WebSocket ha fallado",
              "La conexion al websocket no ha podido establecerse"
            )
          );
        }
      }, 200);
    })();
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <section className="grid grid-cols-6 gap-3" style={{ height: "80vh" }}>
        <div className="col-span-2 grid gap-2 h-48">
          {/* <h1>UID: {uid}</h1> */}
          <Label icon="id-card" title={"UID"} value={uid} />
          <Label icon="user" title={"Nombre"} value={alumno.Alumno?.Nombre} />
          <Label
            icon="briefcase"
            title={"Carrera"}
            value={alumno.Alumno?.Especialidad}
          />
        </div>
        {/* AQUI IRA EL REGISTRO DE SERVICIOS */}
        <DataTable
          className="col-span-4"
          selectionMode="single"
          scrollHeight="80vh"
          value={alumno.Alumno?.Historial}
        >
          <Column header="Servicio" field="Servicio" />
          <Column
            header="Solicitado el"
            field="Fecha"
            body={({ Fecha }) =>
              new Date(Fecha).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }
          />
          <Column
            header="Prestamo"
            field="Registro_Prestamo.Libro_Numero_Ejemplar"
          />
          <Column
            header="Fecha Limite"
            field="Registro_Prestamo"
            body={({ Registro_Prestamo }) =>
              !Registro_Prestamo
                ? null
                : Registro_Prestamo.Interno
                ? null
                : Registro_Prestamo.Devolucion
                ? new Date(
                    Registro_Prestamo?.Fecha_Devolucion
                  ).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Entregado"
            }
          />
        </DataTable>
      </section>
    </>
  );
}

export default uid;
