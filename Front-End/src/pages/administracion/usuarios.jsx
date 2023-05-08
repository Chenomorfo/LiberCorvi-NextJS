import React, { useState, useRef, useEffect } from "react";
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
import { showError, showSuccess } from "@/scripts/alerts";

export async function getServerSideProps() {
  const res = await fetch(UsuariosAPI + "/consultar");
  const users = await res.json();

  return { props: { users } };
}

function Usuarios({ users }) {
  const [visible, setVisible] = useState(false);
  const [UserData, setUserData] = useState(users);
  const toast = useRef(null);

  const RegistrarUsuario = async (nuevoUsuario) => {
    const res = await fetch(UsuariosAPI + "/registrar", {
      method: "POST",
      body: JSON.stringify(nuevoUsuario),
      headers: { "Content-type": "application/json" },
    });
    const data = await res.json();

    if (data.Error) {
      toast.current.show(showError(data.Error, data.Msg));
    } else {
      const res = await fetch(UsuariosAPI + "/consultar");
      setUserData(await res.json());
      setVisible(false);
      toast.current.show(showSuccess(data.Success, data.Msg));
    }
  };

  const EliminarUsuario = async (Id) => {
    const res = await (
      await fetch(UsuariosAPI + "/eliminar/" + Id, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      })
    ).json();

    toast.current.show(showSuccess(res.Success, res.Msg));
    const data = await fetch(UsuariosAPI + "/consultar");
    setUserData(await data.json());
  };

  return (
    <>
      <Toast ref={toast} />
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
          <DataTable
            value={UserData}
            stripedRows
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="Nombre" header="Nombre"></Column>
            <Column field="Usuario" header="Usuario"></Column>
            <Column field="Password" header="Contraseña"></Column>
            <Column field="Role.Nombre" header="Rol" />
            <Column
              body={({ Id }) => (
                <DialogoConfirmacion handleClick={() => EliminarUsuario(Id)} />
              )}
            />
          </DataTable>
        </div>
      </section>
    </>
  );
}

const FormularioRegistro = ({ handleClick }) => {
  const [roles, setRoles] = useState([]);
  const getRoles = async () => {
    const res = await fetch(UsuariosAPI + "/consultar/roles");
    const roles = await res.json();

    setRoles(
      roles.map((item) => ({
        name: item.Nombre,
        code: item.Id,
      }))
    );
  };

  useEffect(() => {
    getRoles();
  }, []);

  const [selectedRol, setSelectedRol] = useState(1);

  const [password, setPassword] = useState("");
  const [UserName, setUserName] = useState("");
  const [NickName, setNickName] = useState("");

  return (
    <>
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

const DialogoConfirmacion = ({ handleClick = null }) => {
  const [visible, setVisible] = useState(false);
  const confirmButton = useRef(null);

  return (
    <>
      <ConfirmPopup
        target={confirmButton.current}
        visible={visible}
        onHide={() => setVisible(false)}
        message="¿Esta seguro de eliminar a este Usuario?"
        icon="pi pi-exclamation-triangle"
        accept={handleClick}
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
