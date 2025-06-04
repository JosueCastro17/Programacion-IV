const login = {
    data() {
        return {
            correo: '',
            contraseña: '',
            mensaje: ''
        };
    },
    methods: {
        async iniciarSesion() {
            const usuario = await db.usuarios.get({ correo: this.correo });

            if (usuario && usuario.contraseña === this.contraseña) {
                this.$emit('usuario-logueado', usuario);
                this.mensaje = 'Inicio de sesión exitoso';
                alertify.success(this.mensaje);
                // Guardar usuario en sesión o redirigir a otra vista
            } else {
                this.mensaje = 'Correo o contraseña incorrectos';
                alertify.error(this.mensaje);
            }
        }
    },
    template: `
        <div>
            <h3>Iniciar Sesión</h3>
            <input type="email" v-model="correo" placeholder="Correo" class="form-control">
            <input type="password" v-model="contraseña" placeholder="Contraseña" class="form-control">
            <button @click="iniciarSesion" class="btn btn-primary">Ingresar</button>
            <p>{{ mensaje }}</p>
        </div>
    `
};