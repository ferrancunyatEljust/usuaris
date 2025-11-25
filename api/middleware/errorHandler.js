export function errorHandler(err, req, res, next) {
    console.error(err.stack || err)
    res.status(500).json({ message: err.message || 'Internal server error' })
}
