import { useState, useEffect, useContext, useRef } from "react";

import { Toast } from "primereact/toast";
import { ServiciosContext } from "@/context/ServiciosContext";
import { ServiciosAPI } from "@/scripts/apiConn";
import { showWarn, showSuccess, showInfo } from "@/scripts/alerts";
import { verifyUser } from "@/scripts/auths";

async function fetchServicio(servicio, numero) {
  const res = await fetch(
    ServiciosAPI + `/consultar/servicio?service=${servicio}&num=${numero}`
  );
  const data = await res.json();
  return data;
}

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
      setDatos(await fetchServicio(servicio, numero));
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

    setDatos(await fetchServicio(servicio, numero));
  };

  useEffect(() => {
    (async () => {
      setDatos(await fetchServicio(servicio, numero));
    })();
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <section className="h-48 w-48 overflow-hidden grid grid-flow-row gap-1 justify-center border rounded-lg relative">
        <h3 className="text-xl">
          {servicio} N° {numero}
        </h3>

        <img src="/imgs/laptop-solid.svg" alt="Laptop icon" />

        <button
          style={{
            transition: "all 300ms",
          }}
          className={`absolute h-full w-full text-2xl ${
            Datos.Lista ? "bg-red-400" : "bg-green-400"
          } opacity-0 hover:opacity-100`}
          onClick={() => AsignarArea()}
        >
          {Datos.Lista ? "EN USO" : "Disponible"}
        </button>
      </section>
    </>
  );
}

export default CartaServicioIndividual;
