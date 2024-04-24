import estado from "../models/estado.js";
import ubicacion from "../models/ubicacion.js";

const home = (req, res) => {
    res.render('assets/home', {
        pagina: 'Assets',
        barra: true
    });
}


//form para crear nuevo assets 
const crear = async (req, res) => {
    //consultar modelo de ubicacion y estado
    const [ubicaciones, estados] = await Promise.all([
        ubicacion.findAll(),
        estado.findAll()
    ])
    res.render('assets/crear', {
        pagina: 'Crear Nuevo asset',
        barra: true,
        ubicaciones,
        estados
    });
}

export { home, crear };
