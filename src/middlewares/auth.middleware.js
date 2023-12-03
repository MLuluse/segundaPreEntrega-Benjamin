import logger from "../utils/logger.js"

export const privateRoutes = (req, res, next) => {
    const user = req.session.user
    if (!user) {
        logger.error(`Usuario ${user} intentó acceder a ruta privada`)
        return res.status(401).send('Not authorized, you must register first')
    } return res.redirect('/profile') 

        next()
}

export const publicRoutes = (req, res, next) => {
    if(!req.session.user) return res.redirect('/')
    next()
}
// handle polices se va a usar en los router para autorizar si pasa o no
export const handlePolices = policies => (req, res, next) => {
    if (policies.includes('PUBLIC')) return next()
    if (!req.session.user) return res.status(401).json({ status: 'error', error: 'No estas logueado' })
    if (policies.length > 0) {
        if (!policies.includes(req.session.user.role.toUpperCase())) {
            logger.error('difernete rol quizo quizo cambiar cosas' )
            return res.status(403).json({ status: 'error', error: 'NO estas autorizado chequea tu ROL' })
        }
    }
    next()
} 

