using BibliotecaAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace BibliotecaAPI.Controllers
{
    [ApiController]
    [Route("api/libros")]
    public class LibrosController : Controller
    {
        private readonly BibliotecaContext _context;
        public LibrosController(BibliotecaContext context) => _context = context;

        [HttpGet]
        public async Task<Object> Index() => await _context.FichaLibros.Take(50).ToListAsync();


        [HttpGet]
        [Route("filtrar")]
        public async Task<Object> Filtrar([FromQuery] string filtro)
        {

            return await _context.FichaLibros
                .Where(fl => fl.Autor.Contains(filtro) || fl.Titulo.Contains(filtro)).Take(50).ToListAsync();

        }
    }
}
