using System;
using System.Collections.Generic;

namespace BibliotecaAPI.Models;

public partial class FichaLibro
{
    public string NumeroFicha { get; set; } = null!;

    public DateTime? FechaRegistro { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public string? Editorial { get; set; }

    public byte? Edicion { get; set; }

    public string? Isbn { get; set; }

    public string? Clasificacion { get; set; }

    public string? Titulo { get; set; }

    public string? Autor { get; set; }

    public string? Contenido { get; set; }
}
