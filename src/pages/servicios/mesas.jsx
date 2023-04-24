import React from "react";
import ServiciosLayout from "./layout";
import CartaServicio from "@/components/CartaServicio";

function mesas() {
  const areas = Array.from(Array(3).keys());
  return (
    <ServiciosLayout>
      <div className="grid lg:grid-cols-3 gap-2">
        {areas.map((n, i) => (
          <CartaServicio key={n} numero={i + 1} servicio="Mesa" />
        ))}
      </div>
    </ServiciosLayout>
  );
}

export default mesas;
