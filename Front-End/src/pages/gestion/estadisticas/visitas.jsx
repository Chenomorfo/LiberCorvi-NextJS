import React, { useState, useEffect } from "react";
import { Meses } from "@/scripts/dates";

/* PrimeReact */
import { Chart } from "primereact/chart";

import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { GestionarAPI, UsuariosAPI } from "@/scripts/apiConn";

export default function GraficosVisitas() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const [dates, setDates] = useState(null);
  const [Horario, setHorario] = useState({});
  const [ListaHorarios, setListaHorarios] = useState([]);

  const getDatosAnuales = (dates = [], turno = "") => {
    if (dates[1] == null) return;
    fetch(
      `${GestionarAPI}/estadisticas/visitas?fecha=${dates[0]}&fecha=${
        dates[1]
      }&turno=${turno.code ?? ""}`
    )
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        let hombres = [],
          mujeres = [],
          meses = [];
        data.forEach((item) => {
          hombres.push(item.Hombres);
          mujeres.push(item.Mujeres);
          meses.push(Meses.get(item.Month - 1));
        });

        CreateBarGraph(meses, hombres, mujeres);
      });
  };

  const CreateBarGraph = (dataList, dataM, dataF) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: dataList.slice(0, dataM.length),
      datasets: [
        {
          label: "Hombres",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          data: dataM,
        },
        {
          label: "Mujeres",
          backgroundColor: documentStyle.getPropertyValue("--pink-500"),
          borderColor: documentStyle.getPropertyValue("--pink-500"),
          data: dataF,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
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
    getDatosAnuales([firstDay, lastDay]);
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
    <section
      style={{
        width: "100%",
        height: "80vh",
        display: "grid",
        gridTemplateRows: "50px 1fr",
        gap: "30px",
      }}
    >
      <div className="grid grid-flow-col gap-2 w-1/4">
        <Calendar
          style={{ maxWidth: "220px" }}
          placeholder="Especificar Fecha"
          value={dates}
          onChange={(e) => {
            setDates(e.value);
            getDatosAnuales(e.value, Horario);
          }}
          selectionMode="range"
          readOnlyInput
          dateFormat="yy/mm/dd"
        />
        <Dropdown
          style={{ width: "220px" }}
          placeholder="Horario"
          value={Horario}
          onChange={(e) => {
            setHorario(e.value);
            getDatosAnuales(dates || [null, null], e.value);
          }}
          options={ListaHorarios}
          optionLabel="nombre"
        />
      </div>

      <div style={{ width: "100%" }}>
        <Chart
          height="100%"
          type="bar"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </section>
  );
}
