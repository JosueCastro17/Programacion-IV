    
 const autor = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            autores: [],
            idautor: '',
            codigo: '',
            nombre: '',
            pais: '',
            telefono: ''
        }
    },
    methods: {
        buscarautor() {
            this.forms.buscarautor.mostrar = !this.forms.buscarautor.mostrar;
            this.$emit('buscar');
        },
        modificarautor(autor) {
            this.accion = 'modificar';
            this.idautor = autor.idautor;
            this.codigo = autor.codigo;
            this.nombre = autor.nombre;
            this.pais = autor.pais;
            this.telefono = autor.telefono;
        },
        guardarautor() {
            let autor = {
                codigo: this.codigo,
                nombre: this.nombre,
                pais: this.pais,
                telefono: this.telefono
            };
            if (this.accion == 'modificar') {
                autor.idautor = this.idautor;
            }
            db.autores.put(autor);
            this.nuevoautor();
            this.listarautores();
        },
        nuevoautor() {
            this.accion = 'nuevo';
            this.idautor = '';
            this.codigo = '';
            this.nombre = '';
            this.pais = '';
            this.telefono = '';
        }
    },
    template: `
        <div class="row">
            <div class="col-6">
                <form id="frmautor" name="frmautor" @submit.prevent="guardarautor">
                    <div class="card border-dark mb-3">
                        <div class="card-header bg-dark text-white">Registro de autores</div>
                        <div class="card-body">
                            <div class="row p-1">
                                <div class="col-3 col-md-2">CODIGO</div>
                                <div class="col-9 col-md-4">
                                    <input required v-model="codigo" type="text" name="txtCodigoautor" id="txtCodigoautor" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">NOMBRE</div>
                                <div class="col-9 col-md-6">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="nombre" type="text" name="txtNombreautor" id="txtNombreautor" class="form-control">
                                </div>
                            </div>
                            <div class="row p-1">
                                <div class="col-3 col-md-2">PAIS</div>
                                <div class="col-9 col-md-8">
                                    <input required v-model="pais" type="text" name="txtpaisautor" id="txtpaisautor" class="form-control">
                                </div>
                            </div>

                            <div class="row p-1">
                                <div class="col-3 col-md-2">TELEFONO</div>
                                <div class="col-9 col-md-4">
                                    <input v-model="telefono" type="text" name="txtTelefonoautor" id="txtTelefonoautor" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-dark text-center">
                            <input type="submit" value="Guardar" class="btn btn-primary"> 
                            <input type="reset" value="Nuevo" class="btn btn-warning">
                            <input type="button" @click="buscarAutor" value="Buscar" id="btnBuscarautor" value="Buscar" class="btn btn-info">
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};