using System;
using System.Collections.Generic;

namespace BibliotecaAPI.Models;

public partial class Servicio
{
    public string Area { get; set; } = null!;

    public byte NumeroArea { get; set; }

    public string? Lista { get; set; }
}
