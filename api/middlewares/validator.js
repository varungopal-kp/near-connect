const responseHelper = require("../helpers/responseHelper");

const validator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return responseHelper.validationError(res, errors);
  }
  next();
};

module.exports = validator;
