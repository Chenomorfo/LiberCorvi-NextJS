using System;
using System.Collections.Generic;

namespace BibliotecaAPI.Models;

public partial class FichaEjemplare
{
    public string? NumeroFicha { get; set; }

    public int? NumeroAdquisicion { get; set; }

    public int? NumeroEjemplar { get; set; }

    public DateTime? FechaAdquisicion { get; set; }

    public DateTime? FechaModificacion { get; set; }

    public byte? Disponible { get; set; }

    public string? UsuarioRegistro { get; set; }
}
