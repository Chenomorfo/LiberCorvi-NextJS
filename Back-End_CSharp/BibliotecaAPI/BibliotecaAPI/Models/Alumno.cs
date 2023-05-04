using System;
using System.Collections.Generic;

namespace BibliotecaAPI.Models;

public partial class Alumno
{
    public string NumeroControl { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string ApellidoPaterno { get; set; } = null!;

    public string ApellidoMaterno { get; set; } = null!;

    public bool Sexo { get; set; }

    public string Especialidad { get; set; } = null!;
}
