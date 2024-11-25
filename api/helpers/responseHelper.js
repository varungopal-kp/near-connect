module.exports = {
  success: (res, data = {}, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
      status: "success",
      message: message,
      data: data,
    });
  },

  error: (res, error = {}, message = "An error occurred", statusCode = 500) => {
    return res.status(statusCode).json({
      status: "error",
      message: message,
      error: error,
    });
  },

  validationError: (
    res,
    errors = [],
    message = "Validation failed",
    statusCode = 400
  ) => {
    return res.status(statusCode).json({
      status: "error",
      message: message,
      errors: errors,
    });
  },

  unauthorized: (res, message = "Unauthorized access", statusCode = 401) => {
    return res.status(statusCode).json({
      status: "error",
      message: message,
    });
  },
};
