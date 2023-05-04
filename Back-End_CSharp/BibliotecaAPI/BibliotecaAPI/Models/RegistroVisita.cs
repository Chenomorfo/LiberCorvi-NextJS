using System;
using System.Collections.Generic;

namespace BibliotecaAPI.Models;

public partial class RegistroVisita
{
    public DateTime FechaRegistro { get; set; }

    public short? CantHombres { get; set; }

    public short? CantMujeres { get; set; }
}
