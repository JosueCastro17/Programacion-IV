const { createApp } = Vue;

createApp({
    data() {
        return {
            mesFiltro: "",  // Nuevo filtro de mes
            alumnos: [],
            codigo: '',
            nombre: '',
            direccion: '',
            departamento: '',
            municipio: '',
            distrito: '',
            telefono: '',
            sexo: '',
            fechaNacimiento: '',
            email: '',
            busqueda: '', 
            datosUbicacion: {
                "San Salvador": {
                    "San Salvador Norte": ["Centro Histórico", "Colonia Escalón", "Ciudad Merliot"],
                    "San Salvador Centro": ["Unicentro", "Las Margaritas", "Bosques del Río"],
                    "San Salvador Oeste": ["Zacamil", "Centro", "San Roque"]
                },
                "La Libertad": {
                    "Libertad Norte": ["Centro", "La Sultana", "Merliot"],
                    "Libertad Sur": ["Zona Industrial", "Universitaria", "Santa Elena"],
                    "Libertad Centro": ["El Carmen", "San Sebastián", "Centro"]
                },
                "Santa Ana": {
                    "Santa Ana Norte": ["Distrito de Masahuat", "Distrito de Metapán", "Distrito de Texistepeque"],
                    "Santa Ana Sur": ["San Pedro", "San Juan", "La Palma"],
                    "Santa Ana Este": ["Las Flores", "Centro", "Candelaria"]
                }
            },
            municipios: [],
            distritos: [],
            sexos: ["Masculino", "Femenino"] // Menú de selección
        };
    },
    computed: {
        alumnosFiltrados() {
            let filtro = this.busqueda.toLowerCase();
            return this.alumnos.filter(alumno => {
                const coincideBusqueda = 
                    alumno.codigo.toLowerCase().includes(filtro) ||
                    alumno.nombre.toLowerCase().includes(filtro) ||
                    alumno.departamento.toLowerCase().includes(filtro) ||
                    alumno.telefono.includes(filtro) ||
                    alumno.email.toLowerCase().includes(filtro);

                const coincideMes = this.mesFiltro === "" || 
                    (alumno.fechaNacimiento && alumno.fechaNacimiento.split("-")[1] === this.mesFiltro);

                return coincideBusqueda && coincideMes;
            });
        }
    },
    methods: {
        cargarMunicipios() {
            this.municipios = Object.keys(this.datosUbicacion[this.departamento] || {});
            this.municipio = "";
            this.distritos = [];
        },
        cargarDistritos() {
            this.distritos = this.datosUbicacion[this.departamento]?.[this.municipio] || [];
            this.distrito = "";
        },
        validarDatos() {
            if (!this.nombre.trim()) {
                alertify.error("❌ El campo de nombre no puede estar vacío.");
                return false;
            }
            if (!this.sexo) {
                alertify.error("❌ Debe seleccionar un sexo.");
                return false;
            }
            if (!/^\d{4}-\d{4}$/.test(this.telefono)) {
                alertify.error("❌ El teléfono debe tener el formato 1234-5678.");
                return false;
            }
            if (!this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                alertify.error("❌ El formato del correo electrónico no es válido.");
                return false;
            }
            return true;
        },
        formatearTelefono() {
            this.telefono = this.telefono.replace(/\D/g, '').slice(0, 8);
            if (this.telefono.length > 4) {
                this.telefono = this.telefono.slice(0, 4) + '-' + this.telefono.slice(4);
            }
        },
        guardarAlumno() {
            if (!this.validarDatos()) return;
            let alumno = {
                codigo: this.codigo,
                nombre: this.nombre,
                direccion: this.direccion,
                departamento: this.departamento,
                municipio: this.municipio,
                distrito: this.distrito,
                telefono: this.telefono,
                sexo: this.sexo,
                fechaNacimiento: this.fechaNacimiento,
                email: this.email
            };
            localStorage.setItem(this.codigo, JSON.stringify(alumno));
            this.listarAlumnos();
            this.limpiarFormulario();
            alertify.success("✅ Alumno guardado exitosamente.");
        },
        listarAlumnos() {
            this.alumnos = [];
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                let alumno = JSON.parse(localStorage.getItem(key));
                if (alumno) this.alumnos.push(alumno);
            }
        },
        verAlumno(alumno) {
            if (!localStorage.getItem(alumno.codigo)) return;
            Object.assign(this, alumno);
        },
        eliminarAlumno(alumno) {
            alertify.confirm(
                "Eliminar Alumno",
                `¿Estás seguro de que deseas eliminar al alumno <b>${alumno.nombre}</b>?`,
                () => {
                    localStorage.removeItem(alumno.codigo);
                    this.listarAlumnos();
                    this.limpiarFormulario();
                    alertify.success("✅ Operación exitosa: Alumno eliminado.");
                },
                () => {
                    alertify.warning("⚠️ Has cancelado la acción.");
                }
            ).set({ labels: { ok: "Sí, eliminar", cancel: "Cancelar" } });
        },
        limpiarFormulario() {
            this.codigo = '';
            this.nombre = '';
            this.direccion = '';
            this.departamento = '';
            this.municipio = '';
            this.distrito = '';
            this.telefono = '';
            this.sexo = '';
            this.fechaNacimiento = '';
            this.email = '';
            this.municipios = [];
            this.distritos = [];
        }
    },
    created() {
        this.listarAlumnos();
    }
}).mount("#app");
