using System;
using System.Collections.Generic;

namespace BibliotecaAPI.Models;

public partial class RegistroPrestamo
{
    public int IdPrestamo { get; set; }

    public string NumeroFichaLibro { get; set; } = null!;

    public int NumeroAdquisicionLibro { get; set; }

    public string NumeroControlEstudiante { get; set; } = null!;

    public DateTime FechaAdquisicion { get; set; }

    public DateTime FechaDevolucion { get; set; }

    public bool RenovacionDisponible { get; set; }

    public bool DevolucionDisponible { get; set; }
}
