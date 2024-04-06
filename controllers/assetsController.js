
const home = (req, res) => {
    res.render('assets/home', {
        pagina: 'Assets',
        barra: true
    });
}

const crear = (req, res) => {
    res.render('assets/crear', {
        pagina: 'Crear Nuevo asset',
        barra: true,
    });
}

export { home, crear };
