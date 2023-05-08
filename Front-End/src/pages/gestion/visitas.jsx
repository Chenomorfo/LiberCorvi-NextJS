import React, { useState } from "react";
import Counter from "@/components/Contador";
import { GestionarAPI } from "@/scripts/apiConn";

export async function getStaticProps() {
  const res = await fetch(GestionarAPI + "/visitas/consultar");
  const visitas = await res.json();

  if (visitas.Error) {
    const res = await fetch(GestionarAPI + "/visitas/registrar", {
      method: "POST",
    });
    const visitas = await res.json();

    return { props: { visitas } };
  } else return { props: { visitas } };
}

function Visitas({ visitas }) {
  const [visitasData, setVisitasData] = useState(visitas);

  const actualizarVisitas = async (hombres, mujeres) => {
    const res = await fetch(
      GestionarAPI +
        "/visitas/actualizar?fecha=" +
        new Date().toISOString().split("T")[0],
      {
        method: "PUT",
        body: JSON.stringify({
          countM: mujeres,
          countH: hombres,
        }),
        headers: { "Content-type": "application/json" },
      }
    );

    if (res.status < 300) {
      const res = await fetch(GestionarAPI + "/visitas/consultar");
      setVisitasData(await res.json());
    }
  };

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
