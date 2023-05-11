import React, { useEffect, useState } from "react";
import Counter from "@/components/Contador";
import { GestionarAPI } from "@/scripts/apiConn";
import { verifyUser } from "@/scripts/auths";
import { headers } from "next/dist/client/components/headers";

function Visitas() {
  const [visitasData, setVisitasData] = useState({});

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

      setVisitasData({ Cantidad_Hombres, Cantidad_Mujeres });
    } else
      setVisitasData({
        Cantidad_Hombres: visitas.Cantidad_Hombres,
        Cantidad_Mujeres: visitas.Cantidad_Mujeres,
      });
  };

  const actualizarVisitas = async (hombres, mujeres) => {
    const Usuario = await verifyUser();

    const res = await fetch(GestionarAPI + "/visitas/actualizar", {
      method: "PUT",
      body: JSON.stringify({
        countM: mujeres,
        countH: hombres,
        rol: Usuario?.Rol?.Code,
      }),
      headers: { "Content-type": "application/json" },
    });

    setVisitasData({ Cantidad_Hombres: hombres, Cantidad_Mujeres: mujeres });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
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
  );
}

export default Visitas;
