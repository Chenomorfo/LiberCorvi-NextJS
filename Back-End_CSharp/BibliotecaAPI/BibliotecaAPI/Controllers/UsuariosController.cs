using BibliotecaAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaAPI.Controllers
{
    [ApiController]
    [Route("api/usuarios")]
    public class UsuariosController : Controller
    {
        private BibliotecaContext _context;
        public UsuariosController(BibliotecaContext context) => _context = context;

        [HttpGet]
        public async Task<Object> Index()
        {
            return await _context.Usuarios.ToListAsync();
        }
    }
}
