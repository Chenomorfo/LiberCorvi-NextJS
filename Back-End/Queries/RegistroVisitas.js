const TotalPoblacionPorMes = () => {
  return `SELECT YEAR(Fecha) as Year, MONTH(Fecha) as Month, SUM(Cant_Hombres) as Hombres, SUM(Cant_Mujeres) as Mujeres 
          FROM registrovisitas GROUP BY Year, Month ORDER BY Year, Month`;
};

const TotalPoblacionPorMesPorAño = (Year = 2012) => {
  return `SELECT YEAR(Fecha) as Year, MONTH(Fecha) as Month, SUM(Cant_Hombres) as Hombres, SUM(Cant_Mujeres) as Mujeres 
            FROM registrovisitas WHERE YEAR(Fecha) = ${Year} GROUP BY Year, Month ORDER BY Year, Month`;
};

const TotalPoblacionPorTrimestre = () => {
  return `SELECT YEAR(Fecha) as Year, 
                 QUARTER(Fecha) as TriMestre, 
                 SUM(Cant_Hombres) as Hombres, 
                 SUM(Cant_Mujeres) as Mujeres 
          FROM registrovisitas
          GROUP BY Year, TriMestre 
          ORDER BY Year, TriMestre;`;
};

const TotalPoblacionPorTrimestrePorAño = (Year = 2012) => {
  return `SELECT YEAR(Fecha) as Year, 
                   QUARTER(Fecha) as TriMestre, 
                   SUM(Cant_Hombres) as Hombres, 
                   SUM(Cant_Mujeres) as Mujeres 
            FROM registrovisitas WHERE YEAR(Fecha) = ${Year} 
            GROUP BY Year, TriMestre 
            ORDER BY Year, TriMestre;`;
};

const TotalPoblacionAnual = () => {
  return `SELECT YEAR(Fecha) as Year, 
                 SUM(Cant_Hombres) as Hombres, 
                 SUM(Cant_Mujeres) as Mujeres 
          FROM registrovisitas 
          GROUP BY Year 
          ORDER BY Year`;
};

const TotalPoblacionAnualEspecifica = (year = 0) => {
  return `SELECT YEAR(Fecha) as Year, 
                 SUM(Cant_Hombres) as Hombres, 
                 SUM(Cant_Mujeres) as Mujeres 
          FROM registrovisitas 
          WHERE YEAR(Fecha) = ${year}
          GROUP BY Year 
          ORDER BY Year`;
};

const TotalPoblacionAnualRango = (x = 0, y = 0) => {
  return `SELECT YEAR(Fecha) as Year, 
                 SUM(Cant_Hombres) as Hombres, 
                 SUM(Cant_Mujeres) as Mujeres 
          FROM registrovisitas 
          WHERE YEAR(Fecha) >= ${x} AND YEAR(Fecha) <= ${y}
          GROUP BY Year 
          ORDER BY Year`;
};

const QueryRegistroVisitas = {
  TotalPoblacionAnual,
  TotalPoblacionAnualEspecifica,
  TotalPoblacionAnualRango,
  TotalPoblacionPorMes,
  TotalPoblacionPorMesPorAño,
  TotalPoblacionPorTrimestre,
  TotalPoblacionPorTrimestrePorAño,
};

module.exports = QueryRegistroVisitas;
