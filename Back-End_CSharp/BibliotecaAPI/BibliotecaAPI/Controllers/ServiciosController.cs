using BibliotecaAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaAPI.Controllers
{
    [ApiController]
    [Route("api/servicios")]
    public class ServiciosController : Controller
    {
        private readonly BibliotecaContext _context;

        public ServiciosController(BibliotecaContext context) => _context = context;

        [HttpGet]
        public async Task<Object> Index()
        {
            return await _context.RegistroServicios.ToListAsync();
        }

    }
}
