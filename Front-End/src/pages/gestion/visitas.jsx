import React, { useEffect, useRef, useState } from "react";
import Counter from "@/components/Contador";
import { API, GestionarAPI } from "@/scripts/apiConn";
import { verifyUser } from "@/scripts/auths";
import { Toast } from "primereact/toast";
import { showError, showSuccess } from "@/scripts/alerts";

import IO from "socket.io-client";

const socket = IO(API);

function Visitas() {
  const [visitasData, setVisitasData] = useState({});
  const [Contador, setContador] = useState({ man: 0, woman: 0 });
  const toast = useRef(null);

  let count = {
    man: 0,
    woman: 0,
  };

  const cargarDatos = async () => {
    const Usuario = await verifyUser();

    const res = await fetch(
      GestionarAPI + "/visitas/consultar?turno=" + Usuario?.Rol?.Code
    );
    const visitas = await res.json();

    if (visitas.Error) {
      const res = await fetch(GestionarAPI + "/visitas/registrar", {
        method: "POST",
        body: JSON.stringify({ turno: Usuario?.Rol?.Code }),
        headers: { "Content-Type": "application/json" },
      });
      const { Cantidad_Hombres, Cantidad_Mujeres } = await res.json();

      return { Cantidad_Hombres, Cantidad_Mujeres };
    } else
      return {
        Cantidad_Hombres: visitas.Cantidad_Hombres,
        Cantidad_Mujeres: visitas.Cantidad_Mujeres,
      };
  };

  const actualizarVisitas = async (hombres, mujeres) => {
    const Usuario = await verifyUser();

    await fetch(GestionarAPI + "/visitas/actualizar", {
      method: "PUT",
      body: JSON.stringify({
        countM: mujeres,
        countH: hombres,
        rol: Usuario?.Rol?.Code,
      }),
      headers: { "Content-type": "application/json" },
    });

    const newDatos = { Cantidad_Hombres: hombres, Cantidad_Mujeres: mujeres };
    socket.emit("client:update service", newDatos);
  };

  const getUID = async (rfid) => {
    const res = await fetch("http://localhost:4200/test/rfid/", {
      method: "POST",
      body: JSON.stringify({ rfid }),
      headers: { "Content-type": "application/json" },
    });
    const { Alumno } = await res.json();

    const newContador = { ...Contador };

    if (Alumno.Sexo) newContador.woman += 1;
    else newContador.man += 1;
    console.log(newContador);
    setContador(newContador);
  };

  const getMessage = async (event) => {
    getUID(event.data.substring(1));
    /*    const newContador = { ...Contador };
    console.log(newContador);

    if (Alumno.Sexo) newContador.woman += 1;
    else newContador.man += 1;

    console.log(newContador);
    setContador(newContador); */
  };

  useEffect(() => {
    //setContador();

    const ws = new WebSocket("ws://192.168.1.116:3100/ws");
    ws.onmessage = getMessage;

    /* (async () => setVisitasData(await cargarDatos()))();

    async function getDatos(data) {
      setVisitasData(data);
    }

    socket.on("server:update service", getDatos);

    return () => {
      socket.off("server:update service", getDatos);
    }; */
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <section className="w-1/2 mx-auto">
        <h1 style={{ textAlign: "center", fontSize: "3rem" }}>
          {new Date()
            .toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toLocaleUpperCase()}
        </h1>
        <div className="grid grid-cols-2 gap-3">
          <Counter
            count={visitasData.Cantidad_Hombres}
            sexo="HOMBRES"
            upClick={() =>
              actualizarVisitas(
                visitasData.Cantidad_Hombres + 1,
                visitasData.Cantidad_Mujeres
              )
            }
            downClick={() =>
              visitasData.Cantidad_Hombres > 0
                ? actualizarVisitas(
                    visitasData.Cantidad_Hombres - 1,
                    visitasData.Cantidad_Mujeres
                  )
                : null
            }
          />
          <Counter
            count={visitasData.Cantidad_Mujeres}
            sexo="MUJERES"
            upClick={() =>
              actualizarVisitas(
                visitasData.Cantidad_Hombres,
                visitasData.Cantidad_Mujeres + 1
              )
            }
            downClick={() =>
              visitasData.Cantidad_Mujeres > 0
                ? actualizarVisitas(
                    visitasData.Cantidad_Hombres,
                    visitasData.Cantidad_Mujeres - 1
                  )
                : null
            }
          />
        </div>
      </section>
    </>
  );
}

export default Visitas;
