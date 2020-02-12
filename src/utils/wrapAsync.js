const wrapAsync = func => (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch(err => next(err));
};
module.exports = wrapAsync;
