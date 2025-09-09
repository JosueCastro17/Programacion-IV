const {createApp, ref} = Vue;
const Dexie = window.Dexie,
    db = new Dexie('db_academico');

const app = createApp({
    components: {
        libro,
        autor,
        usuario,
        buscarlibro,
        buscarAutor,
        buscarUsuario,
        login

    },
    data() {
        return {
            forms : {
                usuariologueado: true,
                libro: {mostrar: false},
                buscarlibro: {mostrar: false},
                autor: {mostrar: false},
                buscarautor: {mostrar: false},
                matricula: {mostrar: false},
                usuario: {mostrar: false},
                buscarUsuario: {mostrar: false},
                login: {mostrar: false}

            }
           
        };
    },
    methods: {
        buscar(form, metodo) {
            this.$refs[form][metodo]();
        },
        abrirFormulario(componente) {
            this.forms[componente].mostrar = !this.forms[componente].mostrar;
        },
        modificar(form, metodo, datos) {
            this.$refs[form][metodo](datos);
        },

       

      

    },
    created() {
        db.version(1).stores({
            libros: '++idlibro, codigo, nombre, direccion, telefono, email',
            autores: '++idautor, codigo, nombre, uv',
            usuarios: '++idUsuario, nombre, correo, contraseña, telefono, direccion'
        });
    }
});
app.mount('#app');
