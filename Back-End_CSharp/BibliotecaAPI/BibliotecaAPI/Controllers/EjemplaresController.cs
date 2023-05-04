using BibliotecaAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaAPI.Controllers
{
    [ApiController]
    [Route("api/ejemplares")]
    public class EjemplaresController : Controller
    {
        private readonly BibliotecaContext _context;
        public EjemplaresController(BibliotecaContext context) => _context = context;

        [HttpGet]
        public async Task<Object> Index() => await _context.FichaEjemplares.Take(50).ToListAsync();

        [HttpGet]
        [Route("consultar")]
        public async Task<Object> Consultar([FromQuery] int ficha)
        {
            return await _context.FichaEjemplares.Where(fe => fe.NumeroAdquisicion.Equals(ficha))
                .Join(_context.FichaLibros,
                fe => fe.NumeroFicha,
                fl => fl.NumeroFicha,
                (fe, fl) => new { FichaEjemplar = fe, FichaLibro = fl })
                .ToListAsync();

        }

    }
}
