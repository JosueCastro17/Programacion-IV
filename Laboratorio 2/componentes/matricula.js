const matricula = {
    props: ['forms', 'eventBus'],
    data() {
        return {
            accion: 'nuevo',
            idMatricula: '',
            alumnoSeleccionado: null,
            fecha: '',
            periodo: '',
            alumnos: [], // Lista de alumnos para seleccionar
            periodos: [
                { valor: 'Ciclo I - 2025', texto: 'Ciclo I - 2025' },
                { valor: 'Ciclo II - 2025', texto: 'Ciclo II - 2025' },
                { valor: 'Ciclo III - 2026', texto: 'Ciclo III - 2026' }
            ]
        };
    },
    methods: {
        buscarMatricula() {
            this.forms.buscarMatricula.mostrar = !this.forms.buscarMatricula.mostrar;
            this.$emit('buscar');
        },
        modificarMatricula(matricula) {
            this.accion = 'modificar';
            this.idMatricula = matricula.idMatricula;
            this.alumnoSeleccionado = matricula.alumnoSeleccionado;
            this.fecha = matricula.fecha;
            this.periodo = matricula.periodo;
        },
        validarFormulario() {
            if (!this.alumnoSeleccionado) {
                alertify.error('Debe seleccionar un alumno.');
                return false;
            }
            if (!this.fecha.trim()) {
                alertify.error('Debe ingresar una fecha.');
                return false;
            }
            if (!this.periodo.trim()) {
                alertify.error('Debe seleccionar un período.');
                return false;
            }
            return true;
        },
        guardarMatricula() {
            if (!this.validarFormulario()) return;

            let nuevaMatricula = {
                alumnoSeleccionado: this.alumnoSeleccionado,
                fecha: this.fecha,
                periodo: this.periodo
            };

            db.matriculas.where({ alumnoSeleccionado: this.alumnoSeleccionado, periodo: this.periodo }).count().then(count => {
                if (count > 0 && this.accion === 'nuevo') {
                    alertify.error('El alumno ya está matriculado en este período.');
                    return;
                }

                if (this.accion === 'modificar') {
                    nuevaMatricula.idMatricula = this.idMatricula;
                }

                db.matriculas.put(nuevaMatricula).then(() => {
                    alertify.success('Matrícula guardada correctamente.');
                    this.nuevaMatricula();
                });
            });
        },
        nuevaMatricula() {
            this.accion = 'nuevo';
            this.idMatricula = '';
            this.alumnoSeleccionado = null;
            this.fecha = '';
            this.periodo = '';
        },
        cargarAlumnos() {
            db.alumnos.toArray().then(alumnos => {
                this.alumnos = alumnos;
            });
        }
    },
    mounted() {
        this.cargarAlumnos();
        db.alumnos.hook('creating', () => this.cargarAlumnos());
        db.alumnos.hook('updating', () => this.cargarAlumnos());
        db.alumnos.hook('deleting', () => this.cargarAlumnos());
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmMatricula" name="frmMatricula" @submit.prevent="guardarMatricula">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Matrículas</div>
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
                                <div class="col-3 col-md-2">PERIODO</div>
                                <div class="col-9 col-md-4">
                                    <select v-model="periodo" class="form-control" required>
                                        <option v-for="periodo in periodos" :key="periodo.valor" :value="periodo.valor">
                                            {{ periodo.texto }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning">
                            <input type="button" @click="buscarMatricula" value="Buscar" class="btn btn-info">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};