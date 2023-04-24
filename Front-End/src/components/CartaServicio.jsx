import { useEffect, useState, useRef, useContext } from "react";

//PrimeReact
import { ListBox } from "primereact/listbox";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";

function CartaServicio({ servicio = "Cubiculo", numero = 0 }) {
  const [ListaAlumnos, setListaAlumnos] = useState(null);

  const toast = useRef(null);
  /* Dialog */
  const [ExtendListaAlumnos, setExtendListaAlumnos] = useState(null);
  const [ListaVisible, setListaVisible] = useState(false);

  /* ConfimPopUp */
  const btnDeleteAll = useRef(null);
  const [ConfirmVisible, setConfirmVisible] = useState(false);

  return (
    <>
      <Toast ref={toast} />
      <div
        className="border rounded-md grid grid-flow-row cursor-pointer p-3"
        onClick={(e) => setListaVisible(true)}
        style={{ height: "350px" }}
      >
        <h3 className="text-center text-2xl">
          {servicio} N° {numero}
        </h3>
        <h1 className="text-center text-8xl">
          {ListaAlumnos ? ListaAlumnos.length : 0}
        </h1>
        <h3 className="text-center text-2xl">
          {ListaAlumnos ? "Cubiculo en uso" : "Actualmente vacio"}
        </h3>
      </div>
      <Dialog
        header="¿Quién esta adentro?"
        visible={ListaVisible}
        onHide={(e) => {
          setListaVisible(false);
          setExtendListaAlumnos(null);
        }}
      >
        <div className="grid grid-flow-row gap-2">
          <ListBox options={ExtendListaAlumnos} optionLabel="name" />
          <ConfirmPopup
            target={btnDeleteAll.current}
            visible={ConfirmVisible}
            onHide={(e) => setConfirmVisible(false)}
            message="¿Esta seguro de remover a todos los estudiantes?"
            accept={(e) => setConfirmVisible(false)}
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
