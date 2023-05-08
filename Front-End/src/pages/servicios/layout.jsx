//PrimeReact
import { useContext, useState } from "react";
import { AlumnosAPI } from "@/scripts/apiConn";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ServiciosContext } from "@/context/ServiciosContext";

export default function ServiciosLayout({ children }) {
  const { Lista, EnlistarAlumno, RemoverAlumno } = useContext(ServiciosContext);
  const [Alumno, setAlumno] = useState("");
  const [Suggestions, setSuggestions] = useState([]);
  //const [Lista, setLista] = useState([]);
  const search = (event) => {
    fetch(AlumnosAPI + "/consultar?nc=" + event.query)
      .then((data) => data.json())
      .then((data) =>
        setSuggestions(data.map(({ Numero_Control }) => Numero_Control))
      );
  };
  const ValidarAlumno = () => {
    fetch(AlumnosAPI + "/buscar?nc=" + Alumno)
      .then((data) => data.json())
      .then((data) => {
        if (data.Error) alert(data.Msg);
        else EnlistarAlumno(data);
      });
  };

  return (
    <section className="grid grid-cols-2 gap-5">
      <div>
        <div className="grid grid-flow-col gap-2">
          <AutoComplete
            value={Alumno}
            suggestions={Suggestions}
            completeMethod={search}
            onChange={(e) => setAlumno(e.target.value)}
            onKeyUp={(e) => null}
            placeholder="Buscar Alumno"
            dropdown
          />
          <Button label="Registrar" onClick={ValidarAlumno} />
        </div>
        <DataTable style={{ marginTop: "10px" }} value={Lista}>
          <Column
            field="Numero_Control"
            header="# Control"
            style={{ width: "30%" }}
          />
          <Column field="Nombre" header="Nombre" />
          <Column
            body={(data) => (
              <Button label="Remover" onClick={() => RemoverAlumno(data)} />
            )}
          />
        </DataTable>
      </div>
      {children}
    </section>
  );
}
