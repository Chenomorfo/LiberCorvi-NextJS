import { useState, useRef, useEffect } from "react";

import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { showError, showInfo, showSuccess, showWarn } from "@/scripts/alerts";
import { UsuariosAPI } from "@/scripts/apiConn";
import Router from "next/router";
import { verifyUser } from "@/scripts/auths";

export default function Home() {
  const [valuePassword, setValuePassword] = useState("");
  const [UserName, setUserName] = useState("");

  const toast = useRef(null);

  useEffect(() => {
    (async () => {
      const user = await verifyUser();

      if (user) Router.replace("/administracion/rfid");
    })();
  }, []);

  const IniciarSesion = async () => {
    if (!UserName || !valuePassword) {
      toast.current.show(
        showInfo(
          "Oops, revise de nuevo",
          "Llene los campos para iniciar sesion"
        )
      );
      return;
    }

    const res = await fetch(UsuariosAPI + "/login", {
      method: "POST",
      body: JSON.stringify({
        user: UserName,
        pwd: valuePassword,
      }),
      headers: { "Content-type": "application/json" },
    });
    const data = await res.json();

    if (data.Warn) {
      toast.current.show(showWarn(data.Warn, data.Msg));
      return;
    }
    toast.current.show(
      showSuccess(data.Msg, "Bienvenid@, " + data.Usuario.Nombre)
    );
    localStorage.setItem("LC_api_Token", data.token);
    Router.reload();
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="h-max grid grid-flow-row gap-20">
        {/* Inicio de sesion */}
        <div className="grid grid-flow-row gap-5 mx-auto">
          <h1 className="text-center text-5xl">INICIAR SESION</h1>
          <div className="p-inputgroup h-14">
            <span className="p-inputgroup-addon">
              <i className="pi pi-id-card"></i>
            </span>
            <InputText
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Usuario"
            />
          </div>
          <div className="p-inputgroup h-14">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <Password
              value={valuePassword}
              onChange={(e) => setValuePassword(e.target.value)}
              onKeyDown={(e) => (e.key == "Enter" ? IniciarSesion() : null)}
              feedback={false}
              toggleMask
              placeholder="Contraseña"
              style={{ height: "50px" }}
            />
          </div>
          <Button label="Ingresar" onClick={() => IniciarSesion()} />
        </div>
        {/* Informacion inferior */}
        <div className="grid grid-cols-3 gap-11">
          <div>
            <h2 className="text-3xl">Politica de calidad</h2>
            <p className="text-justify">
              La institucion establece el compromiso de implementar todos sus
              procesos, orientandolos hacia la satisfaccion de sus alumnos
              sustentada en la Calidad del Proceso Educativo, para cumplir con
              sus requerimentos, mediante la eficacia de un Sistema de Gestion
              de la Calidad y de mejora continua, conforme a la norma ISO
              9001:2008/NMX-CC-9001-IMNC-2008. Esta politica es comunicada en el
              ITNL a traves de diversos medios y es revisada para su continua
              adecuacion en la Revision por la Direccion.
            </p>
          </div>
          <div>
            <h2 className="text-3xl">Mision</h2>
            <p className="text-justify">
              Formar integralmente profesionistas lideres, altamente
              competitivos y comprometidos con el desarrollo de su comunidad.
            </p>
          </div>
          <div>
            <h2 className="text-3xl">Vision</h2>
            <p className="text-justify">
              Ser una institucion educativa reconocida por su alto desempeno y
              contribucion al desarrollo tecnologico y sustentable de la
              comunidad. Con esta vision el Instituto Tecnologico de Nuevo
              Laredo busca contribuir a la transformacion educativa en Mexico,
              orientando sus esfuerzos hacia el desarrollo humano sustentable y
              la competitividad.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
