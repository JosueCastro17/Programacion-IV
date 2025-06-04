const alumno = {
    props: ['forms', 'eventBus'],
    data() {
        return {
            accion: 'nuevo',
            idAlumno: '',
            codigo: '',
            nombre: '',
            direccion: '',
            telefono: '',
            email: '',
            errores: []
        }
    },
    methods: {
        buscarAlumno() {
            this.forms.buscarAlumno.mostrar = !this.forms.buscarAlumno.mostrar;
            this.$emit('buscar');
        },
        modificarAlumno(alumno) {
            this.accion = 'modificar';
            this.idAlumno = alumno.idAlumno;
            this.codigo = alumno.codigo;
            this.nombre = alumno.nombre;
            this.direccion = alumno.direccion;
            this.telefono = alumno.telefono;
            this.email = alumno.email;
        },
        validarFormulario() {
            this.errores = [];

            // Validación de campos vacíos
            if (!this.codigo.trim()) this.errores.push("El código no puede estar vacío.");
            if (!this.nombre.trim()) this.errores.push("El nombre no puede estar vacío.");
            if (!this.direccion.trim()) this.errores.push("La dirección no puede estar vacía.");
            if (!this.telefono.trim()) this.errores.push("El teléfono no puede estar vacío.");
            if (!this.email.trim()) this.errores.push("El correo electrónico no puede estar vacío.");
            
            // Validación de formato del teléfono (opcional, dependiendo del formato que uses)
            const telefonoPattern = /^[0-9]{8,15}$/;
            if (this.telefono && !telefonoPattern.test(this.telefono)) {
                this.errores.push("El teléfono debe tener entre 8 y 15 dígitos.");
            }

            // Validación del email
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (this.email && !emailPattern.test(this.email)) {
                this.errores.push("El correo electrónico no es válido.");
            }

            return this.errores.length === 0;
        },
        guardarAlumno() {
            if (this.validarFormulario()) {
                let alumno = {
                    codigo: this.codigo,
                    nombre: this.nombre,
                    direccion: this.direccion,
                    telefono: this.telefono,
                    email: this.email
                };
                if (this.accion == 'modificar') {
                    alumno.idAlumno = this.idAlumno;
                }
                db.alumnos.put(alumno);
                this.nuevoAlumno();
            } else {
                // Usar Alertify para mostrar los errores
                alertify.error(this.errores.join("<br>"));
            }
        },
        nuevoAlumno() {
            this.accion = 'nuevo';
            this.idAlumno = '';
            this.codigo = '';
            this.nombre = '';
            this.direccion = '';
            this.telefono = '';
            this.email = '';
        }
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmAlumno" name="frmAlumno" @submit.prevent="guardarAlumno">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Alumnos</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CODIGO</div>
                                <div class="col-9 col-md-4">
                                    <input required v-model="codigo" type="text" name="txtCodigoAlumno" id="txtCodigoAlumno" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="nombre" type="text" name="txtNombreAlumno" id="txtNombreAlumno" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">DIRECCION</div>
                                <div class="col-9 col-md-8">
                                    <input required v-model="direccion" type="text" name="txtDireccionAlumno" id="txtDireccionAlumno" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">TELEFONO</div>
                                <div class="col-9 col-md-4">
                                    <input v-model="telefono" type="text" name="txtTelefonoAlumno" id="txtTelefonoAlumno" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">EMAIL</div>
                                <div class="col-9 col-md-6">
                                    <input v-model="email" type="text" name="txtEmailAlumno" id="txtEmailAlumno" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning">
                            <input type="button" @click="buscarAlumno" value="Buscar" class="btn btn-info">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};