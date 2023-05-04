using System;
using System.Collections.Generic;

namespace BibliotecaAPI.Models;

public partial class Usuario
{
    public short Id { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string NickName { get; set; } = null!;

    public string Rol { get; set; } = null!;
}
