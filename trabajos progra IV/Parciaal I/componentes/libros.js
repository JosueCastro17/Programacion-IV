    
 const libro = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            idlibro: '',
            codigo: '',
            nombre: '',
            direccion: '',
            telefono: '',
            email: ''
        }
    },
    methods: {
        buscarlibro() {
            this.forms.buscarlibro.mostrar = !this.forms.buscarlibro.mostrar;
            this.$emit('buscar');
        },
        modificarlibro(libro) {
            this.accion = 'modificar';
            this.idlibro = libro.idlibro;
            this.codigo = libro.codigo;
            this.nombre = libro.nombre;
            this.direccion = libro.direccion;
            this.telefono = libro.telefono;
            this.email = libro.email;
        },
        guardarlibro() {
            let libro = {
                codigo: this.codigo,
                nombre: this.nombre,
                direccion: this.direccion,
                telefono: this.telefono,
                email: this.email
            };
            if (this.accion == 'modificar') {
                libro.idlibro = this.idlibro;
            }
            db.libros.put(libro);
            this.nuevolibro();
        },
        nuevolibro() {
            this.accion = 'nuevo';
            this.idlibro = '';
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
                <form id="frmlibro" name="frmlibro" @submit.prevent="guardarlibro">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de libros</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CODIGO</div>
                                <div class="col-9 col-md-4">
                                    <input required v-model="codigo" type="text" name="txtCodigolibro" id="txtCodigolibro" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="nombre" type="text" name="txtNombrelibro" id="txtNombrelibro" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">DIRECCION</div>
                                <div class="col-9 col-md-8">
                                    <input required v-model="direccion" type="text" name="txtDireccionlibro" id="txtDireccionlibro" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">TELEFONO</div>
                                <div class="col-9 col-md-4">
                                    <input v-model="telefono" type="text" name="txtTelefonolibro" id="txtTelefonolibro" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">EMAIL</div>
                                <div class="col-9 col-md-6">
                                    <input v-model="email" type="text" name="txtEmaillibro" id="txtEmaillibro" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning">
                            <input type="button" @click="buscarlibro" value="Buscar" class="btn btn-info">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};