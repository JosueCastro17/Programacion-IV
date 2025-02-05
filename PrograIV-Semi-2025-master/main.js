const { createApp } = Vue;

createApp({
    data() {
        return {
            alumnos: [],
            codigo: '',
            nombre: '',
            direccion: '',
            telefono: '',
            email: '',
            genero: '',
            departamento: '',
            municipio: '',
            fechaNacimiento: '',
            modoEdicion: false, 
            departamentos: [
                "Ahuachapán", "Santa Ana", "Sonsonate", "Chalatenango", "La Libertad",
                "San Salvador", "Cuscatlán", "La Paz", "Cabañas", "San Vicente",
                "Usulután", "San Miguel", "Morazán", "La Unión"
            ],
            municipios: [],
            listaMunicipios: {
                "Ahuachapán": ["Ahuachapán", "Atiquizaya", "Apaneca"],
                "Santa Ana": ["Santa Ana", "Metapán", "Chalchuapa"],
                "Sonsonate": ["Sonsonate", "Acajutla", "Izalco"],
                "Chalatenango": ["Chalatenango", "Dulce Nombre de María", "La Palma"],
                "La Libertad": ["Santa Tecla", "Antiguo Cuscatlán", "Quezaltepeque"],
                "San Salvador": ["San Salvador", "Soyapango", "Mejicanos"],
                "Cuscatlán": ["Cojutepeque", "Suchitoto", "El Carmen"],
                "La Paz": ["Zacatecoluca", "San Luis Talpa", "Olocuilta"],
                "Cabañas": ["Sensuntepeque", "Ilobasco", "Jutiapa"],
                "San Vicente": ["San Vicente", "Apastepeque", "Tecoluca"],
                "Usulután": ["Usulután", "Jiquilisco", "Santiago de María"],
                "San Miguel": ["San Miguel", "Chirilagua", "Uluazapa"],
                "Morazán": ["San Francisco Gotera", "Cacaopera", "Corinto"],
                "La Unión": ["La Unión", "Conchagua", "El Carmen"]
            },
            busqueda: ''
        };
    },
    computed: {
        alumnosFiltrados() {
            return this.alumnos.filter(alumno => {
                return (
                    alumno.codigo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    alumno.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    alumno.departamento.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    alumno.municipio.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    alumno.telefono.toLowerCase().includes(this.busqueda.toLowerCase())
                );
            });
        }
    },
    methods: {
        cargarMunicipios() {
            this.municipios = this.listaMunicipios[this.departamento] || [];
            this.municipio = ''; 
        },
        eliminarAlumno(alumno) {
            if (confirm(`¿Está seguro de eliminar el alumno ${alumno.nombre}?`)) {
                localStorage.removeItem(alumno.codigo);
                this.listarAlumnos();
            }
        },
        verAlumno(alumno) {
            this.codigo = alumno.codigo;
            this.nombre = alumno.nombre;
            this.direccion = alumno.direccion;
            this.telefono = alumno.telefono;
            this.email = alumno.email;
            this.genero = alumno.genero;
            this.departamento = alumno.departamento;
            this.municipio = alumno.municipio;
            this.fechaNacimiento = alumno.fechaNacimiento;
            this.modoEdicion = true;
            this.cargarMunicipios();
        },
        guardarAlumno() {
            if (!this.codigo.trim()) {
                alert("El código es obligatorio.");
                return;
            }

            let alumno = {
                codigo: this.codigo,
                nombre: this.nombre,
                direccion: this.direccion,
                telefono: this.telefono,
                email: this.email,
                genero: this.genero,
                departamento: this.departamento,
                municipio: this.municipio,
                fechaNacimiento: this.fechaNacimiento
            };

            if (this.modoEdicion) {
               
                localStorage.setItem(this.codigo, JSON.stringify(alumno));
            } else {
                
                if (localStorage.getItem(this.codigo)) {
                    alert("El código ya existe. Usa otro.");
                    return;
                }
                localStorage.setItem(this.codigo, JSON.stringify(alumno));
            }

            this.listarAlumnos();
            this.limpiarFormulario();
        },
        listarAlumnos() {
            this.alumnos = [];
            for (let i = 0; i < localStorage.length; i++) {
                let clave = localStorage.key(i),
                    valor = localStorage.getItem(clave);
                this.alumnos.push(JSON.parse(valor));
            }
        },
        limpiarFormulario() {
            this.codigo = '';
            this.nombre = '';
            this.direccion = '';
            this.telefono = '';
            this.email = '';
            this.genero = '';
            this.departamento = '';
            this.municipio = '';
            this.fechaNacimiento = '';
            this.modoEdicion = false;
        }
    },
    created() {
        this.listarAlumnos();
    }
}).mount('#app');
