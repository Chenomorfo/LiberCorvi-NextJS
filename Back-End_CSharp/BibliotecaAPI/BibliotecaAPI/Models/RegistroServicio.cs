using System;
using System.Collections.Generic;

namespace BibliotecaAPI.Models;

public partial class RegistroServicio
{
    public string NumeroControlEstudiante { get; set; } = null!;

    public DateTime FechaRegistro { get; set; }

    public string NombreServicio { get; set; } = null!;
}
