import React from "react";
import Layout from "./layout";
import CartaServicio from "@/components/CartaServicio";

function cubiculos() {
  const areas = Array.from(Array(3).keys());

  return (
    <Layout>
      <div className="grid lg:grid-cols-3 gap-2">
        {areas.map((n, i) => (
          <CartaServicio key={n} numero={i + 1} servicio="Cubiculo" />
        ))}
      </div>
    </Layout>
  );
}

export default cubiculos;
