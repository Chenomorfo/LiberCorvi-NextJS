import { useState, useEffect, useContext, useRef } from "react";

import { Toast } from "primereact/toast";

function CartaServicioIndividual({ servicio = "Laptop", numero = 0 }) {
  const [Asignado, setAsignado] = useState("");

  const toast = useRef(null);

  return (
    <>
      <Toast ref={toast} />
      <div className="h-40 w-40 grid grid-flow-row gap-1 justify-center border rounded-lg">
        <h3>
          {servicio} N° {numero}
        </h3>

        <img src="/imgs/laptop-solid.svg" alt="Laptop icon" />

        <button onClick={() => null}>
          {Asignado != "" ? "EN USO" : "ASIGNAR"}
        </button>
      </div>
    </>
  );
}

export default CartaServicioIndividual;
