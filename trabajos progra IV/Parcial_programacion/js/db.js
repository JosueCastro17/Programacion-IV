const db = new Dexie("db_codigo_estudiante");

db.version(1).stores({
    autores: "++idAutor, codigo, nombre, pais, telefono",
    libros: "++idLibro, idAutor, isbn, titulo, editorial, edicion"
});

db.open().catch(err => {
    console.error("Error al abrir la base de datos: " + err);
});
