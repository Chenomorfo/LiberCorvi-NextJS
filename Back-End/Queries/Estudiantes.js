const NombreCompleto = `CONCAT(a.Nombre," ",a.Apellido_Paterno," ",a.Apellido_Materno)`;

const BuscarAlumno = (Ncontrol) => {
  return `
    SELECT 
    	a.Numero_Control,
    	${NombreCompleto} as NombreCompleto,
        a.Sexo,
        a.Especialidad
	FROM Alumnos a WHERE a.Numero_Control LIKE '%${Ncontrol}%'`;
};

const EncontrarAlumno = (Ncontrol) => {
  return `
      SELECT 
          a.Numero_Control,
          CONCAT(a.Nombre," ",a.Apellido_Paterno," ",a.Apellido_Materno) as NombreCompleto,
          a.Sexo,
          a.Especialidad
      FROM Alumnos a WHERE a.Numero_Control = '${Ncontrol}'`;
};

module.exports = {
  NombreCompleto,
  BuscarAlumno,
  EncontrarAlumno,
};
