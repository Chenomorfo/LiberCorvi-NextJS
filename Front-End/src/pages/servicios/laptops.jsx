import React from "react";
import ServiciosLayout from "./layout";
import CartaServicioIndividual from "@/components/CartaServicioIndividual";

function Laptops() {
  const areas = Array.from(Array(10).keys());

  return (
    <ServiciosLayout>
      <div className="grid gmd:grid-cols-2 xl:grid-cols-4 gap-1">
        {areas.map((n, i) => (
          <CartaServicioIndividual key={n} numero={i + 1} servicio="Laptop" />
        ))}
      </div>
    </ServiciosLayout>
  );
}

export default Laptops;
