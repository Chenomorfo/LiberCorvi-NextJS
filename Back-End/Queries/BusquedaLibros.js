const ConsultarLibro = (FichaLibro) => {
  return `SELECT 
                fl.Titulo, 
                fl.Autor, 
                fl.Contenido,
                fl.Clasificacion, 
                fl.Editorial,
                fl.Edicion 
            FROM fichalibros fl 
            WHERE fl.Numero_Ficha = '${FichaLibro}'; `;
};

const ConsultarFicha = (Ficha) => {
  return `SELECT 	fe.Numero_Ficha,
                  fe.Numero_Adquisicion,
                  fl.Clasificacion,
                  fl.Titulo,
                  fl.Autor,
                  fl.Contenido,
                  fl.Editorial,
                  fl.Edicion
          FROM 	fichaejemplares fe JOIN 
          fichalibros 	fl 	ON fl.Numero_Ficha = fe.Numero_Ficha
          WHERE fe.Numero_Adquisicion = ${Ficha}`;
};

const MostrarEjemplares = (filtro) => {
  return `SELECT  fe.Numero_Ficha, 
                  DENSE_RANK() OVER(PARTITION BY 
                    fe.Numero_Ficha ORDER BY fe.Numero_Adquisicion ASC) 
                  as NumeroEjemplar, 
                  fe.Numero_Adquisicion,
                  fe.Disponible 
          FROM    fichaejemplares fe 
          Where   fe.Numero_Ficha = '${filtro}' 
          ORDER BY  fe.Numero_Ficha,
                    fe.Numero_Adquisicion ASC;`;
};

const MostrarPrestamos = () => {
  return `SELECT rp.Id_Prestamo, 	
                rp.NumeroFicha_Libro as FichaLibro,
                rp.NumeroEjemplar_Libro as FichaEjemplar,
                a.Numero_Control as Estudiante,
                CONCAT(a.Nombre," ", a.Apellido_Paterno," ",a.Apellido_Materno) as Nombre,
                rp.FechaAdquisicion,
                rp.FechaDevolucion,
                rp.RenovacionDisponible as Renovacion,
                rp.DevolucionDisponible as Devolucion 
          FROM registroprestamos rp JOIN alumnos a 
          ON a.Numero_Control = rp.NumeroControl_Estudiante
          WHERE rp.DevolucionDisponible > 0;`;
};

const busquedaLibros = {
  ConsultarLibro,
  MostrarEjemplares,
  MostrarPrestamos,
  ConsultarFicha,
};
module.exports = busquedaLibros;
