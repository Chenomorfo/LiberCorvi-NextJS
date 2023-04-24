//PrimeReact
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

function ServiciosLayout({ children }) {
  return (
    <section className="grid grid-cols-2 gap-5">
      <div>
        <div className="grid grid-flow-col gap-2">
          <AutoComplete
            value={null}
            suggestions={null}
            completeMethod={null}
            onChange={(e) => null}
            onKeyUp={(e) => null}
            placeholder="Buscar Alumno"
            dropdown
          />
          <Button label="Registrar" />
        </div>
        <DataTable style={{ marginTop: "10px" }} value={null}>
          <Column
            field="Ncontrol"
            header="# Control"
            style={{ width: "30%" }}
          />
          <Column field="Nombre" header="Nombre" />
          <Column
            value="Ncontrol"
            body={(data) => <Button label="Remover" onClick={(e) => null} />}
          />
        </DataTable>
      </div>
      {children}
    </section>
  );
}

export default ServiciosLayout;
