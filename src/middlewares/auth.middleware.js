
export const privateRoutes = (req, res, next) => {
    if (req.session.user) return res.redirect('/profile') 
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
            return res.status(403).json({ status: 'error', error: 'NO estas autorizado chequea tu ROL' })
        }
    }
    next()
} 

