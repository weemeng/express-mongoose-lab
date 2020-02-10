const wrapAsync = func => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(err)
}
module.exports = wrapAsync;