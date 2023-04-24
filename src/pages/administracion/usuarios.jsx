import React, { useState, useRef } from "react";
import Router from "next/router";
//PrimeReact
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { ConfirmPopup } from "primereact/confirmpopup";
import { UsuariosAPI } from "@/scripts/apiConn";

export async function getServerSideProps() {
  const res = await fetch(UsuariosAPI + "/consultar");
  const data = await res.json();

  return { props: { data } };
}

function Usuarios({ data }) {
  const [visible, setVisible] = useState(false);

  const RegistrarUsuario = async (nuevoUsuario) => {
    if (
      !nuevoUsuario.Pwd ||
      !nuevoUsuario.User ||
      !nuevoUsuario.Nick ||
      !nuevoUsuario.Rol
    ) {
      showWarn("Asegurese de llenar todos los campos");
      return;
    }

    await fetch(UsuariosAPI + "/registrar", {
      method: "POST",
      body: JSON.stringify(nuevoUsuario),
      headers: { "Content-type": "application/json" },
    });
    setVisible(false);
    Router.push("/administracion/usuarios");
  };

  return (
    <section>
      <Button
        onClick={() => setVisible(true)}
        style={{ marginBottom: "15px" }}
        label="REGISTRAR USUARIO"
      />
      <Dialog
        header="Registrar Usuario"
        visible={visible}
        style={{ width: "350px" }}
        onHide={() => setVisible(false)}
      >
        <FormularioRegistro handleClick={RegistrarUsuario} />
      </Dialog>
      <div className="card">
        <DataTable value={data} stripedRows tableStyle={{ minWidth: "50rem" }}>
          <Column field="NickName" header="Nombre"></Column>
          <Column field="UserName" header="Usuario"></Column>
          <Column field="Password" header="Contraseña"></Column>
          <Column field="Rol" header="Rol" />
          <Column body={({ Id }) => <DialogoConfirmacion ID={Id} />} />
        </DataTable>
      </div>
    </section>
  );
}

const FormularioRegistro = ({ handleClick }) => {
  const [selectedRol, setSelectedRol] = useState(null);
  const roles = [
    { name: "Administrador", code: "A" },
    { name: "Moderador", code: "M" },
    { name: "Servicio Matutino", code: "SM" },
    { name: "Servicio Vespertino", code: "SV" },
  ];

  const toast = useRef(null);
  const [password, setPassword] = useState("");
  const [UserName, setUserName] = useState("");
  const [NickName, setNickName] = useState("");

  return (
    <>
      <Toast ref={toast} />
      <div className="grid gap-4 h-80">
        <div className="card flex justify-content-center">
          <Dropdown
            value={selectedRol}
            onChange={(e) => setSelectedRol(e.value)}
            options={roles}
            optionLabel="name"
            placeholder="Seleccionar Rol"
            style={{ width: "100%" }}
          />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-id-card"></i>
          </span>
          <InputText
            value={UserName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Usuario"
          />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock"></i>
          </span>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            placeholder="Contraseña"
          />
        </div>

        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <InputText
            value={NickName}
            onChange={(e) => setNickName(e.target.value)}
            placeholder="Nombre Usuario"
          />
        </div>

        <Button
          onClick={(e) =>
            handleClick({
              User: UserName,
              Nick: NickName,
              Pwd: password,
              Rol: selectedRol.code,
            })
          }
          label="Registrar"
        />
      </div>
    </>
  );
};

const DialogoConfirmacion = ({ ID = null }) => {
  const [visible, setVisible] = useState(false);
  const confirmButton = useRef(null);

  const EliminarUsuario = async () => {
    await fetch(UsuariosAPI + "/eliminar", {
      method: "DELETE",
      body: JSON.stringify({ id: ID }),
      headers: { "Content-type": "application/json" },
    });
    Router.push("/administracion/usuarios");
  };

  return (
    <>
      <ConfirmPopup
        target={confirmButton.current}
        visible={visible}
        onHide={() => setVisible(false)}
        message="¿Esta seguro de eliminar a este Usuario?"
        icon="pi pi-exclamation-triangle"
        accept={() => EliminarUsuario()}
        reject={null}
      />
      <Button
        ref={confirmButton}
        onClick={() => setVisible(true)}
        label="Eliminiar"
      />
    </>
  );
};

export default Usuarios;
