import { verifyUser } from "@/scripts/auths";
import Image from "next/image";
import Router from "next/router";
import { Menubar } from "primereact/menubar";
import { useEffect, useState } from "react";

export default function MenuBar() {
  const [routes, setRoutes] = useState([]);

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    (async () => {
      const Usuario = await verifyUser();

      setRoutes(ItemList(Usuario?.Rol?.Code));
      setUsuario(Usuario?.User);
    })();
  }, []);

  const items = [
    {
      rol: ["A", "M", "SM", "SV", "Guest"],
      label: "Inicio",
      icon: "pi pi-fw pi-home",
      command: () => Router.push("/"),
    },
    {
      rol: ["A", "M", "SM", "SV"],
      label: "Libros",
      icon: "pi pi-fw pi-book",
      items: [
        {
          label: "Consultas",
          icon: "pi pi-fw pi-folder",
          command: () => Router.push("/libros/consultas"),
        },
        {
          label: "Prestamos",
          icon: "pi pi-fw pi-align-right",
          command: () => Router.push("/libros/prestamos"),
        },
        {
          label: "Devoluciones",
          icon: "pi pi-fw pi-align-center",
          command: () => Router.push("/libros/devoluciones"),
        },
      ],
    },
    {
      rol: ["A", "M", "SM", "SV"],
      label: "Servicios",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Mesas",
          icon: "pi pi-fw pi-user-plus",
          command: () => Router.push("/servicios/mesas"),
        },
        {
          label: "Cubiculos",
          icon: "pi pi-fw pi-user-minus",
          command: () => Router.push("/servicios/cubiculos"),
        },
        {
          label: "Laptops",
          icon: "pi pi-fw pi-users",
          command: () => Router.push("/servicios/laptops"),
        },
        {
          label: "Computadoras",
          icon: "pi pi-fw pi-desktop",
          command: () => Router.push("/servicios/computadoras"),
        },
      ],
    },
    {
      rol: ["A", "M", "SM", "SV"],
      label: "Gestionar",
      icon: "pi pi-fw pi-calendar",
      items: [
        {
          label: "Visitas",
          icon: "pi pi-fw pi-pencil",
          command: () => Router.push("/gestion/visitas"),
        },
        {
          rol: ["A", "M"],
          label: "Estadisticas",
          icon: "pi pi-fw pi-calendar-times",
          items: [
            {
              label: "Servicios",
              icon: "pi pi-fw pi-calendar-times",
              command: () => Router.push("/gestion/estadisticas/servicios"),
            },
            {
              label: "Visitas",
              icon: "pi pi-fw pi-calendar-times",
              command: () => Router.push("/gestion/estadisticas/visitas"),
            },
          ],
        },
      ],
    },
    {
      rol: ["A"],
      label: "Administrar",
      icon: "pi pi-fw pi-wrench",
      items: [
        {
          label: "Usuarios",
          icon: "pi pi-fw pi-users",
          command: () => Router.push("/administracion/usuarios"),
        },
        {
          label: "Servicios",
          icon: "pi pi-fw pi-users",
          command: () => Router.push("/administracion/servicios"),
        },
        {
          label: "RFID",
          icon: "pi pi-fw pi-id-card",
          command: () => Router.push("/administracion/rfid"),
        },
      ],
    },
    {
      rol: ["A", "M", "SM", "SV"],
      label: "Cerrar Sesion",
      icon: "pi pi-fw pi-power-off",
      command: () => {
        localStorage.removeItem("LC_api_Token");
        Router.reload();
      },
    },
  ];

  const ItemList = (Code) => {
    if (Code != null)
      return items.filter((item) => item.rol.find((rol) => rol == Code));

    return items.filter((item) => item.rol.find((rol) => rol == "Guest"));
  };

  const start = (
    <Image
      src={"/imgs/corvi.jpg"}
      width={40}
      height={40}
      className="rounded-full"
    />
  );

  const end = (
    <div
      style={{ display: "flex", alignItems: "center", gap: "5px" }}
      className="p-inputgroup"
    >
      {usuario ? usuario.Nombre : "Guest"}
      <span className="p-inputgroup-addon">
        <i className="pi pi-id-card"></i>
      </span>
    </div>
  );

  return (
    <div className="h-1/6 p-10">
      <Menubar model={routes} start={start} end={end} />
    </div>
  );
}
