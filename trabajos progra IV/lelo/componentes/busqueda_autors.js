    
 const buscarAutor = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombre',
            autores: [],
        }
    },
    methods: {
        modificarAutor(Autor){
            this.$emit('modificar', Autor);
        },
        eliminarAutor(Autor) {
            alertify.confirm('Eliminar Autor', `¿Esta seguro de eliminar el Autor ${Autor.nombre}?`, () => {
                db.autores.delete(Autor.idAutor);
                this.listarautores();
                alertify.success(`Autor ${Autor.nombre} eliminado`);
            }, () => { });
        },
        async listarautores() {
            this.autores = await db.autores.filter(Autor => Autor[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        },
        nuevoAutor() {
            this.accion = 'nuevo';
            this.idAutor = '';
            this.codigo = '';
            this.nombre = '';
            this.pais = '';
            this.telefono = '';
        }
    },
    created() {
        this.listarautores();
    },
    template: `
        <div class="row">
            <div class="col-6">
                <table class="table table-sm table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>BUSCAR POR</th>
                            <th>
                                <select v-model="buscarTipo" class="form-control">
                                    <option value="codigo">CODIGO</option>
                                    <option value="nombre">NOMBRE</option>
                                    <option value="pais">PAIS</option>
                                    <option value="telefono">TELÉFONO</option>
                                </select>
                            </th>
                            <th colspan="4">
                                <input type="text" @keyup="listarautores()" v-model="buscar" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>PAIS</th>  
                            <th>TELÉFONO</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="Autor in autores" @click="modificarAutor(Autor)" :key="Autor.idAutor">
                            <td>{{ Autor.codigo }}</td>
                            <td>{{ Autor.nombre }}</td>
                            <td>{{ Autor.pais }}</td>
                            <td>{{ Autor.telefono }}</td>
                            
                            <td>
                                <button class="btn btn-danger btn-sm" 
                                    @click.stop="eliminarAutor(Autor)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};