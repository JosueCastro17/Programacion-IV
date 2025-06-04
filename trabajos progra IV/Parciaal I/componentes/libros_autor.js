const libroAutor = {
    props: ['forms'],
    data() {
        return {
            idRelacion: '',
            libroSeleccionado: '',
            autorSeleccionado: '',
            relaciones: [],
            libros: [],
            autores: []
        };
    },
    methods: {
        async cargarLibrosYAutores() {
            this.libros = await db.libros.toArray();
            this.autores = await db.autores.toArray();
        },
        guardarRelacion() {
            if (this.libroSeleccionado && this.autorSeleccionado) {
                let relacion = {
                    libroId: this.libroSeleccionado,
                    autorId: this.autorSeleccionado
                };
                db.relaciones.put(relacion);
                this.nuevaRelacion();
            }
        },
        nuevaRelacion() {
            this.libroSeleccionado = '';
            this.autorSeleccionado = '';
        }
    },
    created() {
        db.version(1).stores({
            relaciones: '++idRelacion, libroId, autorId'
        });
        this.cargarLibrosYAutores();
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form @submit.prevent="guardarRelacion">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Asociar Libro con Autor</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3">Libro</div>
                                <div class="col-9">
                                    <select v-model="libroSeleccionado" class="form-control" required>
                                        <option value="" disabled>Seleccione un libro</option>
                                        <option v-for="libro in libros" :key="libro.idlibro" :value="libro.idlibro">
                                            {{ libro.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3">Autor</div>
                                <div class="col-9">
                                    <select v-model="autorSeleccionado" class="form-control" required>
                                        <option value="" disabled>Seleccione un autor</option>
                                        <option v-for="autor in autores" :key="autor.idautor" :value="autor.idautor">
                                            {{ autor.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning" @click="nuevaRelacion">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};