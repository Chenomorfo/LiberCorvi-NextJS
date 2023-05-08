import React from "react";
import ServiciosLayout from "./layout";
import CartaServicioIndividual from "@/components/CartaServicioIndividual";

function Computadoras() {
  const areas = Array.from(Array(8).keys());

  return (
    <ServiciosLayout>
      <div className="grid gmd:grid-cols-2 xl:grid-cols-4 gap-2">
        {areas.map((n, i) => (
          <CartaServicioIndividual
            key={n}
            numero={i + 1}
            servicio="Computadora"
          />
        ))}
      </div>
    </ServiciosLayout>
  );
}

export default Computadoras;
