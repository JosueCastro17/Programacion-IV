const usuario = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            usuarios: [],
            idUsuario: '',
            nombre: '',
            correo: '',
            password: '',
            telefono: '',
            direccion: ''
        };
    },
    methods: {
        buscarUsuario() {
            this.forms.buscarUsuario.mostrar = !this.forms.buscarUsuario.mostrar;
            this.$emit('buscar');
        },
        modificarUsuario(usuario) {
            this.accion = 'modificar';
            this.idUsuario = usuario.idUsuario;
            this.nombre = usuario.nombre;
            this.correo = usuario.correo;
            this.password = usuario.password;
            this.telefono = usuario.telefono;
            this.direccion = usuario.direccion;
        },
        guardarUsuario() {
            let usuario = {
                nombre: this.nombre,
                correo: this.correo,
                password: this.password,
                telefono: this.telefono,
                direccion: this.direccion
            };
            if (this.accion == 'modificar') {
                usuario.idUsuario = this.idUsuario;
            }
            db.usuarios.put(usuario);
            this.nuevoUsuario();
            this.listarUsuarios();
        },
        nuevoUsuario() {
            this.accion = 'nuevo';
            this.idUsuario = '';
            this.nombre = '';
            this.correo = '';
            this.password = '';
            this.telefono = '';
            this.direccion = '';
        }
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmUsuario" name="frmUsuario" @submit.prevent="guardarUsuario">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de Usuarios</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="nombre" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CORREO</div>
                                <div class="col-9 col-md-6">
                                    <input required v-model="correo" type="email" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CONTRASEÑA</div>
                                <div class="col-9 col-md-6">
                                    <input required v-model="password" type="password" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">TELÉFONO</div>
                                <div class="col-9 col-md-6">
                                    <input required v-model="telefono" type="text" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">DIRECCIÓN</div>
                                <div class="col-9 col-md-6">
                                    <input required v-model="direccion" type="text" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning" @click="nuevoUsuario">
                            <input type="button" @click="buscarUsuario" value="Buscar" class="btn btn-info">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};
