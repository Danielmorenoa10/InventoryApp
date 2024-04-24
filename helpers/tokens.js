import jwt from  'jsonwebtoken'

const generarJWT =  datos => jwt.sign({ id: datos.id, usuario: datos.usuario }, process.env.JWT_SECRET, {expiresIn: '1d'})
const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarId,
    generarJWT,
}