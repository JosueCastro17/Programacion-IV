const buscarUsuario = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombre',
            usuarios: [],
        }
    },
    methods: {
        modificarUsuario(usuario) {
            this.$emit('modificar', usuario);
        },
        eliminarUsuario(usuario) {
            alertify.confirm('Eliminar Usuario', `¿Está seguro de eliminar al usuario ${usuario.nombre}?`, () => {
                db.usuarios.delete(usuario.idUsuario);
                this.listarUsuarios();
                alertify.success(`Usuario ${usuario.nombre} eliminado`);
            }, () => { });
        },
        async listarUsuarios() {
            this.usuarios = await db.usuarios.filter(usuario => usuario[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        }
    },
    created() {
        this.listarUsuarios();
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
                                    <option value="nombre">NOMBRE</option>
                                    <option value="correo">CORREO</option>
                                    <option value="telefono">TELÉFONO</option>
                                </select>
                            </th>
                            <th colspan="5">
                                <input type="text" @keyup="listarUsuarios()" v-model="buscar" class="form-control">
                            </th>
                        </tr>
                        <tr>
                            <th>NOMBRE</th>
                            <th>CORREO</th>
                            <th>TELÉFONO</th>  
                            <th>DIRECCIÓN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="usuario in usuarios" @click="modificarUsuario(usuario)" :key="usuario.idUsuario">
                            <td>{{ usuario.nombre }}</td>
                            <td>{{ usuario.correo }}</td>
                            <td>{{ usuario.telefono }}</td>
                            <td>{{ usuario.direccion }}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" 
                                    @click.stop="eliminarUsuario(usuario)">DEL</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};
