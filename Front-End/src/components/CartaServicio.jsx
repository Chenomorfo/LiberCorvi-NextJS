"use client";
import { useEffect, useState, useRef, useContext } from "react";

//PrimeReact
import { ListBox } from "primereact/listbox";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { AlumnosAPI, ServiciosAPI } from "@/scripts/apiConn";
import { ServiciosContext } from "@/context/ServiciosContext";
import { showWarn } from "@/scripts/alerts";
import { verifyUser } from "@/scripts/auths";

async function fetchServicio(servicio, numero) {
  const res = await fetch(
    ServiciosAPI + `/consultar/servicio?service=${servicio}&num=${numero}`
  );
  const data = await res.json();
  return data;
}

function CartaServicio({ servicio = "Cubiculo", numero = 0 }) {
  //const datos = fetchServicio(servicio, numero);

  const { AsignarServicio } = useContext(ServiciosContext);

  const [Datos, setDatos] = useState({});

  const toast = useRef(null);
  /* Dialog */
  const [Lista, setLista] = useState(null);
  const [ListaVisible, setListaVisible] = useState(false);

  /* ConfimPopUp */
  const btnDeleteAll = useRef(null);
  const [ConfirmVisible, setConfirmVisible] = useState(false);

  const InspeccionarServicio = async () => {
    const query = Datos.Lista.split(",").map((item) => `nc=${item}`);

    fetch(`${AlumnosAPI}/agrupar?${query.join("&")}`)
      .then((data) => data.json())
      .then((data) => {
        setLista(data);
        setListaVisible(true);
      });
  };

  const LiberarArea = async () => {
    await fetch(ServiciosAPI + `/actualizar?area=${servicio}&num=${numero}`, {
      method: "PUT",
      body: JSON.stringify({ lista: null }),
      headers: { "Content-type": "application/json" },
    });
    setLista(null);
    setDatos(await fetchServicio(servicio, numero));
  };

  const AsignarArea = async () => {
    let Lista = [];
    const Alumnos = AsignarServicio();

    if (!Alumnos.length) {
      toast.current.show(
        showWarn("Advertencia", "La lista de estudiantes esta vacia")
      );
      return;
    }
    Lista = Lista.concat(
      Alumnos.map(({ Numero_Control }) => Numero_Control),
      Datos.Lista ?? []
    );

    if (Lista.length > 4) {
      toast.current.show(
        showWarn(
          "Limite Excedido",
          "Solo se admite un maximo de 4 personas en este servicio"
        )
      );
      return;
    }

    const user = await verifyUser();

    /* Actualiza todos los alumnos dentro de un servicio */
    await fetch(ServiciosAPI + "/registrar?area=" + servicio, {
      method: "POST",
      body: JSON.stringify({ lista: Lista, usuario: user.Rol.Code }),
      headers: { "Content-type": "application/json" },
    });
    await fetch(ServiciosAPI + `/actualizar?area=${servicio}&num=${numero}`, {
      method: "PUT",
      body: JSON.stringify({ lista: Lista }),
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
      <div
        className="border rounded-md grid grid-flow-row cursor-pointer p-3"
        onClick={(e) => {
          if (!Datos.Lista?.split(",")) AsignarArea();
          else InspeccionarServicio();
        }}
        style={{ height: "350px" }}
      >
        <h3 className="text-center text-2xl">
          {servicio} N° {numero}
        </h3>
        <h1 className="text-center text-8xl">
          {Datos.Lista ? Datos.Lista.split(",").length : 0}
        </h1>
        <h3 className="text-center text-2xl">
          {Datos.Lista ? "Cubiculo en uso" : "Actualmente vacio"}
        </h3>
      </div>
      <Dialog
        header="¿Quién esta adentro?"
        visible={ListaVisible}
        onHide={(e) => {
          setListaVisible(false);
          setLista(null);
        }}
      >
        <div className="grid grid-flow-row gap-2">
          <ListBox options={Lista} optionLabel="Nombre" />
          <ConfirmPopup
            target={btnDeleteAll.current}
            visible={ConfirmVisible}
            onHide={(e) => setConfirmVisible(false)}
            message="¿Esta seguro de remover a todos los estudiantes?"
            accept={(e) => {
              LiberarArea();
              setConfirmVisible(false);
            }}
            reject={null}
          />
          <Button
            ref={btnDeleteAll}
            label="Remover Todos"
            onClick={(e) => setConfirmVisible(true)}
          />
        </div>
      </Dialog>
    </>
  );
}

export default CartaServicio;
