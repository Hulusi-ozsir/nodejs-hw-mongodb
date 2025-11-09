import createError from 'http-errors';

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(createError(400, 'Validation error', { details: error.details.map(d => d.message) }));
  }
  next();
};

export default validateBody;