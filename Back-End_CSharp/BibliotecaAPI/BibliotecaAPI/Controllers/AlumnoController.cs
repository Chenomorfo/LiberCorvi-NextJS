using BibliotecaAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Drawing.Text;

namespace BibliotecaAPI.Controllers
{
    [ApiController]
    [Route("api/alumnos")]
    public class AlumnoController : Controller
    {
        private readonly BibliotecaContext _context;

        public AlumnoController(BibliotecaContext context) => _context = context;


        [HttpGet]
        public async Task<Object> Index() => await _context.Alumnos.Take(50).ToListAsync();

        [HttpGet]
        [Route("filtrar")]
        public async Task<Object> Filtrar([FromQuery] string Ncontrol)
        {
            var alumno = await _context.Alumnos.Where(a => a.NumeroControl.StartsWith(Ncontrol)).ToListAsync();
            return alumno != null ? Results.Ok(alumno) : Results.NotFound();
        }

        [HttpGet]
        [Route("consultar")]
        public async Task<Object> Consultar([FromQuery] string Ncontrol)
        {
            var alumno = await _context.Alumnos.FindAsync(Ncontrol);
            return alumno != null ? Results.Ok(alumno) : Results.NotFound();
        }

        [HttpGet]
        [Route("agrupar")]
        public async Task<Object> Agrupar([FromQuery] List<string> Ncontrol)
        {

            List<Object> alumnos = new List<object>();
            foreach (string value in Ncontrol)
            {
                var alumno = await _context.Alumnos.FindAsync(value);
                if (alumno != null)
                    alumnos.Add(alumno);
            }
            return alumnos;
        }

    }
}
