const EstadisticasVisitas = () => {
  return `
    SELECT 	YEAR(Fecha) as Year, 
		MONTH(Fecha) as Month, 
        SUM(Cant_Hombres) as Hombres, 
        SUM(Cant_Mujeres) as Mujeres 
          FROM RegistroVisitas
          WHERE Fecha BETWEEN (?) AND (?)
          GROUP BY Year, Month ORDER BY Year, Month`;
};

const EstadisticasVisitasTurno = () => {
  return `
    SELECT 	YEAR(Fecha) as Year, 
		MONTH(Fecha) as Month, 
        SUM(Cant_Hombres) as Hombres, 
        SUM(Cant_Mujeres) as Mujeres 
          FROM RegistroVisitas
          WHERE Fecha BETWEEN (?) AND (?) AND Turno = (?)
          GROUP BY Year, Month ORDER BY Year, Month`;
};

const EstadisticasServicios = () => {
  return `SELECT 
  a.Especialidad as Especialidad ,
  SUM(IF(a.Sexo > 0, 1,0)) as Mujeres, 
  SUM(IF(a.Sexo = 0, 1,0)) as Hombres 
  FROM RegistroServicios rs JOIN Alumnos a ON a.Numero_Control = rs.NumControl
  WHERE Fecha BETWEEN (?) AND (?)
  GROUP BY a.Especialidad;`;
};

const EstadisticasServiciosTurno = () => {
  return `SELECT 
  a.Especialidad as Especialidad ,
  SUM(IF(a.Sexo > 0, 1,0)) as Mujeres, 
  SUM(IF(a.Sexo = 0, 1,0)) as Hombres 
  FROM RegistroServicios rs JOIN Alumnos a ON a.Numero_Control = rs.NumControl
  WHERE Fecha BETWEEN (?) AND (?) AND UsuarioRegistro = (?)
  GROUP BY a.Especialidad;`;
};

const EstadisticasServiciosLista = () => {
  return `SELECT 
        a.Especialidad as Especialidad ,
        SUM(IF(a.Sexo > 0, 1,0)) as Mujeres, 
        SUM(IF(a.Sexo = 0, 1,0)) as Hombres 
      FROM RegistroServicios rs JOIN Alumnos a ON a.Numero_Control = rs.NumControl
      WHERE  Fecha BETWEEN (?) AND (?) AND Servicio IN (?)
      GROUP BY a.Especialidad;`;
};

const EstadisticasServiciosListaTurno = () => {
  return `SELECT 
        a.Especialidad as Especialidad ,
        SUM(IF(a.Sexo > 0, 1,0)) as Mujeres, 
        SUM(IF(a.Sexo = 0, 1,0)) as Hombres 
      FROM RegistroServicios rs JOIN Alumnos a ON a.Numero_Control = rs.NumControl
      WHERE  Fecha BETWEEN (?) AND (?) AND Servicio IN (?) AND UsuarioRegistro = (?)
      GROUP BY a.Especialidad;`;
};

module.exports = {
  EstadisticasVisitas,
  EstadisticasVisitasTurno,
  EstadisticasServicios,
  EstadisticasServiciosTurno,
  EstadisticasServiciosLista,
  EstadisticasServiciosListaTurno,
};
