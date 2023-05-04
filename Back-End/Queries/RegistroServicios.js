const RegistroServicioCarreraPorAño = (year) => {
  return `SELECT  a.Especialidad as Especialidad , 
                  SUM(IF(a.sexo > 0, 1,0)) as Mujeres, 
                  SUM(IF(a.sexo = 0, 1,0)) as Hombres, 
                  YEAR(rs.Fecha) as Fecha 
          FROM registroservicios rs JOIN alumnos a ON a.Numero_Control = rs.NumControl 
          WHERE YEAR(rs.Fecha) = ${year}
          GROUP BY Especialidad;`;
};

const QueryRegistroServicios = {
  RegistroServicioCarreraPorAño,
};
module.exports = QueryRegistroServicios;
