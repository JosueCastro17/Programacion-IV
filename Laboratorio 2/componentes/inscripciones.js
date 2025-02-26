const inscripcion = {
    props: ['forms', 'eventBus'],
    data() {
        return {
            accion: 'nuevo',
            idInscripcion: '',
            alumnoSeleccionado: null,
            fecha: '',
            materias: [],
            alumnos: [],
            inscripciones: [] // Lista en tiempo real
        };
    },
    methods: {
        buscarInscripcion() {
            this.forms.buscarInscripcion.mostrar = !this.forms.buscarInscripcion.mostrar;
            this.$emit('buscar');
        },
        modificarInscripcion(inscripcion) {
            this.accion = 'modificar';
            this.idInscripcion = inscripcion.idInscripcion;
            this.alumnoSeleccionado = inscripcion.alumnoSeleccionado;
            this.fecha = inscripcion.fecha;
            this.materias.forEach(materia => {
                materia.inscrito = inscripcion.materias.some(m => m.idMateria === materia.idMateria);
            });
        },
        cargarAlumnosMatriculados() {
            db.matriculas.toArray().then(matriculas => {
                let alumnosMatriculadosIds = matriculas.map(m => m.alumnoSeleccionado);
                db.alumnos.where('idAlumno').anyOf(alumnosMatriculadosIds).toArray().then(alumnos => {
                    this.alumnos = alumnos;
                });
            });
        },
        cargarMaterias() {
            db.materias.toArray().then(materias => {
                this.materias = materias.map(m => ({ ...m, inscrito: false }));
            });
        },
        cargarInscripciones() {
            db.inscripciones.toArray().then(inscripciones => {
                this.inscripciones = inscripciones;
            });
        },
        validarFormulario() {
            if (!this.alumnoSeleccionado) {
                alertify.error('Debe seleccionar un alumno.');
                return false;
            }
            if (!this.fecha) {
                alertify.error('Debe seleccionar una fecha.');
                return false;
            }
            const materiasInscritas = this.materias.filter(m => m.inscrito);
            if (materiasInscritas.length === 0) {
                alertify.error('Debe inscribir al menos una materia.');
                return false;
            }
            if (materiasInscritas.length > 5) {
                alertify.error('Solo se pueden inscribir hasta 5 materias.');
                return false;
            }
            return true;
        },
        guardarInscripcion() {
            if (!this.validarFormulario()) return;

            let nuevaInscripcion = {
                alumnoSeleccionado: this.alumnoSeleccionado,
                fecha: this.fecha,
                materias: this.materias
                    .filter(m => m.inscrito)
                    .map(m => ({ idMateria: m.idMateria, codigo: m.codigo, nombre: m.nombre }))
            };

            db.inscripciones.where('alumnoSeleccionado').equals(this.alumnoSeleccionado).count().then(count => {
                if (count > 0 && this.accion === 'nuevo') {
                    alertify.error('Este alumno ya está inscrito.');
                    return;
                }

                db.inscripciones.put(nuevaInscripcion).then(id => {
                    nuevaInscripcion.idInscripcion = id;
                    this.inscripciones.push(nuevaInscripcion);
                    alertify.success('Inscripción guardada correctamente.');
                    this.nuevaInscripcion();
                });
            });
        },
        nuevaInscripcion() {
            this.accion = 'nuevo';
            this.idInscripcion = '';
            this.alumnoSeleccionado = null;
            this.fecha = '';
            this.materias.forEach(m => m.inscrito = false);
        },
        inscribirMateria(materia) {
            const materiasInscritas = this.materias.filter(m => m.inscrito);
            if (materiasInscritas.length >= 5 && !materia.inscrito) {
                alertify.error('Solo se pueden inscribir hasta 5 materias.');
                return;
            }
            materia.inscrito = !materia.inscrito;
        }
    },
    mounted() {
        this.cargarAlumnosMatriculados();
        this.cargarMaterias();
        this.cargarInscripciones();
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmInscripcion" name="frmInscripcion" @submit.prevent="guardarInscripcion">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Inscripciones</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">ALUMNO</div>
                                <div class="col-9 col-md-6">
                                    <select v-model="alumnoSeleccionado" class="form-control" required>
                                        <option v-for="alumno in alumnos" :key="alumno.idAlumno" :value="alumno.idAlumno">
                                            {{ alumno.nombre }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">FECHA</div>
                                <div class="col-9 col-md-4">
                                    <input v-model="fecha" type="date" class="form-control" required>
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header bg-secondary text-white">Materias Disponibles</div>
                                        <div class="card-body">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Código</th>
                                                        <th>Nombre</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="materia in materias" :key="materia.idMateria">
                                                        <td>{{ materia.codigo }}</td>
                                                        <td>{{ materia.nombre }}</td>
                                                        <td>
                                                            <button @click.prevent="inscribirMateria(materia)" class="btn" :class="{'btn-success': !materia.inscrito, 'btn-danger': materia.inscrito}">
                                                                {{ materia.inscrito ? 'Desinscribir' : 'Inscribir' }}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning">
                            <input type="button" @click="buscarInscripcion" value="Buscar" class="btn btn-info">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};