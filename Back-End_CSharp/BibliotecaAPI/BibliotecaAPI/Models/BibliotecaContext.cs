using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BibliotecaAPI.Models;

public partial class BibliotecaContext : DbContext
{
    public BibliotecaContext()
    {
    }

    public BibliotecaContext(DbContextOptions<BibliotecaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Alumno> Alumnos { get; set; }

    public virtual DbSet<FichaEjemplare> FichaEjemplares { get; set; }

    public virtual DbSet<FichaLibro> FichaLibros { get; set; }

    public virtual DbSet<RegistroPrestamo> RegistroPrestamos { get; set; }

    public virtual DbSet<RegistroServicio> RegistroServicios { get; set; }

    public virtual DbSet<RegistroVisita> RegistroVisitas { get; set; }

    public virtual DbSet<Servicio> Servicios { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS01; Database=Biblioteca; Trusted_Connection=True; TrustServerCertificate=True ");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Alumno>(entity =>
        {
            entity.HasKey(e => e.NumeroControl).HasName("PK__Alumnos__C554F4ED76D7741D");

            entity.Property(e => e.NumeroControl)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("Numero_Control");
            entity.Property(e => e.ApellidoMaterno)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Apellido_Materno");
            entity.Property(e => e.ApellidoPaterno)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Apellido_Paterno");
            entity.Property(e => e.Especialidad)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FichaEjemplare>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.FechaAdquisicion)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Adquisicion");
            entity.Property(e => e.FechaModificacion)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Modificacion");
            entity.Property(e => e.NumeroAdquisicion).HasColumnName("Numero_Adquisicion");
            entity.Property(e => e.NumeroEjemplar).HasColumnName("Numero_Ejemplar");
            entity.Property(e => e.NumeroFicha)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Numero_Ficha");
            entity.Property(e => e.UsuarioRegistro)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Usuario_Registro");
        });

        modelBuilder.Entity<FichaLibro>(entity =>
        {
            entity.HasKey(e => e.NumeroFicha).HasName("PK__FichaLib__55194265668833BB");

            entity.Property(e => e.NumeroFicha)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Numero_Ficha");
            entity.Property(e => e.Autor)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Clasificacion)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Contenido).HasColumnType("text");
            entity.Property(e => e.Editorial)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FechaModificacion)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Modificacion");
            entity.Property(e => e.FechaRegistro)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Registro");
            entity.Property(e => e.Isbn)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ISBN");
            entity.Property(e => e.Titulo)
                .HasMaxLength(150)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RegistroPrestamo>(entity =>
        {
            entity.HasKey(e => e.IdPrestamo).HasName("PK__Registro__996D603320D5C2A2");

            entity.Property(e => e.IdPrestamo).HasColumnName("Id_Prestamo");
            entity.Property(e => e.DevolucionDisponible).HasColumnName("Devolucion_Disponible");
            entity.Property(e => e.FechaAdquisicion)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Adquisicion");
            entity.Property(e => e.FechaDevolucion)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Devolucion");
            entity.Property(e => e.NumeroAdquisicionLibro).HasColumnName("NumeroAdquisicion_Libro");
            entity.Property(e => e.NumeroControlEstudiante)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("NumeroControl_Estudiante");
            entity.Property(e => e.NumeroFichaLibro)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NumeroFicha_Libro");
            entity.Property(e => e.RenovacionDisponible).HasColumnName("Renovacion_Disponible");
        });

        modelBuilder.Entity<RegistroServicio>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.FechaRegistro)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Registro");
            entity.Property(e => e.NombreServicio)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Nombre_Servicio");
            entity.Property(e => e.NumeroControlEstudiante)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasColumnName("NumeroControl_Estudiante");
        });

        modelBuilder.Entity<RegistroVisita>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.CantHombres).HasColumnName("Cant_Hombres");
            entity.Property(e => e.CantMujeres).HasColumnName("Cant_Mujeres");
            entity.Property(e => e.FechaRegistro)
                .HasColumnType("date")
                .HasColumnName("Fecha_Registro");
        });

        modelBuilder.Entity<Servicio>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Area)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Lista)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.NumeroArea).HasColumnName("Numero_Area");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Usuarios__3214EC078233DFB9");

            entity.Property(e => e.NickName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Rol)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
