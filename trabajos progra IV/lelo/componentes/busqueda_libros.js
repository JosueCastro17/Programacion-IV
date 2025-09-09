    
 const buscarlibro = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombre',
            libros: [],
        }
    },
    methods: {
        modificarlibro(libro){
            this.$emit('modificar', libro);
        },
        eliminarlibro(libro) {
            alertify.confirm('Eliminar libro', `¿Esta seguro de eliminar el libro ${libro.nombre}?`, () => {
                db.libros.delete(libro.idlibro);
                this.listarlibros();
                alertify.success(`libro ${libro.nombre} eliminado`);
            }, () => { });
        },
        async listarlibros() {
            this.libros = await db.libros.filter(libro => libro[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        },
    },
    created() {
        this.listarlibros();
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
                                    <option value="editorial">editorial</option>
                                    <option value="edicion">edicion</option>
                                   
                                </select>
                            </th>
                            <th colspan="4">
                                <input type="text" @keyup="listarlibros()" v-model="buscar" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>CODIGO</th>
                            <th>NOMBRE</th>
                            <th>editorial</th>
                            <th>edicion</th>
                          
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="libro in libros" @click="modificarlibro(libro)" :key="libro.idlibro">
                            <td>{{ libro.codigo }}</td>
                            <td>{{ libro.nombre }}</td>
                            <td>{{ libro.editorial }}</td>
                            <td>{{ libro.edicion }}</td>
                           
                            <td>
                                <button class="btn btn-danger btn-sm" 
                                    @click.stop="eliminarlibro(libro)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};