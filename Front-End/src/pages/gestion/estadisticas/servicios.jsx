import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { GestionarAPI, ServiciosAPI, UsuariosAPI } from "@/scripts/apiConn";
import { Dropdown } from "primereact/dropdown";

export default function GraficosServicios() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const [TableData, setTableData] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [Servicios, setServicios] = useState(null);

  const [dates, setDates] = useState(null);

  const [selectedHorario, setSelectedHorario] = useState(null);
  const [ListaHorarios, setListaHorarios] = useState([]);

  const getServiceStats = async (dates = [], list, turno) => {
    if(!dates) return
    const servicios = list
      ? list.map(({ Servicio }) => `list=${Servicio}`)
      : [];
    const fechas = dates ? dates.map((d) => `fecha=${d}`) : [];

    const res = await fetch(
      `${GestionarAPI}/estadisticas/servicios?${
        fechas?.join("&") ?? ""
      }&turno=${turno?.code ?? ""}&${servicios?.join("&") ?? ""}`
    );

    const data = await res.json();

    let Especialidad = [];
    let Total = [];

    data.forEach((d) => {
      Especialidad.push(d.Especialidad);
      Total.push(parseInt(d.Hombres) + parseInt(d.Mujeres));
    });
    CreatePieGraph(Especialidad, Total);
    setTableData(data);
  };

  const CreatePieGraph = (DataName = [], DataStats = []) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: DataName,
      datasets: [
        {
          data: DataStats,
          backgroundColor: [
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--purple-500"),
            documentStyle.getPropertyValue("--orange-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--purple-400"),
            documentStyle.getPropertyValue("--orange-400"),
          ],
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  };

  useEffect(() => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    getServiceStats([firstDay, lastDay]);

    fetch(ServiciosAPI + "/consultar/nombres")
      .then((data) => data.json())
      .then((data) => setServicios(data));

    fetch(UsuariosAPI + "/consultar/roles")
      .then((data) => data.json())
      .then((data) => {
        const myData = data.map(({ Nombre, Code }) => {
          return { nombre: Nombre, code: Code };
        });
        setListaHorarios([...myData, { nombre: "Sin especificar", code: "" }]);
      });
  }, []);

  return (
    <section className="grid grid-flow-row gap-5">
      <div className="h-12 w-1/3 grid grid-flow-col gap-2">
        <Calendar
          style={{ width: "220px" }}
          placeholder="Especificar Fecha"
          value={dates}
          onChange={(e) => {
            setDates(e.value);
            getServiceStats(e.value, selectedService, selectedHorario);
          }}
          selectionMode="range"
          readOnlyInput
          dateFormat="yy/mm/dd"
        />
        <MultiSelect
          style={{ width: "250px" }}
          placeholder="Especificar Servicio"
          value={selectedService}
          onChange={(e) => {
            setSelectedService(e.value);
            getServiceStats(dates, e.value, selectedHorario);
          }}
          options={Servicios}
          optionLabel="Servicio"
          display="chip"
        />
        <Dropdown
          placeholder="Horario"
          value={selectedHorario}
          onChange={(e) => {
            setSelectedHorario(e.value);
            getServiceStats(dates, selectedService, e.value);
          }}
          options={ListaHorarios}
          optionLabel="nombre"
        />
      </div>
      <div className="grid grid-flow-col gap-2">
        <DataTable value={TableData}>
          <Column field="Especialidad" header="Carrera" />
          <Column field="Hombres" header="Hombres" />
          <Column field="Mujeres" header="Mujeres" />
        </DataTable>
        <Chart
          className="mx-auto"
          width="650px"
          height="500px"
          type="pie"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </section>
  );
}
