using BibliotecaAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace BibliotecaAPI.Controllers
{
    [ApiController]
    [Route("api/prestamos")]
    public class PrestamoController : Controller
    {
        private BibliotecaContext _context;
        public PrestamoController(BibliotecaContext context) => _context = context;


        [HttpGet]
        public async Task<Object> Index()
        {
            return await _context.RegistroPrestamos
                .Join(_context.Alumnos,
                rp => rp.NumeroControlEstudiante,
                a => a.NumeroControl,
                (rp, a) => new { Prestamo = rp, Alumno = a })
                .ToListAsync();
        }

        //Para solo solicitar 3 atributos en el body
        public class Prestamos
        {
            private string? _NumeroFicha;

            public string NumeroFicha
            {
                get { return _NumeroFicha; }
                set { _NumeroFicha = value; }
            }

            private int _NumeroAdquisicion;

            public int NumeroAdquisicion
            {
                get { return _NumeroAdquisicion; }
                set { _NumeroAdquisicion = value; }
            }

            private string? _NumeroControl;

            public string NumeroControl
            {
                get { return _NumeroControl; }
                set { _NumeroControl = value; }
            }
        }

        [HttpPost]
        [Route("registrar")]
        public async Task<Object> Registrar([FromBody] Prestamos prestamo)
        {
            RegistroPrestamo miRegistro = new()
            {
                NumeroFichaLibro = prestamo.NumeroFicha,
                NumeroAdquisicionLibro = prestamo.NumeroAdquisicion,
                NumeroControlEstudiante = prestamo.NumeroControl,
                FechaAdquisicion = DateTime.Now,
                FechaDevolucion = DateTime.Now.AddDays(2),
                DevolucionDisponible = true,
                RenovacionDisponible = true
            };

            _context.RegistroPrestamos.Add(miRegistro);
            _context.SaveChanges();

            return miRegistro;
        }

        [HttpPut]
        [Route("renovar/{id}")]
        public async Task<Object> Renovar(int id)
        {
            RegistroPrestamo? prestamo = await _context.RegistroPrestamos.FindAsync(id);
            if (prestamo == null)
                return Results.NotFound();

            if (prestamo.RenovacionDisponible)
            {
                prestamo.FechaDevolucion = DateTime.Now.AddDays(2);
                prestamo.RenovacionDisponible = false;
            }

            _context.SaveChanges();

            return prestamo;
        }

        [HttpPut]
        [Route("devolver/{id}")]
        public async Task<Object> Devolver(int id)
        {
            RegistroPrestamo? prestamo = await _context.RegistroPrestamos.FindAsync(id);
            if (prestamo == null)
                return Results.NotFound();

            if (prestamo.DevolucionDisponible)
                prestamo.DevolucionDisponible = false;

            _context.SaveChanges();

            return prestamo;
        }
    }
}
