import { useState, useEffect, useContext, useRef } from "react";

import { Toast } from "primereact/toast";
import { ServiciosContext } from "@/context/ServiciosContext";
import { API, AlumnosAPI, ServiciosAPI } from "@/scripts/apiConn";
import { showWarn, showSuccess, showInfo } from "@/scripts/alerts";
import { verifyUser } from "@/scripts/auths";
import { Busy_Laptop, Free_Laptop } from "./SVGIcons";

async function fetchServicio(servicio, numero) {
  const res = await fetch(
    ServiciosAPI + `/consultar/servicio?service=${servicio}&num=${numero}`
  );
  const data = await res.json();
  return data;
}

import IO from "socket.io-client";

const socket = IO(API);

function CartaServicioIndividual({ servicio = "Laptop", numero = 0 }) {
  const [Datos, setDatos] = useState({});

  const { AsignarServicio } = useContext(ServiciosContext);

  const toast = useRef(null);

  const AsignarArea = async () => {
    if (Datos.Lista) {
      toast.current.show(
        showSuccess(
          "Exito al retirar",
          `Se ha desocupado ${servicio} ${numero}`
        )
      );
      await fetch(ServiciosAPI + `/actualizar?area=${servicio}&num=${numero}`, {
        method: "PUT",
        body: JSON.stringify({ lista: null }),
        headers: { "Content-type": "application/json" },
      });

      const newDatos = Datos;
      newDatos.Lista = null;
      socket.emit("client:update service", newDatos);

      return;
    }

    let alumno = AsignarServicio().map(({ Numero_Control }) => Numero_Control);

    if (!alumno.length) {
      toast.current.show(
        showInfo(
          "¿Necesita un tip?",
          `Se requiere ingresar un alumno para este servicio`
        )
      );
      return;
    }
    if (alumno.length > 1) {
      toast.current.show(
        showWarn("Advertencia", `Solo se admite un estudiante por ${servicio}`)
      );
      return;
    }
    toast.current.show(
      showSuccess(
        "Exito al Ingresar",
        `Se registro un alumno en ${servicio} ${numero}`
      )
    );

    const user = await verifyUser();

    await fetch(ServiciosAPI + "/registrar?area=" + servicio, {
      method: "POST",
      body: JSON.stringify({ lista: alumno, usuario: user.Rol.Code }),
      headers: { "Content-type": "application/json" },
    });
    await fetch(ServiciosAPI + `/actualizar?area=${servicio}&num=${numero}`, {
      method: "PUT",
      body: JSON.stringify({ lista: alumno }),
      headers: { "Content-type": "application/json" },
    });

    const newDatos = Datos;
    newDatos.Lista = alumno;
    socket.emit("client:update service", newDatos);
  };

  useEffect(() => {
    (async () => setDatos(await fetchServicio(servicio, numero)))();

    socket.connect();
    async function getDatos(data) {
      setDatos(data);
    }
    //socket on
    socket.on("server:update servicio", getDatos);
    return () => {
      socket.off("server:update servicio", getDatos);
      socket.disconnect();
    };
  }, [Datos]);

  return (
    <>
      <Toast ref={toast} />
      <section className="h-48 w-48 overflow-hidden grid grid-flow-row gap-1 justify-center border rounded-lg relative">
        <h3 className="text-xl">
          {servicio} N° {numero}
        </h3>

        {Datos.Lista ? <Busy_Laptop /> : <Free_Laptop />}

        <button
          style={{
            transition: "all 300ms",
          }}
          className={`absolute h-full w-full text-2xl ${
            Datos.Lista ? "bg-red-400" : "bg-green-400"
          } opacity-0 hover:opacity-100`}
          onClick={() => AsignarArea()}
        >
          {Datos.Lista ? (
            <>
              <h3 className="text-2xl">En uso por:</h3>{" "}
              <p className="text-lg">{Datos.Lista}</p>
            </>
          ) : (
            "Disponible"
          )}
        </button>
      </section>
    </>
  );
}

export default CartaServicioIndividual;
